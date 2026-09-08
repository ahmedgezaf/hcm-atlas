#!/usr/bin/env python3
"""
Build HCM Atlas into a single self-contained HTML file.

    python3 build.py                 -> dist/index.html   (standalone website)
    python3 build.py --target artifact -> dist/artifact.html (Claude Artifact body)
    python3 build.py --watch         -> rebuild on change (needs `pip install watchdog`)

Everything is inlined: no build server, no bundler, no node_modules. The only
Python dependency is `markdown`.

Inputs
    content/chapters/NN-id.md   one chapter each, frontmatter + Markdown body
    content/glossary.json       [{id, name, chapter, definition, watchOut}]
    content/questions.json      [{chapter, question, answer, terms[]}]
    src/shell.html              page markup (nav rail + main + toast)
    src/styles.css              all styles
    src/app.js                  the application; `/* @include labs.js */` marker
    src/labs.js                 interactive labs, injected at that marker

Output targets
    site      full HTML document, for GitHub Pages or any static host.
    artifact  body-only fragment for Claude's Artifact tool, which supplies its
              own <!doctype>/<head>/<body> wrapper at publish time.
"""

import argparse, html, json, pathlib, re, sys

try:
    import markdown
except ImportError:
    sys.exit("Missing dependency. Run:  pip install markdown")

ROOT = pathlib.Path(__file__).parent
CONTENT, SRC, DIST = ROOT / "content", ROOT / "src", ROOT / "dist"

TITLE = "HCM Atlas"
DESCRIPTION = ("Oracle Fusion HCM Cloud explained for functional consultants in Egypt and the Gulf: "
               "17 chapters, interactive labs, a glossary and a drill deck.")
FONTS = ("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800"
         "&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400"
         "&family=JetBrains+Mono:wght@400;600&display=swap")
FAVICON = ("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>"
           "<rect width='32' height='32' rx='7' fill='%230B1F3A'/>"
           "<text x='16' y='23' font-family='system-ui,sans-serif' font-size='19' font-weight='800'"
           " fill='%23B8871B' text-anchor='middle'>H</text></svg>")

LIST_FIELDS = {"labs", "terms"}
INT_FIELDS = {"num", "hue", "minutes"}


def parse_frontmatter(text, path):
    """Minimal `---` frontmatter: `key: value`, with comma lists for labs/terms."""
    if not text.startswith("---"):
        raise SystemExit(f"{path}: missing --- frontmatter block")
    _, fm, body = text.split("---", 2)
    meta = {}
    for line in fm.strip().splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        key, _, value = line.partition(":")
        key, value = key.strip(), value.strip()
        if key in LIST_FIELDS:
            meta[key] = [v.strip() for v in value.split(",") if v.strip()]
        elif key in INT_FIELDS:
            meta[key] = int(value)
        else:
            meta[key] = value
    for required in ("id", "num", "title", "subtitle", "hue", "minutes"):
        if required not in meta:
            raise SystemExit(f"{path}: frontmatter is missing `{required}`")
    meta.setdefault("labs", [])
    meta.setdefault("terms", [])
    return meta, body.strip()


def render_chapter_html(body):
    """Markdown -> HTML, with lab embeds and two specially-styled trailing sections."""
    body = re.sub(r"\[\[lab:([a-z0-9-]+)\]\]", r'<div class="lab-embed" data-lab="\1"></div>', body)
    out = markdown.markdown(body, extensions=["fenced_code"])
    sections = []
    for chunk in re.split(r"(?=<h2>)", out):
        if chunk.startswith("<h2>Common mistakes"):
            chunk = f'<div class="mistakes">{chunk}</div>'
        elif chunk.startswith("<h2>Sources"):
            chunk = re.sub(r"(https?://[^\s<]+)",
                           r'<a href="\1" target="_blank" rel="noopener">\1</a>', chunk)
            chunk = f'<div class="sources">{chunk}</div>'
        sections.append(chunk)
    return "".join(sections)


def load_content():
    files = sorted((CONTENT / "chapters").glob("*.md"))
    if not files:
        raise SystemExit("No chapters found in content/chapters/")
    chapters = []
    for path in files:
        meta, body = parse_frontmatter(path.read_text(encoding="utf-8"), path.name)
        chapters.append({
            "id": meta["id"], "num": meta["num"], "title": meta["title"],
            "sub": meta["subtitle"], "hue": meta["hue"], "minutes": meta["minutes"],
            "labs": meta["labs"], "terms": meta["terms"], "html": render_chapter_html(body),
        })
    chapters.sort(key=lambda c: c["num"])

    glossary = json.loads((CONTENT / "glossary.json").read_text(encoding="utf-8"))
    questions = json.loads((CONTENT / "questions.json").read_text(encoding="utf-8"))
    terms = [{"id": t["id"], "name": t["name"], "what": t["definition"],
              "trap": t.get("watchOut", ""), "ch": t["chapter"]} for t in glossary]
    qs = [{"ch": q["chapter"], "q": q["question"], "a": q["answer"],
           "terms": q.get("terms", [])} for q in questions]
    return {"chapters": chapters, "terms": terms, "questions": qs}


def validate(data):
    """Fail the build on broken cross-references rather than shipping dead links."""
    problems = []
    chapter_ids = {c["id"] for c in data["chapters"]}
    term_ids = {t["id"] for t in data["terms"]}
    lab_ids = set(re.findall(r"LABS\.push\(\{\s*id:\s*'([a-z0-9-]+)'", (SRC / "labs.js").read_text()))

    for c in data["chapters"]:
        for lab in c["labs"]:
            if lab not in lab_ids:
                problems.append(f"chapter {c['id']}: unknown lab '{lab}'")
        for t in c["terms"]:
            if t not in term_ids:
                problems.append(f"chapter {c['id']}: unknown term '{t}'")
        for lab in re.findall(r'class="lab-embed" data-lab="([a-z0-9-]+)"', c["html"]):
            if lab not in lab_ids:
                problems.append(f"chapter {c['id']}: embeds unknown lab '{lab}'")
    for t in data["terms"]:
        if t["ch"] not in chapter_ids:
            problems.append(f"term {t['id']}: unknown chapter '{t['ch']}'")
    for i, q in enumerate(data["questions"]):
        if q["ch"] not in chapter_ids:
            problems.append(f"question {i}: unknown chapter '{q['ch']}'")
        for t in q["terms"]:
            if t not in term_ids:
                problems.append(f"question {i}: unknown term '{t}'")

    orphan_terms = term_ids - {t for c in data["chapters"] for t in c["terms"]}
    for t in sorted(orphan_terms):
        problems.append(f"term {t}: not listed in any chapter's `terms`")

    if problems:
        raise SystemExit("Build failed:\n  " + "\n  ".join(problems))


def build(target="site"):
    data = load_content()
    validate(data)

    app = (SRC / "app.js").read_text(encoding="utf-8")
    app = app.replace("/* @include labs.js */", (SRC / "labs.js").read_text(encoding="utf-8"))
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")

    body = "\n".join([
        (SRC / "shell.html").read_text(encoding="utf-8").rstrip(),
        f'<script id="hcm-data" type="application/json">{payload}</script>',
        f"<script>\n{app}\n</script>",
    ])
    styles = f"<style>\n{(SRC / 'styles.css').read_text(encoding='utf-8')}</style>"

    if target == "artifact":
        # Claude's Artifact tool supplies doctype/head/body; ship title + styles + body.
        page = f"<title>{TITLE}</title>\n<link rel=\"stylesheet\" href=\"{FONTS}\">\n{styles}\n{body}\n"
        name = "artifact.html"
    else:
        page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{TITLE}</title>
<meta name="description" content="{html.escape(DESCRIPTION, quote=True)}">
<meta name="color-scheme" content="light dark">
<meta property="og:title" content="{TITLE}">
<meta property="og:description" content="{html.escape(DESCRIPTION, quote=True)}">
<meta property="og:type" content="website">
<link rel="icon" href="{FAVICON}">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
{styles}
</head>
<body>
{body}
</body>
</html>
"""
        name = "index.html"

    DIST.mkdir(exist_ok=True)
    out = DIST / name
    out.write_text(page, encoding="utf-8")

    words = sum(len(re.sub(r"<[^>]+>", " ", c["html"]).split()) for c in data["chapters"])
    print(f"✓ {out.relative_to(ROOT)}  —  {len(page)//1024} KB")
    print(f"  {len(data['chapters'])} chapters · ~{words:,} words · "
          f"{len(data['terms'])} terms · {len(data['questions'])} questions")
    return out


def watch():
    try:
        from watchdog.observers import Observer
        from watchdog.events import FileSystemEventHandler
    except ImportError:
        sys.exit("Watch mode needs watchdog. Run:  pip install watchdog")
    import time

    class Handler(FileSystemEventHandler):
        def on_any_event(self, event):
            if event.is_directory or event.src_path.endswith("~"):
                return
            try:
                build()
            except SystemExit as e:
                print(e)

    build()
    observer = Observer()
    for folder in (CONTENT, SRC):
        observer.schedule(Handler(), str(folder), recursive=True)
    observer.start()
    print("Watching content/ and src/ — Ctrl-C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--target", choices=["site", "artifact"], default="site")
    ap.add_argument("--watch", action="store_true", help="rebuild on file change")
    args = ap.parse_args()
    watch() if args.watch else build(args.target)
