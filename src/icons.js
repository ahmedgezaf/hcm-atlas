/* =====================================================================
   ICONS — one mark per chapter, used on the chapter rows, the blocks on
   the home map, the reader's cover band and the search palette.
   ---------------------------------------------------------------------
   Drawn from primitives on a 24×24 grid, stroked with currentColor so
   they take the chapter's hue wherever they appear. Keep them geometric:
   they are read at 16–20px, where detail turns to mud.

   Every chapter id must have an entry — the build fails otherwise.
   ===================================================================== */

const ICONS = {
  /* structure: boxes in a hierarchy */
  org: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M5 16v-2h14v2"/>',
  /* seats in a grid */
  workforce: '<rect x="3" y="4" width="7" height="6" rx="1"/><rect x="14" y="4" width="7" height="6" rx="1"/><rect x="3" y="14" width="7" height="6" rx="1"/><rect x="14" y="14" width="7" height="6" rx="1"/>',
  /* one person, branching records */
  model: '<circle cx="6" cy="6.5" r="3"/><path d="M2 20.5v-2A4.5 4.5 0 016.5 14"/><rect x="12.5" y="3" width="9" height="7" rx="1.5"/><rect x="12.5" y="14" width="9" height="7" rx="1.5"/><path d="M9 6.5h3.5M9.5 17.5h3"/>',
  /* a calendar with a clock: the date it became true */
  dating: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="12" cy="15.5" r="3"/><path d="M12 14v1.6l1.2.8"/>',
  /* the chain of objects */
  payroll: '<path d="M2 7h6.5l3 5-3 5H2l3-5z"/><path d="M13 7h6.5l3 5-3 5H13l3-5z"/>',
  /* a calendar with a day taken out */
  absence: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M9 14.5l2 2 4-4"/>',
  /* headcount as bars */
  hrfunction: '<path d="M3 21h18"/><rect x="5" y="12" width="4" height="9" rx="1"/><rect x="11" y="6" width="4" height="15" rx="1"/><rect x="17" y="15" width="4" height="6" rx="1"/>',
  /* hire to exit, and round again */
  lifecycle: '<path d="M20 12a8 8 0 11-2.6-5.9"/><path d="M20 3v4h-4"/>',
  /* capped contribution: a coin with a ceiling */
  'egypt-payroll': '<circle cx="12" cy="13.5" r="7"/><path d="M5 3.5h14"/><circle cx="9.9" cy="11.4" r="1.25"/><circle cx="14.1" cy="15.6" r="1.25"/><path d="M15 10.5l-6 6"/>',
  /* an entitlement document */
  'egypt-leave': '<path d="M6 3h8l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M14 3v5h4M8.5 14l2 2 4-4"/>',
  /* rows of data going up into the system */
  hdl: '<path d="M4 15h6M4 19h9M4 11h16"/><path d="M17 20v-7M14 16l3-3 3 3"/>',
  /* a rule expressed in code */
  ff: '<path d="M8.5 7L4 12l4.5 5M15.5 7l4.5 5-4.5 5M13.5 5l-3 14"/>',
  /* a report window */
  reporting: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18"/><path d="M7 16v-4M12 16v-2M17 16v-5"/>',
  /* an extra field snapped into a standard form */
  extend: '<rect x="3" y="4" width="18" height="16" rx="2" stroke-dasharray="3 2.5"/><path d="M12 9v6M9 12h6"/>',
  /* who may see whose data */
  security: '<path d="M12 3l8 3v6c0 4.5-3.2 8.3-8 9.6C7.2 20.3 4 16.5 4 12V6z"/><circle cx="12" cy="11" r="2"/><path d="M12 13v3"/>',
  /* the phases of a project */
  method: '<path d="M5 21V4M5 4h11l-2 3.5L16 11H5"/><path d="M5 15h8"/>',
  /* a region on the globe */
  gulf: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 010 18a13 13 0 010-18z"/>',

  /* ---- collections (top bar) ---- */
  'domain-hcm': '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M10 21v-6h4v6"/><path d="M9 11h2M13 11h2"/>',
  'domain-analytics': '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/><circle cx="7" cy="15" r="1.4"/><circle cx="11" cy="10" r="1.4"/><circle cx="14" cy="13" r="1.4"/><circle cx="19" cy="6" r="1.4"/>',

  /* ---- sections (nav row) ---- */
  'nav-home': '<path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z"/>',
  'nav-chapters': '<path d="M4 4h12a3 3 0 013 3v13H7a3 3 0 00-3 3z"/><path d="M4 4v16a3 3 0 013-3h12"/>',
  'nav-labs': '<path d="M9 3v7l-5 9a2 2 0 002 3h12a2 2 0 002-3l-5-9V3"/><path d="M8 3h8M7 15h10"/>',
  'nav-glossary': '<path d="M4 6h16M4 12h10M4 18h7"/>',
  'nav-drill': '<rect x="3" y="6" width="14" height="12" rx="2"/><path d="M7 4h14v12M8 12h4"/>',
  'nav-about': '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>',
};

const icon = (id, cls = '') =>
  ICONS[id] ? `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]}</svg>` : '';

/* ---------------------------------------------------------------------
   COVER ART — the band at the top of a chapter. Four abstract patterns,
   picked by chapter number so neighbours never repeat, drawn in the
   chapter's own hue. A chapter with a `cover:` image in its frontmatter
   uses that photograph instead; this is the default.
   --------------------------------------------------------------------- */
function coverArt(num) {
  const pattern = num % 4;
  const open = '<svg class="cover-art" viewBox="0 0 800 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="ca">';
  const close = '</g></svg>';
  let body = '';

  if (pattern === 0) {                       // concentric rings
    for (let i = 0; i < 10; i++) body += `<circle cx="${40 + i * 88}" cy="80" r="${16 + (i % 4) * 15}"/>`;
  } else if (pattern === 1) {                // diagonal hatch
    for (let i = -4; i < 26; i++) body += `<path d="M${i * 40} 170 L${i * 40 + 90} -10"/>`;
  } else if (pattern === 2) {                // dot grid
    for (let r = 0; r < 5; r++) for (let c = 0; c < 25; c++) body += `<circle cx="${18 + c * 33}" cy="${18 + r * 33}" r="3.5" class="fill"/>`;
  } else {                                   // nested chevrons
    for (let i = 0; i < 12; i++) body += `<path d="M${-40 + i * 76} 170 L${10 + i * 76} 80 L${-40 + i * 76} -10"/>`;
  }
  return open + body + close;
}
