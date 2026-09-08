# HCM Atlas

**Oracle Fusion HCM Cloud, explained for functional consultants in Egypt and the Gulf.**

Seventeen chapters written to be read, fifteen interactive labs that behave like
the system, a 122-term glossary, a drill deck for retrieval practice, and search
across all of it. It covers the three modules junior consultants are usually
hired for — Core HR, Absence Management and Payroll — plus the Egyptian and Saudi
statutory knowledge that Oracle does not ship in the product.

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

## What's in it

| Section | What it does |
| --- | --- |
| **Home** | Progress dashboard and a per-chapter progress chart, then the whole system on one screen — every block opens a chapter, split Functional / Technical. |
| **Chapters** | 17 chapters, ~11,600 words, grouped into **Functional** (12) and **Technical** (5). Each has its own colour, mark and cover band, and ends in common mistakes and sources. |
| **Figures** | 7 inline SVG diagrams drawn where the prose explains a shape — the legal/operational split, what an LDG seals off, GOSI's three populations, the WPS chain, the Egyptian leave ladder, the extension decision. |
| **Labs** | 15 interactive pieces: org tree, global-transfer stepper, payroll chain, effective-dating timelines, Egyptian social-insurance and tax calculators, leave ladder, HDL file anatomy, Fast Formula, security, methodology, headcount vs FTE. Most are embedded in their chapter too. |
| **Glossary** | Every term, one definition, the trap that comes with it, and a link to the chapter. |
| **Drill** | 40 questions with model answers plus a card for every term. Grade yourself; missed cards come back first. |
| **Search** | <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>K</kbd>, or just <kbd>/</kbd>, over chapters, every individual section, terms, labs and questions — with snippets, and a jump straight to the heading that answers it. |

Reader progress — terms marked known, chapters read, notes, drill mastery, and
any terms or questions the reader adds themselves — is stored in the browser.

## Repository layout

```
content/
  chapters/NN-id.md     one chapter each: frontmatter + Markdown
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
build.py                assembles everything into dist/
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
frontmatter for its id, number, track (`functional` or `technical`), title,
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
