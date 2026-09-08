/* =====================================================================
   FIGURES — static diagrams embedded in the prose with [[fig:id]].
   ---------------------------------------------------------------------
   A lab is something to push on; a figure is something to take in at a
   glance. They are deliberately different: a figure never has state, is
   never interactive, and carries no numbers that are not also in the
   chapter's text.

   Every figure is inline SVG so it inherits the theme's tokens and the
   chapter's hue (var(--p)) with no image file and no request. Draw on a
   fixed viewBox; .fig-scroll handles narrow screens.

   FIGS.push({ id, ch, title, caption, svg() })
   ===================================================================== */

const FIGS = [];

/* Small builders so the diagrams stay readable and consistent. */
const F = {
  /* A titled box. `sub` is an optional caption line, or an array of lines —
     SVG text does not wrap, so anything long has to be split by hand. */
  box(x, y, w, h, t, sub, cls = '') {
    const lines = sub == null ? [] : (Array.isArray(sub) ? sub : [sub]);
    const ty = lines.length ? y + 21 : y + h / 2 + 4.5;
    return `<g class="f-box ${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7"/>` +
      `<text class="f-t" x="${x + 12}" y="${ty}">${t}</text>` +
      lines.map((l, i) => `<text class="f-s" x="${x + 12}" y="${y + 38 + i * 15}">${l}</text>`).join('') +
      `</g>`;
  },
  /* Column or section heading inside the drawing. */
  head(x, y, t, cls = '') {
    return `<text class="f-h ${cls}" x="${x}" y="${y}">${t}</text>`;
  },
  note(x, y, t, cls = '') {
    return `<text class="f-s ${cls}" x="${x}" y="${y}">${t}</text>`;
  },
  /* Elbow connector: down from (x1,y1), across, down into (x2,y2). */
  elbow(x1, y1, x2, y2, cls = '') {
    const mid = y1 + (y2 - y1) / 2;
    return `<path class="f-line ${cls}" d="M${x1} ${y1} V${mid} H${x2} V${y2}" marker-end="url(#fig-ar)"/>`;
  },
  down(x, y1, y2, cls = '') {
    return `<path class="f-line ${cls}" d="M${x} ${y1} V${y2}" marker-end="url(#fig-ar)"/>`;
  },
  across(x1, x2, y, cls = '') {
    return `<path class="f-line ${cls}" d="M${x1} ${y} H${x2}" marker-end="url(#fig-ar)"/>`;
  },
  /* Horizontal proportion bar: segments = [{w, label, cls}] summing to width. */
  bar(x, y, width, height, segments) {
    let at = x, out = '';
    segments.forEach(s => {
      const w = width * s.w;
      out += `<g class="f-seg ${s.cls || ''}"><rect x="${at}" y="${y}" width="${w}" height="${height}" rx="3"/>` +
        (w > 34 ? `<text class="f-bar-l" x="${at + w / 2}" y="${y + height / 2 + 4}">${s.label}</text>` : '') + `</g>`;
      at += w;
    });
    return out;
  },
};

/* Shared arrow marker; one per rendered figure. */
const FIG_DEFS = `<defs><marker id="fig-ar" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L7 4 L0 7 z" class="f-arrow"/></marker></defs>`;

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'legal-vs-operational',
  ch: 'org',
  title: 'The same company, two pictures',
  caption: 'Oracle keeps the legal registration and the operating structure apart on purpose, because in real companies they do not line up. A worker sits in exactly one branch of each.',
  svg: () => `<svg viewBox="0 0 760 372" role="img" aria-label="The enterprise splits into a legal view — legal entity, legal employer, payroll statutory unit, tax reporting unit — and an operational view — business unit, division, department, location.">
    ${FIG_DEFS}
    ${F.box(290, 8, 180, 38, 'Enterprise', null, 'accent')}
    ${F.note(300, 62, 'one per implementation · not a legal concept')}
    ${F.elbow(380, 46, 175, 96)}
    ${F.elbow(380, 46, 585, 96)}

    ${F.head(30, 88, 'LEGAL VIEW — what a government asks')}
    ${F.box(30, 96, 290, 50, 'Legal entity', 'registered; commercial register + tax card')}
    ${F.down(175, 146, 168)}
    ${F.box(30, 168, 290, 50, 'Legal employer', 'a classification — not every entity has it')}
    ${F.down(175, 218, 240)}
    ${F.box(30, 240, 290, 50, 'Payroll statutory unit (PSU)', 'pays workers, remits to NOSI and the ETA')}
    ${F.down(175, 290, 312)}
    ${F.box(30, 312, 290, 44, 'Tax reporting unit (TRU)', 'the face shown to the authorities')}

    ${F.head(440, 88, 'OPERATIONAL VIEW — what a manager asks')}
    ${F.box(440, 96, 290, 50, 'Business unit', 'processing, shared reference data, access')}
    ${F.down(585, 146, 168)}
    ${F.box(440, 168, 290, 50, 'Division', 'management reporting — analytics, not txns')}
    ${F.down(585, 218, 240)}
    ${F.box(440, 240, 290, 50, 'Department', 'the box on the org chart a worker sits in')}
    ${F.down(585, 290, 312)}
    ${F.box(440, 312, 290, 44, 'Location', 'physical site — drives jurisdiction, allowances')}

    <path class="f-divide" d="M380 86 V360"/>
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'ldg-wall',
  ch: 'org',
  title: 'What a legislative data group seals off',
  caption: 'All payroll configuration lives inside exactly one LDG. An element built for Egypt does not exist in Saudi Arabia — it has to be built again. When someone cannot find their element, this is the first thing to check.',
  svg: () => `<svg viewBox="0 0 760 250" role="img" aria-label="Two sealed legislative data groups, Egypt and Saudi Arabia, each containing its own elements, balances and formulas. An arrow attempting to cross between them is blocked.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'LEGISLATIVE DATA GROUP — EGYPT')}
    <rect class="f-vault" x="30" y="32" width="290" height="176" rx="10"/>
    ${F.box(50, 54, 250, 36, 'Elements', null)}
    ${F.box(50, 100, 250, 36, 'Balances', null)}
    ${F.box(50, 146, 250, 36, 'Fast Formulas', null)}

    ${F.head(440, 22, 'LEGISLATIVE DATA GROUP — SAUDI ARABIA')}
    <rect class="f-vault" x="440" y="32" width="290" height="176" rx="10"/>
    ${F.box(460, 54, 250, 36, 'Elements', null)}
    ${F.box(460, 100, 250, 36, 'Balances', null)}
    ${F.box(460, 146, 250, 36, 'Fast Formulas', null)}

    <path class="f-blocked" d="M330 120 H430"/>
    <g class="f-no"><circle cx="380" cy="120" r="17"/><path d="M371 111 L389 129 M389 111 L371 129"/></g>
    ${F.note(380, 232, 'no sharing, no inheritance, no exceptions', 'mid')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'gosi-populations',
  ch: 'gulf',
  title: 'GOSI is three rates, not one',
  caption: 'Nationality and registration date decide the contribution, which is why nationality is a payroll-driving attribute in Saudi Arabia and merely demographic in Egypt. Rates checked in 2026 — re-verify with GOSI before configuring.',
  svg: () => `<svg viewBox="0 0 760 344" role="img" aria-label="Three GOSI contribution populations: Saudi nationals registered before 3 July 2024 at 21.5 percent combined, nationals registered on or after that date on a phased schedule rising to 23.5 percent, and expatriates at 2 percent employer-only.">
    ${FIG_DEFS}
    ${F.head(30, 20, 'SAUDI NATIONAL — registered before 3 Jul 2024')}
    <text class="f-big" x="30" y="52">21.5%</text>
    ${F.note(122, 52, 'combined')}
    ${F.bar(30, 64, 700, 26, [
      { w: 9.75 / 24, label: 'employee 9.75%', cls: 'a' },
      { w: 11.75 / 24, label: 'employer 11.75%', cls: 'b' },
      { w: 2.5 / 24, label: '', cls: 'ghost' },
    ])}
    ${F.note(30, 108, '9% pension + 0.75% SANED')}
    ${F.note(320, 108, '9% pension + 2% occupational hazards + 0.75% SANED')}

    ${F.head(30, 146, 'SAUDI NATIONAL — registered on or after 3 Jul 2024')}
    <text class="f-big" x="30" y="178">22.5%</text>
    ${F.note(122, 178, 'rising to 23.5% from 1 Jul 2026, then further annual steps · retirement age 65')}
    ${F.bar(30, 190, 700, 26, [
      { w: 22.5 / 24, label: 'phased schedule', cls: 'a' },
      { w: 1.5 / 24, label: '', cls: 'ghost' },
    ])}

    ${F.head(30, 250, 'EXPATRIATE')}
    <text class="f-big" x="30" y="282">2%</text>
    ${F.note(84, 282, 'employer only — no pension, no SANED')}
    ${F.bar(30, 294, 700, 26, [
      { w: 2 / 24, label: '2%', cls: 'b' },
      { w: 22 / 24, label: '', cls: 'ghost' },
    ])}
    ${F.note(430, 326, 'All three bars share one 0–24% scale.')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'contributable-wage',
  ch: 'gulf',
  title: 'What the contributable wage is made of',
  caption: 'Basic plus housing, capped at SAR 45,000 a month. Everything else is outside the base — applying GOSI to full gross is the Saudi version of the Egyptian insurable-wage mistake.',
  svg: () => `<svg viewBox="0 0 760 210" role="img" aria-label="The contributable wage is basic salary plus housing allowance, capped at 45,000 Saudi riyals per month. Transport, commission and bonuses are excluded.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'IN THE BASE')}
    ${F.bar(30, 32, 430, 34, [
      { w: 0.62, label: 'Basic salary', cls: 'a' },
      { w: 0.38, label: 'Housing allowance', cls: 'b' },
    ])}
    <path class="f-cap" d="M470 24 V76"/>
    ${F.note(480, 46, 'capped at SAR 45,000 / month', 'strong')}
    ${F.note(480, 64, 'above the cap, contributions stop')}

    ${F.head(30, 118, 'OUTSIDE THE BASE')}
    ${F.box(30, 128, 210, 38, 'Transport', null, 'ghost')}
    ${F.box(260, 128, 210, 38, 'Commission', null, 'ghost')}
    ${F.box(490, 128, 240, 38, 'Bonuses', null, 'ghost')}
    ${F.note(30, 192, 'Rates and the ceiling were checked in 2026 and move by ministerial decision — verify with GOSI.')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'wps-agreement',
  ch: 'gulf',
  title: 'Three platforms that must agree',
  caption: 'The basic salary in the Qiwa contract, in Mudad and at GOSI has to be the same number, so a salary change has to land on all three at once. Oracle produces the SIF; the bank transfer is what makes the employee legally paid.',
  svg: () => `<svg viewBox="0 0 760 300" role="img" aria-label="Oracle payroll produces the SIF file, which Mudad matches against the bank transfer to make the employee legally paid. Qiwa, Mudad and GOSI must all show the same basic salary. Late files escalate from a minor violation to a Qiwa freeze to sponsorship transfer after three months.">
    ${FIG_DEFS}
    ${F.box(30, 20, 160, 46, 'Oracle payroll', 'payment process')}
    ${F.across(190, 234, 43)}
    ${F.box(236, 20, 150, 46, 'SIF file', 'id · basic · net')}
    ${F.across(386, 430, 43)}
    ${F.box(432, 20, 150, 46, 'Bank transfer', 'official channel')}
    ${F.across(582, 626, 43)}
    ${F.box(628, 20, 102, 46, 'Legally paid', null, 'accent')}
    ${F.note(236, 88, 'Mudad matches the file against the actual transfer; when they agree, the worker counts as paid.')}

    ${F.head(30, 126, 'THE SAME BASIC SALARY IN ALL THREE')}
    ${F.box(30, 136, 220, 46, 'Qiwa', 'contract authentication', 'accent')}
    ${F.box(270, 136, 220, 46, 'Mudad', 'wage protection', 'accent')}
    ${F.box(510, 136, 220, 46, 'GOSI', 'social insurance', 'accent')}

    ${F.head(30, 224, 'WHAT LATE FILING COSTS')}
    ${F.bar(30, 234, 700, 30, [
      { w: 0.3, label: 'minor violation', cls: 'w1' },
      { w: 0.34, label: 'partial Qiwa freeze', cls: 'w2' },
      { w: 0.36, label: 'after 3 months: sponsorship transfer without consent', cls: 'w3' },
    ])}
    ${F.note(30, 288, 'WPS compliance also feeds the Nitaqat colour band, which gates visas and government services.')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'extension-ladder',
  ch: 'extend',
  title: '"Can you add a field?"',
  caption: 'In SaaS the answer is never a customization. It is one of these, and naming the right one quickly is what the question is really testing.',
  svg: () => `<svg viewBox="0 0 760 336" role="img" aria-label="A request for an extra field resolves to a descriptive flexfield with a value set, a lookup code, or a page change made in a sandbox. All three survive the quarterly update; a customization does not exist as an option.">
    ${FIG_DEFS}
    ${F.box(280, 8, 200, 40, 'A client asks for it', null, 'accent')}
    ${F.elbow(380, 48, 130, 108)}
    ${F.down(380, 48, 108)}
    ${F.elbow(380, 48, 630, 108)}

    ${F.box(20, 108, 220, 74, 'Where does it live?', ['DFF on the object,', 'constrained by a value set'])}
    ${F.box(270, 108, 220, 74, 'Should it be a list?', ['lookup type', '+ lookup code'])}
    ${F.box(520, 108, 220, 74, 'What should approval do?', ['workflow,', 'journeys'])}
    ${F.note(20, 202, 'The three-thought habit — say this sequence aloud in a workshop and it lands.')}

    ${F.head(20, 230, 'AND IF IT IS A SCREEN CHANGE')}
    ${F.box(20, 240, 200, 46, 'Sandbox', 'isolated workspace')}
    ${F.across(220, 268, 263)}
    ${F.box(276, 240, 200, 46, 'Publish', 'the moment it is real')}
    ${F.across(476, 524, 263)}
    ${F.box(532, 240, 208, 46, 'Survives 26A–26D', 'configuration, not code')}
    ${F.note(20, 312, 'Free-text without a value set is how a client ends up with eleven spellings of "Cairo".')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'egypt-leave-ladder',
  ch: 'egypt-leave',
  title: 'The annual-leave ladder, and what sits inside it',
  caption: 'Law 14/2025, in force from 1 September 2025. Casual leave is the trap: seven days counted within the annual entitlement, not on top of it.',
  svg: () => `<svg viewBox="0 0 760 300" role="img" aria-label="Annual leave rises from 15 days in the first year to 21 days from the second year, 30 days at ten years of service or age over 50, and 45 days for persons with disabilities, plus 7 additional days for hazardous or remote work. Casual leave of 7 days sits inside the annual entitlement.">
    ${FIG_DEFS}
    ${F.head(30, 20, 'ANNUAL LEAVE — DAYS PER YEAR')}
    <g class="f-steps">
      <rect x="30" y="145" width="150" height="45" rx="6"/>
      <rect x="196" y="127" width="150" height="63" rx="6"/>
      <rect x="362" y="100" width="150" height="90" rx="6"/>
      <rect x="528" y="55" width="150" height="135" rx="6"/>
    </g>
    <text class="f-step-n" x="105" y="176">15</text>
    <text class="f-step-n" x="271" y="158">21</text>
    <text class="f-step-n" x="437" y="131">30</text>
    <text class="f-step-n" x="603" y="86">45</text>
    <text class="f-step-l" x="105" y="208">first year</text>
    <text class="f-step-l" x="271" y="208">from year two</text>
    <text class="f-step-l" x="437" y="208">10 years, or aged 50+</text>
    <text class="f-step-l" x="603" y="208">persons with disabilities</text>
    ${F.note(30, 232, '+7 days for hazardous, arduous or remote-area work · official and weekly holidays are excluded')}

    ${F.head(30, 266, 'INSIDE THAT ENTITLEMENT, NOT ON TOP OF IT')}
    ${F.bar(30, 274, 700, 22, [
      { w: 0.18, label: 'casual leave — 7 days', cls: 'w2' },
      { w: 0.82, label: 'the rest of the annual entitlement', cls: 'ghost' },
    ])}
  </svg>`,
});
