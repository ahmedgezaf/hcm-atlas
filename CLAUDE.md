# Working in this repo

HCM Atlas is a study site about Oracle Fusion HCM Cloud for functional consultants
working in Egypt and the Gulf. It ships as **one self-contained HTML file** built
from Markdown and JSON by `build.py`. There is no framework, no bundler and no
`node_modules`. Keep it that way unless the user asks otherwise.

```
content/chapters/NN-id.md   one chapter each: frontmatter + Markdown
content/glossary.json       every term, its definition, its chapter
content/questions.json      drill questions with model answers
content/images/             optional chapter cover photos
src/shell.html              page markup (nav rail, main, toast)
src/styles.css              all styles, token-driven, light + dark
src/app.js                  router, chapter reader, glossary, drill, storage
src/labs.js                 the interactive labs
src/figures.js              static SVG diagrams embedded in chapters
src/icons.js                one mark per chapter, plus the cover-band art
src/search.js               the search index and the Ctrl-K palette
build.py                    assembles dist/index.html (and dist/artifact.html)
dist/                       build output — generated, but committed and CI-checked
```

`app.js` pulls the others in at `/* @include labs.js */`,
`/* @include icons.js */`, `/* @include figures.js */` and
`/* @include search.js */`. Any `src/*.js` can be included that way; the build
resolves them recursively and fails on a missing file or a cycle.

Build and check after **every** content or code change:

```bash
python3 build.py            # -> dist/index.html, validates cross-references
node --check src/app.js     # and src/labs.js, src/search.js, if you touched them
node scripts/smoke.js       # browser smoke test (needs playwright)
```

Commit the rebuilt `dist/`. CI rebuilds and fails if the committed output does
not match, so a source change without a rebuild is caught rather than shipped.

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
track: technical
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

`track` is `functional` or `technical` — nothing else builds. It groups the
Chapters list and the home map. Functional is what the business configures and
runs (structures, the data model, money, time, law, delivery); technical is what
the consultant builds with (HDL, Fast Formula, reporting, extension, security).

`hue` is an HSL hue (0–360) and becomes that chapter's colour everywhere: its
block on the home map, its labs, its glossary entries, its drill cards. Pick one
that is not already close to a neighbour's.

The home map in `renderHome` is laid out by hand, so add the new chapter to the
right track's grid there too — the build fails if a chapter is missing from it,
listed twice, or names a chapter that does not exist. Rows are three columns
wide: `two` spans two, `full` spans three, and `wide` spans three *and* goes
dashed, which the legend reads as "a foundation under every record above it".
Use `full`, not `wide`, unless that is what you mean.

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

## Adding a figure

A **lab** is something to push on; a **figure** is something to take in at a
glance. Reach for a figure when the chapter explains a shape in words — two
things held apart, a proportion, an escalation — and reach for a lab when the
reader should change an input.

Append to `src/figures.js`, then embed it with `[[fig:id]]` in the chapter:

```js
FIGS.push({ id:'cost-flow', ch:'costing', title:'Where the cost lands',
  caption:'One or two sentences. Say what the reader should notice.',
  svg: () => `<svg viewBox="0 0 760 260" role="img" aria-label="…">
    ${FIG_DEFS}
    ${F.box(30, 20, 220, 50, 'Element entry', 'what was paid')}
    …
  </svg>` });
```

The build fails if a chapter embeds a figure that does not exist, if a figure's
`ch` does not match the chapter embedding it, or if a figure is never embedded.

Rules that keep figures honest and legible:

- **No number that is not already in the chapter's prose.** A figure is a
  restatement, not a new source. Statutory figures carry the same date caveat.
- Build from the `F.*` helpers — `box`, `head`, `note`, `elbow`, `down`,
  `across`, `bar` — so spacing and type match the other diagrams.
- **SVG text does not wrap.** Pass an array to `box`'s `sub` to break a long
  caption by hand; anything past the box edge is silently clipped.
- **Bars that are compared must share a scale.** Give each one the same total
  width and let the remainder be a `ghost` segment, or the small value reads as
  an empty box rather than a small number.
- Colour comes from `var(--p)` and the tokens. Text on a solid `--p` fill uses
  `var(--surface)`, which is light when `--p` is dark and dark when it is light.
- Draw on a fixed `viewBox`; `.fig-scroll` handles narrow screens. Give every
  figure a real `aria-label` describing what it shows.

## Chapter marks and covers

Every chapter needs an entry in `ICONS` (`src/icons.js`) keyed by its id — the
build fails without one. Draw from primitives on a 24×24 grid, stroked with
`currentColor`; they are read at 16–20px, where detail turns to mud. Check a new
one against the others before keeping it: two chapters with near-identical marks
are worse than no marks.

The band at the top of a chapter uses a generated pattern in the chapter's hue
(`coverArt()`, chosen by chapter number). A chapter can override it with a
photograph via `cover: filename.jpg` in its frontmatter, read from
`content/images/` and inlined as a data URI. See `content/images/README.md` for
sizing and licensing — nothing ships with the repo.

## Search and heading ids

Every `## heading` in a chapter becomes a scroll target with a **slug id**
derived from its text (`h-bracket-elimination-for-high-earners`), so a deep link
like `#chapters/egypt-payroll/h-bracket-elimination-for-high-earners` survives
sections being reordered or labs being added. Ids are assigned in
`renderReader`; `src/search.js` computes the same slug from the same headings
when it builds the index. **The two must agree** — the smoke test checks every
section link in every chapter, which is what catches them drifting apart.

A lab renders its title as an `<h2>` inside the chapter, so lab headings are
excluded from both the table of contents and the slug numbering. They are
already reachable as their own search rows.

The index is built once, lazily, on first search, by parsing the chapter HTML
already in the page — nothing is added to the payload for it. Rows are ranked by
where a token matches (title, subtitle, body) and how well it matches: a whole
word beats a word prefix, which beats a mid-word substring. That last tier is
what stops "TRU" ranking "s-tru-ctures" above "Tax Reporting Unit (TRU)". If you
change the scoring, re-run the smoke test — two of its checks are ranking
assertions.

## Printing

`@media print` at the foot of `styles.css` turns a chapter into a clean
document: the rail, palette, notes, drill controls and table of contents are
dropped, tokens are forced back to the light set so dark-mode readers do not
print a black page, wide diagrams stop scrolling and shrink instead, and links
outside the Sources list reveal their URL. Anything new that is interactive-only
belongs in that hide list.

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

Anything wider than the reading column scrolls inside its own `.stage`. That only
works while every grid ancestor is allowed to shrink, so `.main`, `.lab`,
`.lab-body`, `.prose` and friends carry `min-width:0` — a grid item defaults to
`min-width:auto` and will otherwise stretch the page sideways rather than let its
child scroll. The smoke test checks every chapter and lab at 360px for exactly
this. Mount labs into `.lab-body`; both the labs view and the in-chapter embed
use that class.

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
