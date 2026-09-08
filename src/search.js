/* =====================================================================
   SEARCH — a keyboard-first palette over everything on the site.
   ---------------------------------------------------------------------
   Indexes five kinds of row: whole chapters, individual chapter sections
   (every H2, which is also a scroll target), glossary terms, labs and
   drill questions. The index is built once, lazily, on first open, by
   parsing the chapter HTML that is already in the page — nothing is added
   to the payload for it.
   ===================================================================== */

const KIND = {
  chapter:  { label: 'Chapter',  w: 30 },
  section:  { label: 'Section',  w: 18 },
  term:     { label: 'Term',     w: 24 },
  lab:      { label: 'Lab',      w: 14 },
  figure:   { label: 'Figure',   w: 16 },
  question: { label: 'Question', w: 8  },
};

let IDX = null;

/* Chapter HTML as a flat list of elements, with the two specially-wrapped
   trailing sections unwrapped so an H2 inside them still starts a section. */
function flattenChapter(html) {
  const root = document.createElement('div');
  root.innerHTML = html;
  const out = [];
  [...root.children].forEach(el => {
    const wrap = el.classList.contains('mistakes') || el.classList.contains('sources');
    if (wrap) [...el.children].forEach(child => out.push({ el: child, sources: el.classList.contains('sources') }));
    else out.push({ el, sources: false });
  });
  return out;
}

function buildIndex() {
  if (IDX) return IDX;
  const rows = [];
  const add = (kind, title, sub, body, nav) => rows.push({
    kind, title, sub, body, nav,
    tl: title.toLowerCase(), sl: (sub || '').toLowerCase(), bl: (body || '').toLowerCase(),
  });

  CH.forEach(c => {
    const blocks = flattenChapter(c.html);
    // Chapter row: its own body is the whole readable text.
    const whole = blocks.filter(b => !b.sources).map(b => b.el.textContent).join(' ').replace(/\s+/g, ' ').trim();
    add('chapter', c.title, c.sub, whole, { ch: c.id });

    // Section rows, keyed by the same slug renderReader gives the heading, so a
    // hit can scroll straight to it. Labs are indexed separately, and their
    // headings are not chapter sections, so they take no part in the numbering.
    const taken = new Set();
    let row = null, text = [];
    const closeSection = () => {
      if (!row) return;
      row.body = text.join(' ').replace(/\s+/g, ' ').trim();
      row.bl = row.body.toLowerCase();
      row = null; text = [];
    };
    blocks.forEach(b => {
      if (b.el.tagName === 'H2') {
        closeSection();
        if (b.sources) return;              // the Sources list is not a destination
        add('section', b.el.textContent, c.title, '',
          { ch: c.id, sec: slugId(b.el.textContent, taken), hue: c.hue });
        row = rows[rows.length - 1];
      } else if (row && !b.sources) {
        text.push(b.el.textContent);
      }
    });
    closeSection();
  });

  allTerms().forEach(t => {
    const c = chById(t.ch);
    add('term', t.name, c ? c.title : '', [t.what, t.trap].filter(Boolean).join(' '),
      { term: t.name, ch: t.ch, hue: c ? c.hue : 210 });
  });

  LABS.forEach(l => {
    const c = chById(l.ch);
    add('lab', l.title, c ? c.title : '', l.lead, { lab: l.id, hue: c ? c.hue : 210 });
  });

  FIGS.forEach(f => {
    const c = chById(f.ch);
    add('figure', f.title, c ? c.title : '', f.caption,
      { ch: f.ch, fig: 'fig-' + f.id, hue: c ? c.hue : 210 });
  });

  DATA.questions.forEach((q, i) => {
    const c = chById(q.ch);
    add('question', q.q, c ? c.title : '', q.a, { q: 'q:' + i, ch: q.ch, hue: c ? c.hue : 210 });
  });

  // Chapters carry their own hue for the row accent.
  rows.forEach(r => { if (r.nav.hue == null) { const c = chById(r.nav.ch); r.nav.hue = c ? c.hue : 210; } });
  IDX = rows;
  return IDX;
}

/* ---------- matching ---------- */
const rxEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Each token carries two precompiled patterns so a match can be graded.
   Without this, "TRU" scores as highly inside "s-tru-ctures" as it does in
   "Tax Reporting Unit (TRU)". */
function tokenize(q) {
  return q.toLowerCase().split(/\s+/).map(t => t.trim()).filter(Boolean).slice(0, 6).map(t => ({
    t,
    whole: new RegExp('\\b' + rxEsc(t) + '\\b', 'i'),   // the token is a word of its own
    start: new RegExp('\\b' + rxEsc(t), 'ig'),          // the token begins a word
  }));
}

/* 2 = whole word, 1 = starts a word, 0 = only mid-word, -1 = absent. */
function tier(hay, tk) {
  if (!hay) return -1;
  if (tk.whole.test(hay)) return 2;
  tk.start.lastIndex = 0;
  if (tk.start.test(hay)) return 1;
  return hay.includes(tk.t) ? 0 : -1;
}

const TITLE = [10, 48, 70], SUB = [4, 18, 24], BODY = [2, 7, 10];

function scoreRow(r, toks, phraseRx) {
  let s = 0;
  for (const tk of toks) {
    const tT = tier(r.tl, tk), tS = tier(r.sl, tk), tB = tier(r.bl, tk);
    if (tT < 0 && tS < 0 && tB < 0) return 0;          // every token must appear somewhere
    if (tT >= 0) s += TITLE[tT] + (r.tl.indexOf(tk.t) === 0 ? 20 : 0);
    else if (tS >= 0) s += SUB[tS];
    else {
      // A body hit counts for more when the row keeps coming back to the word,
      // so the chapter a term belongs to beats one that mentions it in passing.
      tk.start.lastIndex = 0;
      const hits = tB > 0 ? (r.bl.match(tk.start) || []).length : 0;
      s += BODY[tB] + Math.min(hits, 6) * 3;
    }
  }
  if (phraseRx) {
    if (phraseRx.test(r.tl)) s += 45;
    else if (phraseRx.test(r.bl)) s += 16;
  }
  return s + KIND[r.kind].w;
}

function searchRows(q, limit = 40) {
  const toks = tokenize(q);
  if (!toks.length) {
    return CH.map(c => ({
      kind: 'chapter', title: c.title, sub: c.sub, body: '', nav: { ch: c.id, hue: c.hue }, sc: 0,
    }));
  }
  const phrase = q.trim().toLowerCase();
  const phraseRx = phrase.length > 2 && toks.length > 1 ? new RegExp('\\b' + rxEsc(phrase), 'i') : null;
  const hits = [];
  for (const r of buildIndex()) {
    const sc = scoreRow(r, toks, phraseRx);
    if (sc > 0) hits.push({ ...r, sc });
  }
  hits.sort((a, b) => b.sc - a.sc || a.title.length - b.title.length);
  return hits.slice(0, limit);
}

function hilite(text, toks) {
  if (!text) return '';
  if (!toks.length) return esc(text);
  const rx = new RegExp('(' + toks.map(tk => rxEsc(tk.t)).join('|') + ')', 'ig');
  return text.split(rx).map((part, i) => (i % 2 ? '<mark>' + esc(part) + '</mark>' : esc(part))).join('');
}

function snippet(body, toks, len = 150) {
  if (!body) return '';
  const low = body.toLowerCase();
  let at = -1;
  for (const tk of toks) {
    const i = low.indexOf(tk.t);
    if (i >= 0 && (at < 0 || i < at)) at = i;
  }
  if (at < 0) return body.length > len ? body.slice(0, len).trim() + '…' : body;
  const start = Math.max(0, at - 55);
  const end = Math.min(body.length, start + len);
  return (start > 0 ? '…' : '') + body.slice(start, end).trim() + (end < body.length ? '…' : '');
}

/* ---------- palette ---------- */
const P = { open: false, q: '', sel: 0, rows: [] };

function palOpen() {
  if (P.open) return;
  P.open = true; P.sel = 0;
  const el = $('#pal');
  el.hidden = false;
  document.body.classList.add('pal-lock');
  palRender();
  const input = $('#palQ');
  input.value = P.q;
  input.focus();
  input.select();
}

function palClose() {
  if (!P.open) return;
  P.open = false;
  $('#pal').hidden = true;
  document.body.classList.remove('pal-lock');
}

function palRender() {
  const toks = tokenize(P.q);
  P.rows = searchRows(P.q);
  if (P.sel >= P.rows.length) P.sel = Math.max(0, P.rows.length - 1);
  const list = $('#palList');
  if (!P.rows.length) {
    list.innerHTML = `<div class="pal-empty">Nothing matches “${esc(P.q)}”.</div>`;
    palActive();
    return;
  }
  list.innerHTML = P.rows.map((r, i) => `
    <button class="pal-row ${i === P.sel ? 'on' : ''}" id="pal-r${i}" data-i="${i}" data-h style="--h:${r.nav.hue}" role="option" aria-selected="${i === P.sel}">
      <span class="pal-kind">${KIND[r.kind].label}</span>
      <span class="pal-main">
        <span class="pal-t">${hilite(r.title, toks)}</span>
        ${r.sub ? `<span class="pal-sub">${hilite(r.sub, toks)}</span>` : ''}
        ${toks.length && r.body ? `<span class="pal-snip">${hilite(snippet(r.body, toks), toks)}</span>` : ''}
      </span>
    </button>`).join('');
  list.querySelectorAll('.pal-row').forEach(b => {
    b.addEventListener('click', () => palGo(+b.dataset.i));
    b.addEventListener('mousemove', () => palSelect(+b.dataset.i, false));
  });
  palActive();
  palScrollIntoView();
}

function palSelect(i, scroll = true) {
  if (i === P.sel || i < 0 || i >= P.rows.length) return;
  P.sel = i;
  $('#palList').querySelectorAll('.pal-row').forEach((b, k) => {
    b.classList.toggle('on', k === i);
    b.setAttribute('aria-selected', k === i);
  });
  palActive();
  if (scroll) palScrollIntoView();
}

/* Screen readers follow the combobox's active option, not DOM focus, which
   stays in the input so typing keeps working. */
function palActive() {
  $('#palQ').setAttribute('aria-activedescendant', P.rows.length ? 'pal-r' + P.sel : '');
}

function palScrollIntoView() {
  const on = $('#palList').querySelector('.pal-row.on');
  if (on) on.scrollIntoView({ block: 'nearest' });
}

/* Open whatever the selected row points at. */
function palGo(i) {
  const r = P.rows[i];
  if (!r) return;
  palClose();
  const n = r.nav;
  if (n.lab) return go('labs', { lab: n.lab });
  if (n.fig) return go('chapters', { ch: n.ch, sec: n.fig });
  if (n.term) { glQ = n.term; glCh = null; return go('glossary'); }
  if (n.q) {
    D.mode = 'questions'; D.ch = null; D.rebuild = true; D.flipped = false;
    go('drill');
    const at = D.queue.findIndex(x => x.id === n.q);
    if (at >= 0) { D.idx = at; renderDrill($('#view')); }
    return;
  }
  return go('chapters', n.sec ? { ch: n.ch, sec: n.sec } : { ch: n.ch });
}

/* ---------- wiring ---------- */
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); P.open ? palClose() : palOpen(); return; }
  if (!P.open) {
    // Bare "/" opens search, as long as the reader is not typing into something.
    if (e.key === '/' && !e.target.matches('input,textarea,select') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault(); palOpen();
    }
    return;
  }
  if (e.key === 'Escape') { e.preventDefault(); palClose(); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); palSelect(Math.min(P.sel + 1, P.rows.length - 1)); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); palSelect(Math.max(P.sel - 1, 0)); }
  else if (e.key === 'Home' && e.target.id !== 'palQ') { e.preventDefault(); palSelect(0); }
  else if (e.key === 'Enter') { e.preventDefault(); palGo(P.sel); }
});

$('#palQ').addEventListener('input', e => { P.q = e.target.value; P.sel = 0; palRender(); });
$('#pal .pal-bg').addEventListener('click', palClose);
$('#searchBtn').addEventListener('click', palOpen);
// ⌘ on Apple hardware, Ctrl everywhere else.
if (/Mac|iPhone|iPad|iPod/.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || '')) {
  document.querySelectorAll('[data-mod]').forEach(el => { el.textContent = '⌘K'; });
}
