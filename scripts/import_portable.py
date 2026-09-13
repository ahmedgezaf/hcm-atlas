#!/usr/bin/env python3
"""
Bring an edited copy of the editable edition back into content/.

    python scripts/import_portable.py moon-learning.html            show what would change
    python scripts/import_portable.py moon-learning.html --apply    write it
    python scripts/import_portable.py moon-learning.html --apply --prune
                                                                    also remove chapters the file no longer has

Reads the four CONTENT sections — collections, chapters, glossary, questions —
and writes them to content/domains.json, content/chapters/NN-id.md,
content/glossary.json and content/questions.json. The ENGINE section is
ignored: the editable edition is for content, and code changes belong in src/.

Nothing is written unless every section parses. Chapters are matched by id, so
changing a chapter's num renames its file rather than duplicating it. A chapter
that exists in content/ but not in the file is reported, and only removed with
--prune.
"""

import argparse, base64, json, pathlib, re, sys

for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, "reconfigure"):
        stream.reconfigure(encoding="utf-8", errors="replace")

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
NL = "\n"


def block(html, attr):
    m = re.search(r'<script type="application/json" id="' + attr + r'">\n?(.*?)\n?</script>', html, re.S)
    if not m:
        raise SystemExit(f"Could not find the {attr} section — is this the editable edition?")
    text = m.group(1).replace("<\\/", "</")
    try:
        json.loads(text)
    except json.JSONDecodeError as e:
        lines = text.split(NL)
        line = text[:e.pos].count(NL) + 1
        prev = lines[line - 2].strip() if line >= 2 else ""
        here = lines[line - 1].strip() if line >= 1 else ""
        raise SystemExit(f"The {attr} section could not be read, around line {line} of that section.\n"
                         f"  The break is between:  {prev[:80]}\n"
                         f"                   and:  {here[:80]}\n"
                         f"  ({e.msg} — usually a missing or an extra comma.) Nothing was written.")
    return text.strip() + NL


def chapters(html):
    out = []
    for m in re.finditer(r'<script type="text/markdown" class="src-chapter">\n?(.*?)\n?</script>', html, re.S):
        text = m.group(1).strip()
        cid = re.search(r"^id:\s*(\S+)\s*$", text, re.M)
        num = re.search(r"^num:\s*(\d+)\s*$", text, re.M)
        if not (text.startswith("---") and cid and num):
            snippet = text[:60].replace(NL, " ")
            raise SystemExit(f"A chapter block is missing its --- settings, id: or num: — it starts: {snippet!r}")
        out.append({"id": cid.group(1), "num": int(num.group(1)), "text": text})
    if not out:
        raise SystemExit("No chapter blocks found — is this the editable edition?")
    ids = [c["id"] for c in out]
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    if dupes:
        raise SystemExit(f"Two or more chapters share an id: {', '.join(dupes)}")
    return out


def extract_cover(ch):
    """A cover inlined as a data URI goes back to content/images as a file."""
    m = re.search(r"^cover:\s*data:(image/[a-z+]+);base64,(\S+)\s*$", ch["text"], re.M)
    if not m:
        return None
    ext = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif"}.get(m.group(1), "bin")
    name = f"{ch['id']}-cover.{ext}"
    ch["text"] = ch["text"][:m.start()] + f"cover: {name}" + ch["text"][m.end():]
    return name, base64.b64decode(m.group(2))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file", help="the edited moon-learning.html")
    ap.add_argument("--apply", action="store_true", help="write the changes (default is a dry run)")
    ap.add_argument("--prune", action="store_true", help="with --apply, delete chapters absent from the file")
    ap.add_argument("--check", action="store_true",
                    help="exit 1 if importing would change anything (CI uses this to prove the round trip is lossless)")
    args = ap.parse_args()

    html = pathlib.Path(args.file).read_text(encoding="utf-8")
    files = {
        CONTENT / "domains.json": block(html, "src-domains"),
        CONTENT / "glossary.json": block(html, "src-glossary"),
        CONTENT / "questions.json": block(html, "src-questions"),
    }
    incoming = chapters(html)
    images = {}
    for ch in incoming:
        cover = extract_cover(ch)
        if cover:
            images[CONTENT / "images" / cover[0]] = cover[1]

    existing = {}
    for path in (CONTENT / "chapters").glob("*.md"):
        m = re.search(r"^id:\s*(\S+)\s*$", path.read_text(encoding="utf-8"), re.M)
        if m:
            existing[m.group(1)] = path

    changes, renames = [], []
    for path, text in files.items():
        if not path.exists() or path.read_text(encoding="utf-8") != text:
            changes.append((path, text))
    for ch in incoming:
        target = CONTENT / "chapters" / f"{ch['num']:02d}-{ch['id']}.md"
        text = ch["text"] + NL
        old = existing.get(ch["id"])
        if old and old != target:
            renames.append((old, target))
        if not target.exists() or target.read_text(encoding="utf-8") != text or (old and old != target):
            changes.append((target, text))
    gone = sorted(set(existing) - {c["id"] for c in incoming})

    rel = lambda p: p.relative_to(ROOT).as_posix()
    if not changes and not renames and not gone and not images:
        print("Nothing to import — content/ already matches this file.")
        return
    if args.check:
        print("The round trip is not lossless — importing this file would change content/:")
        for path, _ in changes:
            print(f"  {rel(path)}")
        sys.exit(1)

    print("Would write:" if not args.apply else "Writing:")
    for path, _ in changes:
        print(f"  {'new    ' if not path.exists() else 'changed'}  {rel(path)}")
    for old, new in renames:
        print(f"  renamed  {rel(old)} -> {rel(new)}")
    for path in images:
        print(f"  image    {rel(path)}")
    for cid in gone:
        print(f"  {'removed' if args.apply and args.prune else 'NOT IN FILE'}  {rel(existing[cid])}"
              + ("" if args.prune else "   (kept; pass --prune to remove)"))

    if not args.apply:
        print("\nDry run. Add --apply to write these, then run  python build.py  and  node scripts/smoke.js")
        return

    for old, _ in renames:
        old.unlink()
    for path, text in changes:
        path.write_text(text, encoding="utf-8", newline=NL)
    for path, data in images.items():
        path.parent.mkdir(exist_ok=True)
        path.write_bytes(data)
    if args.prune:
        for cid in gone:
            existing[cid].unlink()
    print("\nDone. Now run  python build.py  — it will refuse to build if anything references something missing.")


if __name__ == "__main__":
    main()
