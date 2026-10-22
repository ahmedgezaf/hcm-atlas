# Moon Learning

**A personal study atlas — one collection per subject, each written to teach.**

Two collections so far. **Oracle HCM** is Fusion HCM Cloud for functional
consultants in Egypt and the Gulf: twenty-two chapters each written twice — a readable pass and an
in-depth one — thirty-two interactive labs, eighteen diagrams, a 195-term bilingual glossary and a drill deck, covering
the three modules juniors are hired for plus the Egyptian and Saudi statutory
knowledge Oracle does not ship. Every HCM term carries the Arabic a consultant
will actually hear — the formal term, and what people say on the floor.
**Data & Analytics** covers SQL, Power BI and Excel in nine chapters, with four
labs of its own — a join visualiser, a query-execution stepper, a window-frame
demo and a DAX filter-context explorer.

Every HCM chapter can be read at two depths. A **Standard / In depth** switch
in the reader swaps the chapter for a longer version of itself — the same
ground, taken further into the mechanism, the edge cases and what actually
happens on a project. All twenty-two HCM chapters have one: ~32,000 words of
standard text become ~82,000. It is one setting for the whole site, search
reaches into both versions, and a chapter that has no long version yet says so.

The labs are the point of it: a payroll chain you break link by link and watch a
payslip react, a Fast Formula that runs in the page and shows which lines fired,
an end-of-service calculator where a rehire policy moves the money, a subject-area
grain trap that explains an inflated headcount, and routing drills for the
questions a consultant is actually asked — who decides, which door, change
request or defect.

The drill deck schedules itself: a card answered well comes back in a day, then
a week, then three weeks, and **Due today** shows only what is ready. An
**interview round** runs ten questions against a clock with no going back, then
names the chapters to reread rather than dwelling on the score. Progress lives
in your browser, so About carries a backup you can download, copy and restore on
another device.

Every chapter can be read or listened to — the browser's own speech engine reads
it aloud, highlighting where it is, with no account and no network.

The whole site is **one self-contained HTML file**. No framework, no bundler, no
`node_modules`, no server. Open it from disk and it works.

## Quick start

```bash
pip install markdown          # the only dependency
python3 build.py              # -> dist/index.html
open dist/index.html          # or: python3 -m http.server -d dist
```

Rebuild on save while writing:

```bash
pip install watchdog
python3 build.py --watch
```

## Editing without the tooling

**`dist/moon-learning.html` is the whole site as one file you can edit.** Open it
and it is the website. Open it in a text editor and every chapter is plain
Markdown near the top, with the glossary and drill questions as readable JSON
below — no build step, no Python, no Git. A guide at the top of the file says
where everything is. Hand it to Claude in any conversation and ask for changes.

If an edit breaks something — a term that does not exist, a missing comma — the
page shows a red bar saying exactly what and where. To bring the edits back into
the project:

```bash
python scripts/import_portable.py path/to/moon-learning.html          # show what would change
python scripts/import_portable.py path/to/moon-learning.html --apply  # write it
```

## What's in it

| Section | What it does |
| --- | --- |
| **Overview** | Every collection with its size and how far through it you are. |
| **Home** | Per collection: progress dashboard, a per-chapter progress chart, then the whole subject on one screen — every block opens a chapter, split Functional / Technical. |
| **Chapters** | 31 chapters, ~40,200 words — plus ~82,500 words of in-depth versions for all 22 HCM chapters |
| **Figures** | 20 inline SVG diagrams |
| **Labs** | 36 interactive pieces |
| **Glossary** | 261 terms |
| **Drill** | 149 questions |
| **Search** | <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>K</kbd>, or just <kbd>/</kbd>, across **every** collection at once — chapters, individual sections, terms, labs, figures and questions, with snippets and a jump straight to the heading that answers it. |
| **Listen** | Any chapter read aloud by the browser's speech engine, paragraph by paragraph with the current one highlighted. Offline, free, no key. |

Reader progress — terms marked known, chapters read, notes, drill mastery, and
any terms or questions the reader adds themselves — is stored in the browser.

## Repository layout

```
content/
  domains.json          the collections
  chapters/NN-id.md     one chapter each: frontmatter + Markdown
  deep/<id>.md          optional in-depth version of that chapter
  glossary.json         terms, definitions, watch-outs
  questions.json        drill questions with model answers
  images/               optional chapter cover photos (none shipped)
src/
  shell.html            page markup
  styles.css            all styles (tokens, light + dark, print)
  app.js                router, reader, glossary, drill, storage
  labs.js               the interactive labs
  figures.js            static SVG diagrams embedded in chapters
  icons.js              per-chapter marks and cover-band art
  search.js             search index and the Ctrl-K palette
  speech.js             read-a-chapter-aloud
build.py                assembles everything into dist/
portable.py             writes the editable edition, dist/moon-learning.html
scripts/smoke.js        browser smoke test
deploy/                 OCI deployment: script, cloud-init, Dockerfile
dist/                   build output (generated, but committed)
CLAUDE.md               conventions and editorial rules
```

`build.py` validates cross-references as it builds: a chapter that names a term
or lab which does not exist, a term with no chapter, a term no chapter lists, a
figure embedded in the wrong chapter or never embedded at all, a chapter missing
from the home map or from the icon set, and a cover image that is not in
`content/images/` all fail the build rather than shipping something broken.

`.github/workflows/ci.yml` runs that build on every push and pull request, checks
each `src/*.js` parses, confirms the committed `dist/` matches a fresh build, and
runs `scripts/smoke.js` — a headless pass over the real page that mounts labs,
flips a drill card, searches, and follows every section deep link in every
chapter.

## Extending it

Adding a chapter means dropping a Markdown file into `content/chapters/` with
frontmatter for its id, number, collection (`domain:`), track (`functional` or
`technical`), title,
subtitle, colour, reading time, and the labs and terms it covers — plus a block
on the home map, which the build checks for. Adding a term or a question means
appending one object to a JSON file. Adding a lab means one `LABS.push({...})`
in `src/labs.js`.
`CLAUDE.md` has the full conventions, including the editorial rules — every
chapter cites sources, statutory figures carry their date, and where sources
genuinely disagree the site says so instead of picking a side quietly.

## Deploying

**GitHub Pages** — push to `main`; `.github/workflows/pages.yml` builds and
deploys `dist/`. Enable Pages with source "GitHub Actions" once in repository
settings.

**Oracle Cloud Infrastructure** — [`deploy/README.md`](deploy/README.md) covers
four routes: an Object Storage bucket (one script, two minutes), a bucket behind
a Load Balancer for a custom domain, an Always Free Compute VM running nginx
(the one to use for a real site), and a container image for Container Instances
or OKE. `deploy/` holds the upload script, the cloud-init file and the
Dockerfile.

**Anywhere else** — `dist/index.html` is a single static file. Netlify, Cloudflare
Pages, S3, or a folder on any web server all work with no configuration.

**As a Claude Artifact** — `python3 build.py --target artifact` produces
`dist/artifact.html`, a body-only fragment for Claude's Artifact tool, which
supplies its own document wrapper. Declaring the `db` or `sample` capabilities
enables cross-device sync and the "ask about this chapter" box, but makes the
artifact organization-internal; publish without them for a shareable link.

## Sources and accuracy

Product behaviour follows Oracle's own documentation — Implementing Global Human
Resources, Implementing Absence Management, Administering Global Payroll,
Securing HCM, and the HCM Data Loader guides — with practitioner write-ups where
Oracle's text is terse. Egyptian statutory content was checked against PwC
Worldwide Tax Summaries, Deloitte and Mercans statutory alerts, and the EY,
Andersen and Amereller summaries of Labour Law No. 14 of 2025. Saudi content
follows GOSI's published rates and the Mudad/WPS employer guides. Every chapter
lists what it used.

Statutory figures were verified in 2026 and they move: Egyptian insurable-wage
limits rise 15% each January through 2027, and Saudi GOSI contribution rates are
phasing up through 2028. Verify against the authority — NOSI, the Egyptian Tax
Authority, GOSI, the Ministry of Human Resources — before quoting a number to a
client or configuring a rule.

## License

Code is MIT (see `LICENSE`). The written chapters are the author's own work;
statutory figures and Oracle product behaviour are facts drawn from the cited
sources. Oracle, Fusion, and related names are trademarks of Oracle Corporation;
this is an independent study resource and is not affiliated with or endorsed by
Oracle.
