# Working in this repo

HCM Atlas is a study site about Oracle Fusion HCM Cloud for functional consultants
working in Egypt and the Gulf. It ships as **one self-contained HTML file** built
from Markdown and JSON by `build.py`. There is no framework, no bundler and no
`node_modules`. Keep it that way unless the user asks otherwise.

```
content/chapters/NN-id.md   one chapter each: frontmatter + Markdown
content/glossary.json       every term, its definition, its chapter
content/questions.json      drill questions with model answers
src/shell.html              page markup (nav rail, main, toast)
src/styles.css              all styles, token-driven, light + dark
src/app.js                  router, chapter reader, glossary, drill, storage
src/labs.js                 the interactive labs
build.py                    assembles dist/index.html (and dist/artifact.html)
dist/                       build output — generated, never hand-edit
```

Build and check after **every** content or code change:

```bash
python3 build.py            # -> dist/index.html, validates cross-references
node --check src/app.js     # if you touched the JS
node scripts/smoke.js       # optional browser smoke test (needs playwright)
```

`build.py` fails the build on a chapter that references an unknown lab or term, a
term with no chapter, or a term that no chapter lists. Fix the reference; do not
loosen the validator.

## Adding a chapter

Create `content/chapters/NN-id.md`. Numbering is display order, so renumber the
files after it if you insert one in the middle.

```markdown
---
id: costing
num: 18
title: Payroll Costing
subtitle: Where HR and Finance meet
hue: 172
minutes: 7
labs: costing
terms: costing, cost-hierarchy
---

Opening paragraph — no H1, the reader renders the title from frontmatter.

## A section heading

Prose. **Bold** the term the first time it is defined.

[[lab:costing]]

## Common mistakes

- One line each, phrased as the mistake, not the fix.

## Sources

- Publisher, "Title". https://url
```

`hue` is an HSL hue (0–360) and becomes that chapter's colour everywhere: its
block on the home map, its labs, its glossary entries, its drill cards. Pick one
that is not already close to a neighbour's.

`## Common mistakes` and `## Sources` are styled specially by their exact
headings. Every chapter needs both. `[[lab:id]]` embeds a lab inline.

## Adding a term

Append to `content/glossary.json` and list the id in its chapter's `terms:`.

```json
{ "id": "cost-hierarchy", "name": "Cost hierarchy", "chapter": "costing",
  "definition": "One sentence, said the way you would say it out loud.",
  "watchOut": "The mistake a beginner makes. Optional." }
```

## Adding a drill question

Append to `content/questions.json`. The answer is a real model answer — what a
good candidate would actually say — not a pointer to a chapter.

```json
{ "chapter": "costing", "question": "…?", "answer": "…",
  "terms": ["costing"] }
```

## Adding a lab

Append to `src/labs.js`:

```js
LABS.push({ id:'costing', ch:'costing', title:'…', lead:'One or two sentences.',
  render(b){ b.innerHTML = `…`; /* wire listeners on b */ } });
```

Rules that keep labs consistent: build markup with template strings and re-render
the whole lab on state change (no virtual DOM, no persistent listeners); use the
existing classes (`.stage`, `.node`, `.explain`, `.stepper`, `.calc`, `.kv`,
`.counter`) rather than new one-off CSS; take colour from `var(--p)`, which the
chapter's hue sets; put anything wide inside `.stage`, which scrolls on its own
so the page never scrolls sideways. `termExplain('term-id')` returns the standard
definition block for an explain panel.

## Editorial rules

These are what make the site trustworthy — hold them.

- **Neutral voice.** Written for any new HCM consultant. No "you, Ahmed", no
  personal career framing. Second person is fine in advice ("ask which one the
  client means"); biography is not.
- **Every chapter cites its sources**, and prefers Oracle's own documentation for
  product behaviour and a primary or professional-firm source for statutory
  figures (PwC, Deloitte, EY, Mercans, Andersen, Amereller).
- **Statutory numbers carry their date and their volatility.** Egyptian insurable
  wage limits rise every January; Saudi GOSI rates phase up through 2028. If a
  figure is quoted, the text says when it was checked and that it must be
  re-verified.
- **Disagreement is flagged, not resolved.** Where sources genuinely differ — the
  notice period under Egypt's Law 14/2025 is the live example — say so and say
  what to verify against. Do not pick a side silently.
- **Interpolation is labelled.** The 800k/900k bracket-elimination steps in the
  tax lab follow a stated pattern rather than a cited figure, and the lab says so.
- Prose over lists. Lists are for genuine enumerations (the six absence plan
  types), not for breaking up paragraphs.

## Design

Navy (`--navy`) and gold (`--gold`) with a per-chapter accent (`--p`). Serif
(`Source Serif 4`) for reading, `Plus Jakarta Sans` for the interface, JetBrains
Mono for code. All colours are tokens declared in the bare `:root`, then
redefined under `@media (prefers-color-scheme: dark)` guarded with
`:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`.
Never write a colour that only exists inside one of those blocks, and never a
raw hex outside the token block.

## State

Reader progress (`known`, `read`, `notes`, `drill`, `custom`, `customQ`) lives in
`localStorage` under `hcm-atlas-v2`. When the page is published as a Claude
Artifact with the `db` capability it also syncs; when it is not, `claude.use()`
resolves null and the page carries on with local storage only. Both paths must
keep working — never make a feature depend on the Claude runtime being present.

## Publishing

`python3 build.py` produces `dist/index.html` for any static host. GitHub Pages
deploys it automatically from `main` via `.github/workflows/pages.yml`.
`python3 build.py --target artifact` produces the body-only fragment for Claude's
Artifact tool. Note that declaring the `db` or `sample` capabilities on an
artifact makes it organization-internal — a publicly shareable artifact must be
published without them.
