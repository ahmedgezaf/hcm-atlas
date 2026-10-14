"""
The editable edition of Moon Learning.

    python build.py                      also writes dist/moon-learning.html
    python build.py --check-portable     prove its renderer matches the build
    python scripts/import_portable.py    bring an edited copy back into content/

dist/index.html is the site as a machine wants it: every chapter compiled to
HTML and packed into one escaped JSON string. That is fine to serve and
miserable to edit. The editable edition is the same site with the content left
as the plain text it was written in — each chapter a block of Markdown, the
glossary and the questions as indented JSON — rendered in the browser when the
page opens. Open it and it is the website. Edit it in any text editor, or hand
it to Claude, and the next time it is opened the changes are there.

Nothing here replaces the repository. content/ stays the source of truth for
the deployed site; this is an export you can take anywhere, and
scripts/import_portable.py brings it home.
"""

import base64, html, json, pathlib, re, subprocess, tempfile

REQUIRED = ("id", "num", "domain", "track", "title", "subtitle", "hue", "minutes")


# ---------------------------------------------------------------------------
# Parity: the editable edition renders Markdown with src/portable-md.js rather
# than Python-Markdown. Render every chapter both ways and fail on a difference.
# ---------------------------------------------------------------------------
def check(content_dir, src_dir, parse_frontmatter, render_chapter_html):
    chapters = []
    for path in sorted((content_dir / "chapters").glob("*.md")):
        meta, body = parse_frontmatter(path.read_text(encoding="utf-8"), path.name)
        chapters.append({"id": meta["id"], "body": body, "py": render_chapter_html(body)})

    runner = (src_dir / "portable-md.js").read_text(encoding="utf-8") + """
const fs = require('fs');
const items = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
fs.writeFileSync(process.argv[3], JSON.stringify(items.map(c => mdRender(c.body))));
"""
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        (tmp / "run.js").write_text(runner, encoding="utf-8")
        (tmp / "in.json").write_text(json.dumps(chapters), encoding="utf-8")
        proc = subprocess.run(["node", str(tmp / "run.js"), str(tmp / "in.json"), str(tmp / "out.json")],
                              capture_output=True, text=True, encoding="utf-8")
        if proc.returncode:
            raise SystemExit("src/portable-md.js failed to run:\n" + proc.stderr)
        rendered = json.loads((tmp / "out.json").read_text(encoding="utf-8"))

    def norm(h):
        return re.sub(r">\s+<", "><", h).strip()

    bad = []
    for c, js in zip(chapters, rendered):
        a, b = norm(c["py"]), norm(js)
        if a != b:
            at = next((i for i, (x, y) in enumerate(zip(a, b)) if x != y), min(len(a), len(b)))
            bad.append(f"  {c['id']}: first difference at character {at}\n"
                       f"    build:    ...{a[max(0, at - 70):at + 70]!r}\n"
                       f"    portable: ...{b[max(0, at - 70):at + 70]!r}")
    if bad:
        raise SystemExit(f"The editable edition renders {len(bad)} chapter(s) differently from the build:\n"
                         + "\n".join(bad))
    return len(chapters)


# ---------------------------------------------------------------------------
# Writing the file
# ---------------------------------------------------------------------------
GUIDE = """
  MOON LEARNING  ·  editable edition
  ==================================

  This one file IS the whole website. Double-click it and it opens in your
  browser, fully working, offline. To change the site, change the text in the
  four CONTENT sections just below and save. There is no build step.

  The rest of the file, below the line marked ENGINE, is what makes the site
  work. You will almost never need to touch it.


  WHERE THINGS ARE
  ----------------
    1  COLLECTIONS       the subjects: Oracle HCM, Data & Analytics, ...
    2  CHAPTERS          one <script type="text/markdown"> block per chapter
    3  GLOSSARY          every term, as JSON
    4  DRILL QUESTIONS   every question and its model answer, as JSON

  Search this file for "CONTENT 2" and so on to jump to a section.


  TO EDIT A CHAPTER
  -----------------
  Find its block (search for  id: the-chapter-id ) and change the text. It is
  ordinary Markdown:

    ## A section heading          only ## headings, no # or ###
    **bold**  *italic*  `code`
    - a bullet                     one line each; no numbered lists
    > a highlighted note
    ```sql  ...  ```               a code block
    [[fig:id]]  [[lab:id]]         embed a diagram or an interactive lab

  Every chapter ends with a  ## Common mistakes  list and a  ## Sources  list,
  with those exact headings. Bare URLs in Sources become links on their own.


  TO ADD A CHAPTER
  ----------------
  Copy an existing chapter block, paste it next to the others, and change the
  settings between the two  ---  lines:

    id        a new lowercase-with-dashes name, unique across the site
    num       its position within its collection (1, 2, 3 ...)
    domain    which collection:  hcm  or  analytics  (see COLLECTIONS)
    track     functional  or  technical
    title / subtitle
    hue       a colour, 0 to 360 on the colour wheel
    minutes   rough reading time
    labs      lab ids used by the chapter, comma-separated (can be empty)
    terms     glossary term ids the chapter defines, comma-separated

  A new chapter also needs a small icon and a place on its collection's home
  map. Those live in the ENGINE section (search for  const ICONS  and
  const MAPS ). If you skip them the page still works and tells you so.


  TO ADD A GLOSSARY TERM
  ----------------------
  Add an entry to the GLOSSARY list, then add its id to the  terms:  line of
  the chapter it belongs to:

    { "id": "new-term", "name": "New term", "chapter": "chapter-id",
      "definition": "One sentence.", "watchOut": "The usual mistake." }

  Two more fields are optional, and only the HCM terms use them:  "ar"  is the
  formal Arabic term, and  "say"  is what people actually say on the floor.
  Both show in the glossary under the definition.

  Mind the commas between entries — JSON will not forgive a missing one.


  TO ADD A DRILL QUESTION
  -----------------------
    { "chapter": "chapter-id", "question": "...?",
      "answer": "What a good candidate would actually say.",
      "terms": ["term-id"] }


  IF YOU BREAK SOMETHING
  ----------------------
  Open the file. If a chapter points at a term, lab or figure that does not
  exist, or a JSON section has a stray comma, a red bar across the top of the
  page lists exactly what is wrong and where. Nothing is hidden: fix what it
  lists and reload.


  THE RULES THAT KEEP IT TRUSTWORTHY
  ----------------------------------
  - Every chapter cites where its facts came from.
  - Any statutory number says when it was checked, and that it moves.
  - Where sources disagree, say so; do not quietly pick one.
  - Prose over bullet points, except for genuine lists.


  PUBLISHING
  ----------
  The file works as-is anywhere that serves a web page: rename it index.html
  and upload it to GitHub Pages, an Oracle Object Storage bucket, or Netlify.

  To bring your edits back into the project folder so the automated build and
  tests pick them up, run:
      python scripts/import_portable.py path/to/moon-learning.html --apply


  FOR CLAUDE
  ----------
  When asked to change this site, edit only the four CONTENT sections unless
  the request is about behaviour or appearance. Keep every change consistent
  across sections: a new term needs its glossary entry AND its chapter's
  terms: line. Return the complete file. Open the red problem bar's checks in
  your head before handing it back — unknown ids and broken JSON are the two
  ways an edit fails.
"""


def _script_safe(text, where):
    """Content sits inside <script> elements, so it must not contain the two
    sequences that end one early or change how the parser reads it."""
    lowered = text.lower()
    for bad in ("</script", "<!--"):
        if bad in lowered:
            raise SystemExit(f"{where}: contains '{bad}', which cannot live inside the editable edition's "
                             "script blocks. Rephrase it (for example with a space after the '<').")
    return text


def _json_block(text, where):
    # "</" is a legal JSON escape as "<\/", which keeps a stray closing tag harmless.
    return _script_safe(text.replace("</", "<\\/"), where)


def _inline_cover(chapter_text, images_dir, where):
    m = re.search(r"^cover:\s*(\S+)\s*$", chapter_text, re.M)
    if not m or m.group(1).startswith("data:"):
        return chapter_text
    path = images_dir / m.group(1)
    kinds = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif"}
    kind = kinds.get(path.suffix.lower())
    if not path.exists() or not kind:
        raise SystemExit(f"{where}: cover '{m.group(1)}' is missing or not an image")
    uri = f"data:{kind};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"
    return chapter_text[:m.start()] + f"cover: {uri}" + chapter_text[m.end():]


def render(root, inline_includes, title, description, fonts, favicon):
    content, src = root / "content", root / "src"

    def rule(n, name, note):
        bar = "=" * 72
        return f"\n<!-- {bar}\n     CONTENT {n}  ·  {name}\n     {note}\n     {bar} -->\n"

    domains = _json_block((content / "domains.json").read_text(encoding="utf-8").strip(), "content/domains.json")
    glossary = _json_block((content / "glossary.json").read_text(encoding="utf-8").strip(), "content/glossary.json")
    questions = _json_block((content / "questions.json").read_text(encoding="utf-8").strip(), "content/questions.json")

    chapter_blocks = []
    for path in sorted((content / "chapters").glob("*.md")):
        text = path.read_text(encoding="utf-8").replace("\r\n", "\n").strip()
        text = _inline_cover(text, content / "images", f"content/chapters/{path.name}")
        _script_safe(text, f"content/chapters/{path.name}")
        chapter_blocks.append(f'<script type="text/markdown" class="src-chapter">\n{text}\n</script>')

    app = inline_includes((src / "app.js").read_text(encoding="utf-8"))
    loader = (src / "portable-md.js").read_text(encoding="utf-8") + "\n" + LOADER
    styles = (src / "styles.css").read_text(encoding="utf-8")
    shell = (src / "shell.html").read_text(encoding="utf-8").rstrip()

    for js, where in ((app, "src/app.js"), (loader, "the loader")):
        if "</script" in js.lower():
            raise SystemExit(f"{where}: contains '</script', which would end its <script> block early")

    # HTML5 comments may contain "--" (the guide quotes commands like --apply, which
    # must survive copy-paste intact). Only "-->" and "--!>" end one early.
    for closer in ("-->", "--!>"):
        if closer in GUIDE:
            raise SystemExit(f"the editable edition's guide contains '{closer}', which would end its comment early")
    guide = GUIDE

    return "".join([
        "<!doctype html>\n<!--", guide, "-->\n",
        '<html lang="en">\n<head>\n<meta charset="utf-8">\n',
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n',
        f"<title>{title}</title>\n",
        f'<meta name="description" content="{html.escape(description, quote=True)}">\n',
        '<meta name="color-scheme" content="light dark">\n',
        f'<link rel="icon" href="{favicon}">\n',

        rule(1, "COLLECTIONS", "The subjects the site is divided into. Chapters name one of these ids in domain:."),
        f'<script type="application/json" id="src-domains">\n{domains}\n</script>\n',

        rule(2, "CHAPTERS", "One block per chapter. Order here does not matter; num: sets the order."),
        "\n\n".join(chapter_blocks), "\n",

        rule(3, "GLOSSARY", "Every term. Its id must also appear in its chapter's terms: line."),
        f'<script type="application/json" id="src-glossary">\n{glossary}\n</script>\n',

        rule(4, "DRILL QUESTIONS", "Every question, with the answer a good candidate would give."),
        f'<script type="application/json" id="src-questions">\n{questions}\n</script>\n',

        "\n<!-- " + "#" * 72 + "\n     ENGINE  ·  everything below makes the site work. Rarely edited.\n     "
        + "#" * 72 + " -->\n\n",
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n',
        f'<link rel="stylesheet" href="{fonts}">\n',
        f"<style>\n{styles}</style>\n</head>\n<body>\n{shell}\n",
        '<script id="hcm-data" type="application/json">{}</script>\n',
        f"<script>\n{loader}\n</script>\n",
        f"<script>\n{app}\n</script>\n",
        f"<script>\n{CHECKER}\n</script>\n",
        "</body>\n</html>\n",
    ])


# ---------------------------------------------------------------------------
# In-page: turn the content blocks into the DATA object build.py would have
# produced, then check it the way build.py's validator would have.
# ---------------------------------------------------------------------------
LOADER = r"""
/* ---------- editable edition: read the content blocks ---------- */
(function () {
  var problems = [];
  window.__PORTABLE_JSON_BROKEN = false;
  /* A broken JSON section is reported on its own, with the two lines around the
     break. Every other check is then paused: one missing comma would otherwise
     surface as hundreds of "term not found" lines and bury the actual fix. */
  function json(id, label) {
    var raw = document.getElementById(id).textContent.replace(/^\s*\n/, '');
    try { return JSON.parse(raw); }
    catch (e) {
      var where = '', pos = (String(e.message).match(/position (\d+)/) || [])[1];
      if (pos !== undefined) {
        var line = raw.slice(0, +pos).split('\n').length, lines = raw.split('\n');
        where = ', around line ' + line + ' of that section. The break is between  ' +
          (lines[line - 2] || '').trim().slice(0, 70) + '  and  ' + (lines[line - 1] || '').trim().slice(0, 70);
      }
      problems.push(label + ' could not be read' + where + '. The usual cause is a missing or an extra comma.');
      window.__PORTABLE_JSON_BROKEN = true;
      return [];
    }
  }
  var domains = json('src-domains', 'CONTENT 1 · COLLECTIONS');
  var glossary = json('src-glossary', 'CONTENT 3 · GLOSSARY');
  var questions = json('src-questions', 'CONTENT 4 · DRILL QUESTIONS');
  var chapters = [];
  var REQUIRED = ['id', 'num', 'domain', 'track', 'title', 'subtitle', 'hue', 'minutes'];
  document.querySelectorAll('script.src-chapter').forEach(function (el, i) {
    try {
      var parsed = mdFrontmatter(el.textContent.trim()), meta = parsed.meta;
      REQUIRED.forEach(function (k) {
        if (meta[k] === undefined || meta[k] === '' || (typeof meta[k] === 'number' && isNaN(meta[k])))
          throw new Error('its settings are missing "' + k + ':"');
      });
      chapters.push({ _i: i, id: meta.id, num: meta.num, domain: meta.domain, track: meta.track,
        title: meta.title, sub: meta.subtitle, hue: meta.hue, minutes: meta.minutes,
        labs: meta.labs, terms: meta.terms, html: mdRender(parsed.body),
        cover: /^data:/.test(meta.cover || '') ? meta.cover : '' });
    } catch (e) {
      var hint = (el.textContent.match(/^id:\s*(\S+)/m) || [])[1];
      problems.push('CONTENT 2 · chapter block ' + (i + 1) + (hint ? ' (id: ' + hint + ')' : '') + ': ' + e.message);
    }
  });
  chapters.sort(function (a, b) { return a.num - b.num || a._i - b._i; });
  chapters.forEach(function (c) { delete c._i; });
  var data = {
    domains: domains,
    chapters: chapters,
    terms: glossary.map(function (t) { return { id: t.id, name: t.name, what: t.definition, trap: t.watchOut || '', ch: t.chapter, ar: t.ar || '', say: t.say || '' }; }),
    questions: questions.map(function (q) { return { ch: q.chapter, q: q.question, a: q.answer, terms: q.terms || [] }; })
  };
  document.getElementById('hcm-data').textContent = JSON.stringify(data);
  window.__PORTABLE_PROBLEMS = problems;
})();
"""

CHECKER = r"""
/* ---------- editable edition: the build's checks, run in the page ---------- */
(function () {
  var P = (window.__PORTABLE_PROBLEMS || []).slice();
  if (window.__PORTABLE_JSON_BROKEN) {
    P.push('The other checks are paused until that section can be read again — fix it first, then reload.');
  } else try {
    var chIds = new Set(CH.map(function (c) { return c.id; }));
    var termIds = new Set(DATA.terms.map(function (t) { return t.id; }));
    var labIds = new Set(LABS.map(function (l) { return l.id; }));
    var domIds = new Set(DATA.domains.map(function (d) { return d.id; }));
    var embedded = new Set(), seen = {};
    CH.forEach(function (c) {
      if (seen[c.id]) P.push('Two chapters share the id "' + c.id + '"');
      seen[c.id] = 1;
      if (!domIds.has(c.domain)) P.push('Chapter ' + c.id + ': domain "' + c.domain + '" is not one of the COLLECTIONS');
      if (c.track !== 'functional' && c.track !== 'technical') P.push('Chapter ' + c.id + ': track must be functional or technical');
      c.labs.forEach(function (l) { if (!labIds.has(l)) P.push('Chapter ' + c.id + ': labs: names "' + l + '", which does not exist'); });
      c.terms.forEach(function (t) { if (!termIds.has(t)) P.push('Chapter ' + c.id + ': terms: names "' + t + '", which is not in the GLOSSARY'); });
      Array.from(c.html.matchAll(/data-lab="([a-z0-9-]+)"/g)).forEach(function (m) {
        if (!labIds.has(m[1])) P.push('Chapter ' + c.id + ': [[lab:' + m[1] + ']] does not exist');
      });
      Array.from(c.html.matchAll(/data-fig="([a-z0-9-]+)"/g)).forEach(function (m) {
        embedded.add(m[1]);
        var f = FIGS.find(function (x) { return x.id === m[1]; });
        if (!f) P.push('Chapter ' + c.id + ': [[fig:' + m[1] + ']] does not exist');
        else if (f.ch !== c.id) P.push('Chapter ' + c.id + ': figure "' + m[1] + '" belongs to chapter "' + f.ch + '"');
      });
      if (!ICONS[c.id]) P.push('Chapter ' + c.id + ': has no icon yet (ENGINE → const ICONS)');
    });
    var listed = new Set();
    CH.forEach(function (c) { c.terms.forEach(function (t) { listed.add(t); }); });
    DATA.terms.forEach(function (t) {
      if (!chIds.has(t.ch)) P.push('Glossary term ' + t.id + ': chapter "' + t.ch + '" does not exist');
      if (!listed.has(t.id)) P.push('Glossary term ' + t.id + ': not listed in any chapter’s terms: line');
    });
    DATA.questions.forEach(function (q, i) {
      if (!chIds.has(q.ch)) P.push('Drill question ' + (i + 1) + ': chapter "' + q.ch + '" does not exist');
      q.terms.forEach(function (t) { if (!termIds.has(t)) P.push('Drill question ' + (i + 1) + ': term "' + t + '" is not in the GLOSSARY'); });
    });
    FIGS.forEach(function (f) { if (!embedded.has(f.id)) P.push('Figure ' + f.id + ': never embedded with [[fig:' + f.id + ']]'); });
    var mapped = [];
    Object.keys(MAPS).forEach(function (d) { MAPS[d](function (id) { mapped.push(id); return ''; }, function () { return ''; }); });
    CH.forEach(function (c) {
      if (MAPS[c.domain] && mapped.indexOf(c.id) < 0) P.push('Chapter ' + c.id + ': not on the ' + c.domain + ' home map yet (ENGINE → const MAPS)');
    });
  } catch (e) {
    P.push('The page could not finish checking itself: ' + e.message);
  }
  window.PORTABLE_PROBLEMS = P;
  if (!P.length) return;
  var bar = document.createElement('div');
  bar.id = 'portableProblems';
  bar.setAttribute('role', 'alert');
  bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;max-height:45vh;overflow:auto;' +
    'background:#7f1d1d;color:#fff;font:14px/1.5 system-ui,sans-serif;padding:12px 44px 12px 18px;box-shadow:0 6px 24px rgba(0,0,0,.35)';
  bar.innerHTML = '<b>' + P.length + ' thing' + (P.length > 1 ? 's' : '') + ' to fix in this file</b>' +
    '<ul style="margin:6px 0 0;padding-left:20px">' +
    P.map(function (p) { return '<li>' + p.replace(/[&<>]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]; }) + '</li>'; }).join('') +
    '</ul><button aria-label="Hide" style="position:absolute;top:8px;right:12px;background:none;border:0;color:#fff;font-size:22px;cursor:pointer">×</button>';
  bar.querySelector('button').onclick = function () { bar.remove(); };
  document.body.appendChild(bar);
})();
"""
