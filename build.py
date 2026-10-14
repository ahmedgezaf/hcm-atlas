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

import argparse, base64, html, json, pathlib, re, sys

try:
    import markdown
except ImportError:
    sys.exit("Missing dependency. Run:  pip install markdown")

# Windows consoles default to cp1252, which cannot encode the glyphs below.
for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, "reconfigure"):
        stream.reconfigure(encoding="utf-8", errors="replace")

ROOT = pathlib.Path(__file__).parent
CONTENT, SRC, DIST = ROOT / "content", ROOT / "src", ROOT / "dist"
IMAGES = CONTENT / "images"
COVER_TYPES = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif"}

TITLE = "Moon Learning"
DESCRIPTION = ("A personal learning atlas: Oracle Fusion HCM Cloud for consultants in Egypt and the Gulf, "
               "and the SQL, Power BI and Excel toolkit behind data analytics. Chapters, interactive labs, "
               "a glossary and a drill deck.")
FONTS = ("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800"
         "&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400"
         "&family=JetBrains+Mono:wght@400;600"
         "&family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap")
FAVICON = ("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>"
           "<rect width='32' height='32' rx='7' fill='%230B1F3A'/>"
           "<text x='16' y='23' font-family='system-ui,sans-serif' font-size='19' font-weight='800'"
           " fill='%23B8871B' text-anchor='middle'>H</text></svg>")

TRACKS = ("functional", "technical")
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
    for required in ("id", "num", "domain", "track", "title", "subtitle", "hue", "minutes"):
        if required not in meta:
            raise SystemExit(f"{path}: frontmatter is missing `{required}`")
    domain_ids = {d["id"] for d in json.loads((CONTENT / "domains.json").read_text(encoding="utf-8"))}
    if meta["domain"] not in domain_ids:
        raise SystemExit(f"{path}: domain must be one of {', '.join(sorted(domain_ids))}, not '{meta['domain']}'")
    if meta["track"] not in TRACKS:
        raise SystemExit(f"{path}: track must be one of {', '.join(TRACKS)}, not '{meta['track']}'")
    meta.setdefault("labs", [])
    meta.setdefault("terms", [])
    return meta, body.strip()


def render_chapter_html(body):
    """Markdown -> HTML, with lab embeds and two specially-styled trailing sections."""
    body = re.sub(r"\[\[lab:([a-z0-9-]+)\]\]", r'<div class="lab-embed" data-lab="\1"></div>', body)
    body = re.sub(r"\[\[fig:([a-z0-9-]+)\]\]", r'<figure class="fig-embed" data-fig="\1"></figure>', body)
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


def load_cover(name, chapter_id):
    """A chapter's `cover:` image, inlined as a data URI. Keeps the one-file
    promise; the cost is that the image is ~33% larger than on disk."""
    path = IMAGES / name
    if not path.exists():
        raise SystemExit(f"chapter {chapter_id}: cover '{name}' not found in content/images/")
    kind = COVER_TYPES.get(path.suffix.lower())
    if not kind:
        raise SystemExit(f"chapter {chapter_id}: cover '{name}' must be one of {', '.join(sorted(COVER_TYPES))}")
    raw = path.read_bytes()
    if len(raw) > 400_000:
        print(f"  ! {name} is {len(raw)//1024} KB; covers above ~400 KB bloat the page badly")
    return f"data:{kind};base64,{base64.b64encode(raw).decode('ascii')}"


def load_content():
    files = sorted((CONTENT / "chapters").glob("*.md"))
    if not files:
        raise SystemExit("No chapters found in content/chapters/")
    chapters = []
    for path in files:
        meta, body = parse_frontmatter(path.read_text(encoding="utf-8"), path.name)
        chapters.append({
            "id": meta["id"], "num": meta["num"], "domain": meta["domain"], "track": meta["track"],
            "title": meta["title"],
            "sub": meta["subtitle"], "hue": meta["hue"], "minutes": meta["minutes"],
            "labs": meta["labs"], "terms": meta["terms"], "html": render_chapter_html(body),
            "cover": load_cover(meta["cover"], meta["id"]) if meta.get("cover") else "",
        })
    chapters.sort(key=lambda c: c["num"])

    domains = json.loads((CONTENT / "domains.json").read_text(encoding="utf-8"))
    glossary = json.loads((CONTENT / "glossary.json").read_text(encoding="utf-8"))
    questions = json.loads((CONTENT / "questions.json").read_text(encoding="utf-8"))
    terms = [{"id": t["id"], "name": t["name"], "what": t["definition"],
              "trap": t.get("watchOut", ""), "ch": t["chapter"],
              "ar": t.get("ar", ""), "say": t.get("say", "")} for t in glossary]
    qs = [{"ch": q["chapter"], "q": q["question"], "a": q["answer"],
           "terms": q.get("terms", [])} for q in questions]
    return {"domains": domains, "chapters": chapters, "terms": terms, "questions": qs}


def validate(data):
    """Fail the build on broken cross-references rather than shipping dead links."""
    problems = []
    chapter_ids = {c["id"] for c in data["chapters"]}
    term_ids = {t["id"] for t in data["terms"]}
    lab_ids = set(re.findall(r"LABS\.push\(\{\s*id:\s*'([a-z0-9-]+)'", (SRC / "labs.js").read_text(encoding="utf-8")))
    figs_src = (SRC / "figures.js").read_text(encoding="utf-8")
    fig_ids = set(re.findall(r"id:\s*'([a-z0-9-]+)',\s*$", figs_src, re.M))
    fig_owner = dict(re.findall(r"id:\s*'([a-z0-9-]+)',\s*\n\s*ch:\s*'([a-z0-9-]+)'", figs_src))
    embedded_figs = set()
    icon_ids = set(re.findall(r"^  '?([a-z0-9-]+)'?:", (SRC / "icons.js").read_text(encoding="utf-8"), re.M))

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
        for fig in re.findall(r'class="fig-embed" data-fig="([a-z0-9-]+)"', c['html']):
            embedded_figs.add(fig)
            if fig not in fig_ids:
                problems.append(f"chapter {c['id']}: embeds unknown figure '{fig}'")
            elif fig_owner.get(fig) != c['id']:
                problems.append(f"chapter {c['id']}: figure '{fig}' declares ch='{fig_owner.get(fig)}'")
    for t in data["terms"]:
        if t["ch"] not in chapter_ids:
            problems.append(f"term {t['id']}: unknown chapter '{t['ch']}'")
    for i, q in enumerate(data["questions"]):
        if q["ch"] not in chapter_ids:
            problems.append(f"question {i}: unknown chapter '{q['ch']}'")
        for t in q["terms"]:
            if t not in term_ids:
                problems.append(f"question {i}: unknown term '{t}'")

    # The home map is hand-laid-out in renderHome, so a new chapter is easy to
    # add and forget. Every chapter must appear on it exactly once.
    mapped = re.findall(r"node\('([a-z0-9-]+)'", (SRC / "app.js").read_text(encoding="utf-8"))
    for cid in sorted(chapter_ids - set(mapped)):
        problems.append(f"chapter {cid}: missing from the home map in renderHome")
    for cid in sorted(set(mapped) - chapter_ids):
        problems.append(f"home map: node('{cid}') is not a chapter")
    for cid in sorted({m for m in mapped if mapped.count(m) > 1}):
        problems.append(f"home map: node('{cid}') appears {mapped.count(cid)} times")

    for fig in sorted(fig_ids - embedded_figs):
        problems.append(f"figure {fig}: never embedded with [[fig:{fig}]]")

    for cid in sorted(chapter_ids - icon_ids):
        problems.append(f"chapter {cid}: no entry in ICONS (src/icons.js)")

    orphan_terms = term_ids - {t for c in data["chapters"] for t in c["terms"]}
    for t in sorted(orphan_terms):
        problems.append(f"term {t}: not listed in any chapter's `terms`")

    if problems:
        raise SystemExit("Build failed:\n  " + "\n  ".join(problems))


INCLUDE = re.compile(r"^[ 	]*/\* @include ([\w.-]+) \*/[ 	]*$", re.M)


def inline_includes(source, seen=None):
    """Replace `/* @include name.js */` with src/name.js, recursively."""
    seen = seen or set()

    def sub(match):
        name = match.group(1)
        if name in seen:
            raise SystemExit(f"circular @include of {name}")
        path = SRC / name
        if not path.exists():
            raise SystemExit(f"@include {name}: no such file in src/")
        return inline_includes(path.read_text(encoding="utf-8"), seen | {name})

    return INCLUDE.sub(sub, source)


def build(target="site"):
    data = load_content()
    validate(data)

    app = inline_includes((SRC / "app.js").read_text(encoding="utf-8"))
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
    # newline="\n" keeps the output byte-identical on Windows, where
    # text mode would otherwise translate every \n into \r\n.
    out.write_text(page, encoding="utf-8", newline="\n")

    words = sum(len(re.sub(r"<[^>]+>", " ", c["html"]).split()) for c in data["chapters"])
    print(f"✓ {out.relative_to(ROOT)}  —  {len(page)//1024} KB")
    print(f"  {len(data['chapters'])} chapters · ~{words:,} words · "
          f"{len(data['terms'])} terms · {len(data['questions'])} questions")
    if target == "site":
        # The editable edition: the same site with its content left as plain
        # Markdown and JSON, rendered in the browser. See portable.py.
        import portable
        editable = portable.render(ROOT, inline_includes, TITLE, DESCRIPTION, FONTS, FAVICON)
        (DIST / "moon-learning.html").write_text(editable, encoding="utf-8", newline=chr(10))
        print(f"✓ dist/moon-learning.html  —  {len(editable)//1024} KB  (editable edition)")
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
    ap.add_argument("--check-portable", action="store_true",
                    help="prove the editable edition renders every chapter exactly as the build does")
    args = ap.parse_args()
    if args.check_portable:
        import portable
        n = portable.check(CONTENT, SRC, parse_frontmatter, render_chapter_html)
        print(f"✓ the editable edition renders all {n} chapters exactly as the build does")
    elif args.watch:
        watch()
    else:
        build(args.target)
