# HCM Atlas

**Oracle Fusion HCM Cloud, explained for functional consultants in Egypt and the Gulf.**

Seventeen chapters written to be read, fifteen interactive labs that behave like
the system, a 122-term glossary, and a drill deck for retrieval practice. It
covers the three modules junior consultants are usually hired for — Core HR,
Absence Management and Payroll — plus the Egyptian and Saudi statutory knowledge
that Oracle does not ship in the product.

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
| **Home** | The whole system on one screen — every block opens a chapter. |
| **Chapters** | 17 chapters, ~11,600 words, each ending in common mistakes and sources. |
| **Labs** | 15 interactive pieces: org tree, global-transfer stepper, payroll chain, effective-dating timelines, Egyptian social-insurance and tax calculators, leave ladder, HDL file anatomy, Fast Formula, security, methodology, headcount vs FTE. Most are embedded in their chapter too. |
| **Glossary** | Every term, one definition, the trap that comes with it, and a link to the chapter. |
| **Drill** | 40 questions with model answers plus a card for every term. Grade yourself; missed cards come back first. |

Reader progress — terms marked known, chapters read, notes, drill mastery, and
any terms or questions the reader adds themselves — is stored in the browser.

## Repository layout

```
content/
  chapters/NN-id.md     one chapter each: frontmatter + Markdown
  glossary.json         terms, definitions, watch-outs
  questions.json        drill questions with model answers
src/
  shell.html            page markup
  styles.css            all styles (tokens, light + dark)
  app.js                router, reader, glossary, drill, storage
  labs.js               the interactive labs
build.py                assembles everything into dist/
dist/                   build output (generated)
CLAUDE.md               conventions and editorial rules
```

`build.py` validates cross-references as it builds: a chapter that names a term
or lab which does not exist, a term with no chapter, or a term no chapter lists
all fail the build rather than shipping a dead link.

## Extending it

Adding a chapter means dropping a Markdown file into `content/chapters/` with
frontmatter for its id, number, title, subtitle, colour, reading time, and the
labs and terms it covers. Adding a term or a question means appending one object
to a JSON file. Adding a lab means one `LABS.push({...})` in `src/labs.js`.
`CLAUDE.md` has the full conventions, including the editorial rules — every
chapter cites sources, statutory figures carry their date, and where sources
genuinely disagree the site says so instead of picking a side quietly.

## Deploying

**GitHub Pages** — push to `main`; `.github/workflows/pages.yml` builds and
deploys `dist/`. Enable Pages with source "GitHub Actions" once in repository
settings.

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
