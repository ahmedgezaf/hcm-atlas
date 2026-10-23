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
  svg: () => `<svg viewBox="0 0 760 372" role="img" aria-label="The enterprise splits into a legal view — legal entity, legal employer, payroll statutory unit, tax reporting unit — and an operational view — division, business unit, department, location.">
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
    ${F.box(440, 96, 290, 50, 'Division', 'management reporting — spans legal entities')}
    ${F.down(585, 146, 168)}
    ${F.box(440, 168, 290, 50, 'Business unit', 'processing, shared reference data, access')}
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
  id: 'parent-psu',
  ch: 'org',
  title: 'When an employer is not the filer',
  caption: 'A legal entity classified as a legal employer but not as a payroll statutory unit must name a parent PSU. Its reporting units are then created as tax reporting units under that parent — not under the company that actually employs the people. This is the shape a shared-services group takes.',
  svg: () => `<svg viewBox="0 0 760 306" role="img" aria-label="Company A is both legal employer and payroll statutory unit. Companies B, C and D are legal employers only, each naming Company A as parent PSU. Their tax reporting units are created as children of Company A.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'THE ENTITY THAT FILES')}
    ${F.box(270, 32, 220, 50, 'Company A', 'legal employer + PSU', 'accent')}
    ${F.elbow(380, 82, 135, 146)}
    ${F.elbow(380, 82, 380, 146)}
    ${F.elbow(380, 82, 625, 146)}

    ${F.box(30, 146, 210, 50, 'Company B', 'legal employer, parent PSU = A')}
    ${F.box(275, 146, 210, 50, 'Company C', 'legal employer, parent PSU = A')}
    ${F.box(520, 146, 210, 50, 'Company D', 'legal employer, parent PSU = A')}

    ${F.down(135, 196, 226)}
    ${F.down(380, 196, 226)}
    ${F.down(625, 196, 226)}
    ${F.box(30, 226, 210, 40, 'TRU', null, 'ghost')}
    ${F.box(275, 226, 210, 40, 'TRU', null, 'ghost')}
    ${F.box(520, 226, 210, 40, 'TRU', null, 'ghost')}
    ${F.note(380, 290, 'every TRU hangs under the parent PSU, not under its own employer', 'mid')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'reference-data-sets',
  ch: 'org',
  title: 'What a business unit is allowed to see',
  caption: 'Jobs, grades, locations and departments are grouped into sets, and sets are assigned to business units. Data in the Common Set is selectable everywhere; data in a specific set is selectable only in the units that set is assigned to. This is what makes business unit design decide how much duplicate configuration a client lives with.',
  svg: () => `<svg viewBox="0 0 760 300" role="img" aria-label="A Common Set of jobs, grades, locations and departments feeds all three business units. A Sales set feeds only the sales business unit and a Plant set feeds only the manufacturing business unit.">
    ${FIG_DEFS}
    ${F.head(230, 22, 'SET-ENABLED DATA')}
    ${F.box(230, 32, 300, 50, 'Common Set', 'jobs · grades · locations · departments', 'accent')}
    ${F.down(380, 82, 206)}
    ${F.elbow(380, 164, 175, 206)}
    ${F.elbow(380, 164, 585, 206)}

    ${F.box(30, 116, 180, 48, 'Sales Set', 'jobs only Sales uses')}
    ${F.down(95, 164, 206)}
    ${F.box(550, 116, 180, 48, 'Plant Set', 'jobs only the plant uses')}
    ${F.down(665, 164, 206)}

    ${F.box(30, 206, 210, 50, 'BU — Sales', 'sees Common + Sales')}
    ${F.box(275, 206, 210, 50, 'BU — Shared Services', 'sees Common only')}
    ${F.box(520, 206, 210, 50, 'BU — Manufacturing', 'sees Common + Plant')}
    ${F.note(380, 284, 'a transaction can only select data in the sets assigned to its business unit', 'mid')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'change-cost',
  ch: 'org',
  title: 'What you can undo, and what you cannot',
  caption: 'Not every decision in this chapter carries the same weight. The bottom row is settled in the first weeks of a project and lived with for years, which is why the country list and the legal employer map deserve an extra workshop rather than an assumption.',
  svg: () => `<svg viewBox="0 0 760 280" role="img" aria-label="Three bands of reversibility. Cheap: departments, divisions, locations, tree structure, most reference data. Expensive: business unit design and the sets attached to it. Effectively permanent: legislative data group legislation and currency, and the legal employer a worker sits in.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'HOW HARD IS IT TO CHANGE LATER?')}
    ${F.box(30, 32, 700, 62, 'Cheap — ordinary effective-dated updates', 'departments · divisions · locations · tree structure · most reference data', 'ghost')}
    ${F.box(30, 108, 700, 62, 'Expensive — everything attached has to move with it', 'business unit design · which sets hold which jobs, grades and locations')}
    ${F.box(30, 184, 700, 62, 'Effectively permanent', 'LDG legislation and currency · the legal employer a worker sits in', 'accent')}
    ${F.note(380, 268, 'an LDG cannot be re-legislated once payroll data exists inside it', 'mid')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'employment-stack',
  ch: 'model',
  title: 'Two hierarchies, running in parallel',
  caption: 'The HR side descends from the person to the work relationship to the assignment. The payroll side hangs off the person and the payroll statutory unit instead, which is why payroll never runs against an assignment and why balances stop at the payroll relationship boundary.',
  svg: () => `<svg viewBox="0 0 760 300" role="img" aria-label="On the left, a person record leads to a work relationship, which leads to two concurrent assignments. On the right, a payroll relationship sits beside the work relationship and holds the balances and calculation cards.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'HR STRUCTURE')}
    ${F.box(30, 32, 340, 46, 'Person', 'one per human — never duplicated', 'accent')}
    ${F.down(200, 78, 112)}
    ${F.box(30, 112, 340, 50, 'Work relationship', 'one legal employer · worker type · dates')}
    ${F.elbow(200, 162, 110, 200)}
    ${F.elbow(200, 162, 290, 200)}
    ${F.box(30, 200, 160, 50, 'Assignment', 'job · grade · dept')}
    ${F.box(210, 200, 160, 50, 'Assignment', 'a concurrent job')}

    ${F.head(450, 22, 'PAYROLL STRUCTURE')}
    ${F.box(450, 112, 280, 50, 'Payroll relationship', 'person + payroll statutory unit')}
    ${F.down(590, 162, 200)}
    ${F.box(450, 200, 280, 50, 'Balances · calculation cards', 'aggregate here, and stop here', 'ghost')}
    ${F.across(372, 446, 137)}
    ${F.across(372, 446, 225)}
    <path class="f-divide" d="M410 14 V266"/>
    ${F.note(380, 288, 'payroll runs against the right-hand column, never the left', 'mid')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'attribute-home',
  ch: 'model',
  title: 'Which object owns which attribute',
  caption: 'Most of the day-to-day skill in this model is knowing where a field lives before going to look for it. A date of birth is never on an assignment; a grade is never on a person.',
  svg: () => `<svg viewBox="0 0 760 320" role="img" aria-label="Four rows. Person holds date of birth, national identifier, name, nationality and personal contact details. Work relationship holds legal employer, worker type, hire and termination dates and seniority. Assignment holds job, position, grade, department, location, manager, hours and status. Payroll relationship holds the payroll statutory unit, balances, calculation cards and tax reporting unit.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'WHERE DOES THIS FIELD LIVE?')}
    ${F.box(30, 32, 700, 52, 'Person', 'date of birth · national identifier · name · nationality · personal contact')}
    ${F.box(30, 96, 700, 52, 'Work relationship', 'legal employer · worker type · hire and termination dates · seniority dates')}
    ${F.box(30, 160, 700, 52, 'Assignment', 'job · position · grade · department · location · manager · hours · status')}
    ${F.box(30, 224, 700, 52, 'Payroll relationship', 'payroll statutory unit · balances · calculation cards · tax reporting unit')}
    ${F.note(380, 300, 'a field on the wrong object is the most common data-migration defect', 'mid')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'global-transfer-count',
  ch: 'model',
  title: 'A global transfer, counted',
  caption: 'Legally this is a new employment, not an edit to an old one, so the object counts change in a way that is worth being able to recite. The person record is the only thing that survives untouched, and the year-to-date balances do not travel.',
  svg: () => `<svg viewBox="0 0 760 300" role="img" aria-label="Before a global transfer: one person record, one work relationship, one payroll relationship, accumulating balances. After: one person record unchanged, two work relationships with the first ended, two payroll relationships with the first ended, and balances restarting from zero.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'BEFORE — EMPLOYED IN EGYPT')}
    ${F.box(30, 32, 320, 44, '1 person record', 'the human')}
    ${F.box(30, 88, 320, 44, '1 work relationship', 'Egypt legal employer')}
    ${F.box(30, 144, 320, 44, '1 payroll relationship', 'Egypt PSU · Egypt LDG')}
    ${F.box(30, 200, 320, 44, 'Year-to-date balances', 'accumulating')}

    ${F.head(410, 22, 'AFTER — TRANSFERRED TO SAUDI ARABIA')}
    ${F.box(410, 32, 320, 44, '1 person record', 'unchanged', 'accent')}
    ${F.box(410, 88, 320, 44, '2 work relationships', 'Egypt ended · Saudi open')}
    ${F.box(410, 144, 320, 44, '2 payroll relationships', 'Egypt ended · Saudi open')}
    ${F.box(410, 200, 320, 44, 'Balances restart at zero', 'they never span relationships', 'accent')}

    ${F.across(354, 406, 54)}
    ${F.across(354, 406, 110)}
    ${F.across(354, 406, 166)}
    ${F.across(354, 406, 222)}
    ${F.note(380, 276, 'one person, two work relationships, two payroll relationships — say it in that order', 'mid')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'gosi-populations',
  ch: 'gulf',
  title: 'GOSI is three rates, not one',
  caption: 'Nationality and registration date decide the contribution, which is why nationality is a payroll-driving attribute in Saudi Arabia and merely demographic in Egypt. Rates checked in 2026 — re-verify with GOSI before configuring.',
  svg: () => `<svg viewBox="0 0 760 344" role="img" aria-label="Three GOSI contribution populations: Saudi nationals registered before 3 July 2024 at 21.5 percent combined, nationals registered on or after that date at 23.5 percent combined since July 2026, and expatriates at 2 percent employer-only.">
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
    <text class="f-big" x="30" y="178">23.5%</text>
    ${F.note(122, 178, 'since 1 Jul 2026 · 10.75% employee, 12.75% employer · next step due Jul 2027')}
    ${F.bar(30, 190, 700, 26, [
      { w: 23.5 / 24, label: 'phased schedule', cls: 'a' },
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

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'grain',
  ch: 'tables',
  title: 'The same sale, at three grains',
  caption: 'Every one of these is a correct table about the same order. They just answer different questions — and the column called amount means something different in each. Sum the wrong one and the total is wrong in a way nothing warns you about.',
  svg: () => `<svg viewBox="0 0 760 300" role="img" aria-label="The same sale shown at order grain as one row, at order-line grain as three rows, and at product-per-day grain as two rows.">
    ${FIG_DEFS}
    ${F.head(30, 20, 'ONE ROW IS ONE ORDER')}
    ${F.box(30, 30, 700, 40, 'order 1041 · Amal · 3 Jan · total 260', null, 'accent')}
    ${F.note(30, 88, 'SUM(total) = 260. Correct — one row, one order.')}

    ${F.head(30, 124, 'ONE ROW IS ONE ORDER LINE')}
    ${F.box(30, 134, 226, 38, 'line 1 · Notebook · 120')}
    ${F.box(267, 134, 226, 38, 'line 2 · Pen set · 90')}
    ${F.box(504, 134, 226, 38, 'line 3 · Folder · 50')}
    ${F.note(30, 192, 'SUM(line amount) = 260. Also correct. But if the order total came along on every line, SUM(total) = 780.', 'strong')}

    ${F.head(30, 228, 'ONE ROW IS ONE PRODUCT, PER STORE, PER DAY')}
    ${F.box(30, 238, 344, 38, 'Notebook · Cairo HO · 3 Jan · qty 2 · 120')}
    ${F.box(386, 238, 344, 38, 'Pen set · Cairo HO · 3 Jan · qty 1 · 90')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'star-schema',
  ch: 'powerbi-model',
  title: 'One fact, dimensions around it',
  caption: 'Filters travel from the one side to the many: pick a product and the sales rows filter, never the other way. That single direction is what keeps the model unambiguous — and it is why turning on bidirectional filtering to fix a slicer so often breaks something else.',
  svg: () => `<svg viewBox="0 0 760 330" role="img" aria-label="A star schema: a central Sales fact table joined to Date, Product, Customer and Store dimension tables, with filters flowing from each dimension into the fact.">
    ${FIG_DEFS}
    ${F.box(276, 130, 208, 66, 'FACT · Sales', ['one row per sale', 'keys + the numbers'], 'accent')}

    ${F.box(30, 24, 200, 52, 'DIM · Date', 'one row per day, no gaps')}
    ${F.box(530, 24, 200, 52, 'DIM · Product', 'name, category, price')}
    ${F.box(30, 250, 200, 52, 'DIM · Customer', 'segment, country')}
    ${F.box(530, 250, 200, 52, 'DIM · Store', 'city, region, format')}

    <path class="f-line" d="M180 76 L296 130" marker-end="url(#fig-ar)"/>
    <path class="f-line" d="M580 76 L464 130" marker-end="url(#fig-ar)"/>
    <path class="f-line" d="M180 250 L296 196" marker-end="url(#fig-ar)"/>
    <path class="f-line" d="M580 250 L464 196" marker-end="url(#fig-ar)"/>

    ${F.note(196, 108, '1', 'strong')}
    ${F.note(556, 108, '1', 'strong')}
    ${F.note(196, 232, '1', 'strong')}
    ${F.note(556, 232, '1', 'strong')}
    ${F.note(264, 122, '∞', 'strong')}
    ${F.note(486, 122, '∞', 'strong')}
    ${F.note(264, 214, '∞', 'strong')}
    ${F.note(486, 214, '∞', 'strong')}
    ${F.note(380, 320, 'Arrows show the direction a filter travels: one → many.', 'mid')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'payroll-chain',
  ch: 'payroll',
  title: 'The chain, and the three places it breaks quietly',
  caption: 'Each link depends on the one before it. The three marked below are the failures that produce no error at all: the run simply skips the person, or pays them and sends nothing to the bank.',
  svg: () => `<svg viewBox="0 0 760 300" role="img" aria-label="Eight links in order: element, eligibility, entry, payroll run on the first row; balance, prepayments, payment and costing on the second. Eligibility, the payroll run and prepayments are marked as the three links that fail silently.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'DEFINE IT, THEN GIVE IT TO SOMEBODY')}
    ${F.box(30, 32, 150, 46, 'Element', 'what can be paid')}
    ${F.across(180, 212, 55)}
    ${F.box(214, 32, 150, 46, 'Eligibility', 'who could get it', 'accent')}
    ${F.across(364, 396, 55)}
    ${F.box(398, 32, 150, 46, 'Entry', 'who does, how much')}
    ${F.across(548, 580, 55)}
    ${F.box(582, 32, 148, 46, 'Payroll run', 'gross to net', 'accent')}
    ${F.elbow(656, 78, 104, 140)}

    ${F.head(30, 130, 'THEN CALCULATE IT, PAY IT AND BOOK IT')}
    ${F.box(30, 140, 150, 46, 'Balance', 'running totals')}
    ${F.across(180, 212, 163)}
    ${F.box(214, 140, 150, 46, 'Prepayments', 'split to accounts', 'accent')}
    ${F.across(364, 396, 163)}
    ${F.box(398, 140, 150, 46, 'Payment', 'the bank file')}
    ${F.across(548, 580, 163)}
    ${F.box(582, 140, 148, 46, 'Costing', 'to the ledger')}

    ${F.head(30, 224, 'THE THREE THAT FAIL WITHOUT AN ERROR')}
    ${F.box(30, 234, 230, 46, 'No eligibility', 'nothing can be entered', 'ghost')}
    ${F.box(275, 234, 230, 46, 'No payroll on the assignment', 'the run skips the person', 'ghost')}
    ${F.box(520, 234, 210, 46, 'No prepayment', 'calculated, never paid', 'ghost')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'import-vs-load',
  ch: 'hdl',
  title: 'Two inspections, one waiting room',
  caption: 'Import reads the file and checks its shape; load assembles the staged lines into objects and checks what they mean. Knowing which gate rejected a file tells you whether the problem is in the file or in what the file points at.',
  svg: () => `<svg viewBox="0 0 760 250" role="img" aria-label="A zipped file passes an import gate that checks format, waits in staging tables, then passes a load gate that checks content, and becomes live records. Format errors stop at the first gate; missing parents stop at the second.">
    ${FIG_DEFS}
    ${F.box(30, 40, 150, 50, 'Flat zip', '.dat files, no folders')}
    ${F.across(180, 216, 65)}
    ${F.box(218, 40, 130, 50, 'IMPORT', 'is it readable?', 'accent')}
    ${F.across(348, 384, 65)}
    ${F.box(386, 40, 150, 50, 'Staging tables', 'not HR data yet', 'ghost')}
    ${F.across(536, 572, 65)}
    ${F.box(574, 40, 130, 50, 'LOAD', 'is it valid?', 'accent')}
    ${F.down(639, 90, 136)}
    ${F.box(574, 136, 156, 46, 'Live records', 'in the real tables')}

    ${F.head(30, 126, 'STOPS AT IMPORT — THE FILE IS WRONG')}
    ${F.box(30, 136, 230, 46, 'Pipe count, date format, case', 'nothing was written anywhere', 'ghost')}
    ${F.head(30, 208, 'STOPS AT LOAD — THE FILE IS FINE')}
    ${F.box(30, 218, 300, 24, 'A parent that has not been loaded yet', null, 'ghost')}
    ${F.note(500, 236, 'load the parent, then reload the failures', 'mid')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'function-vs-data',
  ch: 'security',
  title: 'Same function, different scope',
  caption: 'Both specialists hold the same job role, so they see the same screens and can take the same actions. The security profile on their data role decides whose records those actions reach — which is why a visibility problem is almost never answered by changing a job role.',
  svg: () => `<svg viewBox="0 0 760 260" role="img" aria-label="Two HR specialists hold the same job role, Human Resource Specialist, with the same function privileges. One has an Egypt security profile and sees Egyptian records; the other has a Saudi profile and sees Saudi records. Neither sees the other's.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'FUNCTION — WHAT YOU CAN DO')}
    ${F.head(410, 22, 'DATA — WHOSE RECORDS')}
    ${F.box(30, 32, 340, 54, 'Human Resource Specialist', 'the same job role for both', 'accent')}
    ${F.across(372, 406, 59)}
    ${F.box(410, 32, 320, 54, 'Security profile · Egypt', 'Egyptian legal employers only')}

    ${F.box(30, 112, 340, 54, 'Human Resource Specialist', 'the same job role for both', 'accent')}
    ${F.across(372, 406, 139)}
    ${F.box(410, 112, 320, 54, 'Security profile · Saudi Arabia', 'Saudi legal employers only')}

    ${F.box(30, 190, 700, 44, 'Job role + security profile = data role', 'change the profile to change what is seen; changing the job role changes what can be done', 'ghost')}
    <path class="f-divide" d="M390 14 V176"/>
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'cost-flow',
  ch: 'costing',
  title: 'From the run to the ledger',
  caption: 'Costing is calculated in payroll but only becomes accounting when it leaves. Notice that Finance sees nothing until the final accounting run — and that a correction has to unwind the same path backwards.',
  svg: () => `<svg viewBox="0 0 760 300" role="img" aria-label="Payroll run results become costing results against the cost allocation flexfield, which with the costing of payments are sent by Transfer to Subledger Accounting into subledger journals built by Finance's rules, and posted to the general ledger by the final accounting run.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'CALCULATED IN PAYROLL')}
    ${F.box(30, 32, 186, 52, 'Payroll run results', 'what each person was paid')}
    ${F.across(216, 246, 58)}
    ${F.box(248, 32, 216, 52, 'Costing results', 'on the cost allocation flexfield')}
    ${F.across(464, 494, 58)}
    ${F.box(496, 32, 234, 52, 'Transfer to Subledger Accounting', 'creates the accounting events')}

    ${F.box(248, 96, 216, 42, 'Calculate Costing of Payments', 'a separate process', 'ghost')}
    ${F.elbow(464, 117, 613, 84)}

    ${F.head(30, 208, 'ACCOUNTED IN FINANCE')}
    ${F.box(30, 218, 290, 50, 'Subledger journals', 'built by rules Finance owns')}
    ${F.across(320, 352, 243)}
    ${F.box(354, 218, 180, 50, 'Create Final Accounting', 'a draft run validates first')}
    ${F.across(534, 566, 243)}
    ${F.box(568, 218, 162, 50, 'General ledger', 'Finance sees it here')}
    ${F.elbow(613, 84, 260, 218)}
    ${F.note(380, 288, 'a correction unwinds backwards — reverse the transfer before touching the run', 'mid')}
  </svg>`,
});

/* ------------------------------------------------------------------ */
FIGS.push({
  id: 'three-doors',
  ch: 'personas',
  title: 'Three doors, one record',
  caption: 'Me, My Team and My Client Groups are audiences, not separate data. All three write to the same assignment, with the same effective dating — what differs is what each may see and what approval each change triggers.',
  svg: () => `<svg viewBox="0 0 760 250" role="img" aria-label="Three doors — Me for a person's own record, My Team for a manager's direct reports, and My Client Groups for HR's populations — pass through roles and data security and all write to the same effective-dated assignment.">
    ${FIG_DEFS}
    ${F.head(30, 22, 'THREE DOORS')}
    ${F.box(30, 32, 220, 52, 'Me', 'own record')}
    ${F.box(270, 32, 220, 52, 'My Team', 'direct reports')}
    ${F.box(510, 32, 220, 52, 'My Client Groups', 'populations by responsibility')}
    ${F.down(140, 84, 112)}
    ${F.down(380, 84, 112)}
    ${F.down(620, 84, 112)}
    ${F.box(30, 112, 700, 40, 'Roles and data security decide what each door shows', null, 'ghost')}
    ${F.down(380, 152, 186)}
    ${F.box(170, 186, 420, 50, 'The same assignment', 'one record · effective-dated', 'accent')}
    ${F.note(380, 248, 'the door changes who may act and what is approved, never which record is written', 'mid')}
  </svg>`,
});
