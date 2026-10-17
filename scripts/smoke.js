/**
 * Browser smoke test for dist/index.html.
 *
 *   npm i -D playwright && npx playwright install chromium
 *   node scripts/smoke.js
 *
 * Optional — the build itself validates content. This checks that the page
 * actually renders, the labs mount, and reader progress persists.
 */
const path = require('path');
const { chromium } = require('playwright');

// Defaults to the built site. Pass another file to run the same checks against
// it:  node scripts/smoke.js dist/moon-learning.html
const TARGET = process.argv[2] || path.join('dist', 'index.html');
const FILE = 'file://' + path.resolve(__dirname, '..', TARGET);
const DOMAIN_COUNT = require('../content/domains.json').length;
const CH_IN = d => require('fs').readdirSync(require('path').join(__dirname, '..', 'content', 'chapters'))
  .filter(f => /^domain: *(\S+)/m.exec(require('fs').readFileSync(require('path').join(__dirname, '..', 'content', 'chapters', f), 'utf8'))[1] === d).length;
const HCM = CH_IN('hcm'), ANA = CH_IN('analytics');
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  const errors = [];
  // Every page this test opens reports into the same list: the narrow pass is
  // the one that mounts all 33 labs, so an exception there must not be lost.
  const watch = pg => {
    pg.on('pageerror', e => errors.push(e.message));
    pg.on('console', m => {
      if (m.type() === 'error' && !/fonts\.googleapis|ERR_|net::/.test(m.text())) errors.push(m.text());
    });
  };
  watch(page);

  await page.goto(FILE, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  const over = await page.evaluate(() => ({
    cards: document.querySelectorAll('.dcard').length,
    tabs: [...document.querySelectorAll('.dtab')].map(b => b.textContent.trim()),
    hash: location.hash,
  }));
  check('overview lists every collection',
    over.cards === DOMAIN_COUNT && over.tabs.length === DOMAIN_COUNT, JSON.stringify(over.tabs));

  await page.evaluate(() => { location.hash = 'hcm/home'; });
  await page.waitForTimeout(400);
  check('home renders every chapter block',
    (await page.locator('.mnode').count()) > 0,
    `${await page.locator('.mnode').count()} blocks`);

  const home = await page.evaluate(() => {
    const R = s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { t: Math.round(r.top), l: Math.round(r.left) }; };
    return { tracks: [...document.querySelectorAll('.sysmap .sec-k')].map(e => e.textContent),
             side: R('.hero-side'), main: R('.hero-main') };
  });
  check('home map splits into Functional and Technical',
    home.tracks.join('/') === 'Functional/Technical', home.tracks.join('/') || '(none)');
  check('dashboard sits top-left, above the headline',
    home.side.t < home.main.t && home.side.l === home.main.l,
    `dashboard ${home.side.l},${home.side.t} vs headline ${home.main.l},${home.main.t}`);

  await page.evaluate(() => { location.hash = 'chapters'; });
  await page.waitForTimeout(350);
  const groups = await page.evaluate(() => [...document.querySelectorAll('.chgroup')].map(g => ({
    label: g.querySelector('.sec-k').textContent, rows: g.querySelectorAll('.chrow').length })));
  const grouped = groups.map(g => `${g.label}:${g.rows}`).join(' ');
  const icons = await page.evaluate(() => document.querySelectorAll('.chrow .ico').length);
  check('every chapter row carries its icon', icons === HCM, `${icons}/${HCM}`);

  check('chapters list groups by track',
    groups.length === 2 && groups[0].label === 'Functional' && groups[1].label === 'Technical'
      && groups.reduce((a, g) => a + g.rows, 0) === HCM, grouped);

  await page.evaluate(() => { location.hash = 'chapters/hdl'; });
  await page.waitForTimeout(400);
  check('chapter reader renders', (await page.textContent('.ch-head h1')).length > 0);
  check('embedded lab mounts', await page.evaluate(() => !!document.querySelector('.lab-embed .hdl .tok')));
  check('table of contents builds', (await page.locator('.reader-toc a').count()) > 0);

  // ---- graphics
  const cover = await page.evaluate(() => {
    const c = document.querySelector('.ch-cover');
    return c && { art: !!c.querySelector('.cover-art, .cover-img'), num: (c.querySelector('.ch-cover-n') || {}).textContent };
  });
  check('chapter cover band renders', !!cover && cover.art && cover.num === '11', JSON.stringify(cover));

  const figs = await page.evaluate(async () => {
    const out = { mounted: 0, broken: [] };
    for (const f of FIGS) {
      location.hash = 'chapters/' + f.ch;
      await new Promise(r => setTimeout(r, 110));
      const el = document.getElementById('fig-' + f.id);
      const ok = el && el.querySelector('svg') && el.querySelector('figcaption')
                 && el.querySelector('svg').children.length > 1;
      if (ok) out.mounted++; else out.broken.push(f.id);
    }
    return out;
  });
  check('every figure mounts in its chapter', figs.broken.length === 0,
    figs.broken.length ? figs.broken.join(', ') : `${figs.mounted} figures`);

  await page.evaluate(() => { location.hash = 'home'; });
  await page.waitForTimeout(300);
  const cols = await page.evaluate(() => document.querySelectorAll('.pcol').length);
  check('progress chart has a column per chapter', cols === HCM, `${cols} columns`);


  await page.evaluate(() => { location.hash = 'labs/insurance'; });
  await page.waitForTimeout(300);
  check('calculator lab computes', (await page.textContent('#siOut')).includes('EGP'));

  await page.evaluate(() => { location.hash = 'glossary'; });
  await page.waitForTimeout(300);
  check('glossary lists terms', (await page.locator('.gterm').count()) > 0,
    `${await page.locator('.gterm').count()} terms`);

  await page.evaluate(() => { location.hash = 'drill'; });
  await page.waitForTimeout(300);
  await page.click('#flipBtn');
  await page.waitForTimeout(200);
  check('drill card flips', await page.evaluate(() => document.querySelector('.fc').classList.contains('flipped')));
  await page.click('[data-g="1"]');
  await page.waitForTimeout(200);
  check('progress persists to localStorage',
    await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('hcm-atlas-v2') || '{}').drill || {}).length > 0));

  // ---- search palette
  await page.evaluate(() => { location.hash = 'home'; });
  await page.keyboard.press('Control+KeyK');
  await page.waitForTimeout(250);
  check('palette opens on Ctrl-K', await page.evaluate(() => !document.getElementById('pal').hidden));

  await page.fill('#palQ', 'insurable wage');
  await page.waitForTimeout(250);
  const top = await page.evaluate(() => {
    const r = document.querySelector('.pal-row');
    return r ? r.querySelector('.pal-kind').textContent + ' | ' + r.querySelector('.pal-t').textContent : '(none)';
  });
  check('search ranks the exact term first', top === 'Term | Insurable wage', top);
  check('search highlights the query', (await page.locator('.pal mark').count()) > 0);

  await page.fill('#palQ', 'TRU');
  await page.waitForTimeout(250);
  const acronym = await page.evaluate(() => {
    const r = document.querySelector('.pal-row');
    return r ? r.querySelector('.pal-t').textContent : '(none)';
  });
  check('acronym beats mid-word substrings', /\(TRU\)/.test(acronym), acronym);

  // Every heading the index points at must exist once the chapter renders, and
  // every rendered heading must be in the index. Lab titles are H2s too, so
  // this is what catches positional ids drifting out of step.
  const deep = await page.evaluate(async () => {
    const byCh = {};
    buildIndex().filter(r => r.nav.sec).forEach(r => { (byCh[r.nav.ch] = byCh[r.nav.ch] || []).push(r.nav.sec); });
    const bad = [];
    for (const c of CH) {
      location.hash = 'chapters/' + c.id;
      await new Promise(r => setTimeout(r, 90));
      const dom = [...document.querySelectorAll('.prose h2')]
        .filter(h => !h.closest('.sources') && !h.closest('.lab')).map(h => h.id);
      const want = byCh[c.id] || [];
      want.forEach(id => { if (!dom.includes(id)) bad.push(c.id + ' -> missing ' + id); });
      dom.forEach(id => { if (!want.includes(id)) bad.push(c.id + ' -> unindexed ' + id); });
    }
    return { bad, links: Object.values(byCh).reduce((a, v) => a + v.length, 0), chapters: CH.length };
  });
  const mismatches = deep.bad;
  check('every section deep link resolves', mismatches.length === 0,
    mismatches.length ? mismatches.slice(0, 3).join(' | ') : `${deep.links} links across ${deep.chapters} chapters`);

  await page.evaluate(() => { location.hash = 'home'; });
  await page.keyboard.press('Control+KeyK');
  await page.waitForTimeout(200);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('palette closes on Escape', await page.evaluate(() => document.getElementById('pal').hidden));

  for (const theme of ['light', 'dark']) {
    await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
    await page.waitForTimeout(150);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    check(`${theme} theme paints a background`, bg !== 'rgba(0, 0, 0, 0)', bg);
  }

  // ---- mobile: nothing may make the page scroll sideways. Wide diagrams are
  // meant to scroll inside their own .stage, which only works while every
  // grid ancestor is allowed to shrink (min-width:0).
  const narrow = await browser.newPage({ viewport: { width: 360, height: 740 } });
  watch(narrow);
  await narrow.goto(FILE, { waitUntil: 'load' });
  await narrow.waitForTimeout(300);
  const targets = await narrow.evaluate(() =>
    [...CH.map(c => 'chapters/' + c.id), ...LABS.map(l => 'labs/' + l.id), 'home', 'glossary', 'drill', 'about']);
  const overflowing = [], empty = [], offscreen = [];
  for (const t of targets) {
    await narrow.evaluate(h => { location.hash = h; }, t);
    await narrow.waitForTimeout(120);
    const w = await narrow.evaluate(() => document.documentElement.scrollWidth);
    if (w > 360) overflowing.push(`${t} (${w}px)`);
    if (t.startsWith('labs/')) {
      // A lab whose render() throws leaves an empty body and scrolls nothing.
      const body = await narrow.evaluate(() => {
        const el = document.querySelector('.lab-body');
        return el ? el.childElementCount : -1;
      });
      if (body <= 0) empty.push(t);
      // Numbers pushed outside their own scroll box are invisible on a phone,
      // and overflow:hidden would keep the page width at 360 regardless.
      const past = await narrow.evaluate(() => {
        // A figure may sit outside the visible part of a box that scrolls —
        // that is what scrolling is for. It may not sit outside a box that
        // clips, because then nothing reaches it.
        const bad = [];
        document.querySelectorAll('.lab-body td.n, .lab-body .amt, .lab-body .kv b').forEach(c => {
          let box = c.parentElement;
          while (box && box !== document.body && box.scrollWidth <= box.clientWidth + 1) box = box.parentElement;
          if (!box || box === document.body) return;
          const ox = getComputedStyle(box).overflowX;
          if (ox === 'auto' || ox === 'scroll') return;
          if (c.getBoundingClientRect().right > box.getBoundingClientRect().right + 1) bad.push(c.textContent.trim().slice(0, 12));
        });
        return bad.length;
      });
      if (past) offscreen.push(`${t} (${past})`);
    }
  }
  check('no sideways scroll at 360px', overflowing.length === 0,
    overflowing.length ? overflowing.slice(0, 3).join(', ') : `${targets.length} views`);
  check('every lab mounts at 360px', empty.length === 0,
    empty.length ? empty.slice(0, 3).join(', ') : `${targets.filter(t => t.startsWith('labs/')).length} labs`);
  check('no lab clips its figures off-screen at 360px', offscreen.length === 0,
    offscreen.length ? offscreen.slice(0, 3).join(', ') : 'amounts inside their scroll box');
  await narrow.evaluate(() => { location.hash = 'home'; });
  await narrow.waitForTimeout(250);
  const clipped = await narrow.evaluate(() => {
    const hero = document.querySelector('.hero').getBoundingClientRect();
    return [...document.querySelectorAll('.hstat')].filter(e => e.getBoundingClientRect().right > hero.right + 1).length;
  });
  check('dashboard cards are not clipped at 360px', clipped === 0, `${clipped} clipped`);
  await narrow.close();

  // ---- the reading column is centred in the space beside the rail
  const wide = await browser.newPage({ viewport: { width: 1920, height: 900 } });
  await wide.goto(FILE, { waitUntil: 'load' });
  await wide.waitForTimeout(300);
  const centred = await wide.evaluate(() => {
    const main = document.querySelector('.main').getBoundingClientRect();
    return { left: Math.round(main.left), right: Math.round(innerWidth - main.right) };
  });
  check('reading column is centred at 1920px', Math.abs(centred.left - centred.right) <= 2,
    `${centred.left}px left, ${centred.right}px right`);
  await wide.close();

  // ---- collections and speech
  await page.evaluate(() => { location.hash = 'hcm/chapters'; });
  await page.waitForTimeout(350);
  const hcmRows = await page.evaluate(() => document.querySelectorAll('.chrow').length);
  await page.evaluate(() => { location.hash = 'analytics/chapters'; });
  await page.waitForTimeout(350);
  const anaRows = await page.evaluate(() => document.querySelectorAll('.chrow').length);
  check('switching collection changes the chapter list', hcmRows === HCM && anaRows === ANA,
    `hcm ${hcmRows}, analytics ${anaRows}`);

  await page.evaluate(() => { location.hash = 'hcm/chapters/dating'; });
  await page.waitForTimeout(450);
  const speech = await page.evaluate(() => {
    const btn = document.getElementById('listenBtn');
    if (!btn) return { ok: false, why: 'no listen button' };
    const chunks = speechChunks(document.getElementById('prose'));
    const leaked = chunks.filter(c => c.el.closest('.sources') || c.el.closest('.lab') || c.el.closest('.fig-embed')).length;
    return { ok: true, chunks: chunks.length, leaked, bar: !!document.getElementById('speechBar') };
  });
  check('listen control builds readable chunks',
    speech.ok && speech.chunks > 5 && speech.leaked === 0 && speech.bar,
    JSON.stringify(speech));

  // ---- printing from dark mode must not produce white-on-white
  const printer = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  watch(printer);
  await printer.goto(FILE, { waitUntil: 'load' });
  await printer.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    location.hash = 'chapters/org';
  });
  await printer.waitForTimeout(250);
  await printer.emulateMedia({ media: 'print' });
  const ink = await printer.evaluate(() => {
    const el = document.querySelector('.prose p') || document.querySelector('.prose');
    const rgb = getComputedStyle(el).color.match(/\d+/g).map(Number);
    const lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
    return { colour: getComputedStyle(el).color, lum };
  });
  check('a dark-mode reader prints dark text', ink.lum < 0.5, ink.colour);
  await printer.close();

  // ---- the Arabic on every HCM term is reachable from the palette
  const arTerm = await page.evaluate(() => {
    const t = DATA.terms.find(x => x.ar && x.ar.length > 6);
    return t ? { name: t.name, ar: t.ar } : null;
  });
  await page.keyboard.press('Control+KeyK');
  await page.waitForTimeout(150);
  await page.fill('#palQ', arTerm ? arTerm.ar : 'x');
  await page.waitForTimeout(250);
  const arHit = await page.evaluate(() => {
    const r = document.querySelector('.pal-row');
    return r ? r.querySelector('.pal-t').textContent : '';
  });
  check('searching the Arabic finds its term', !!arTerm && arHit === arTerm.name,
    arTerm ? `${arTerm.ar} -> ${arHit || 'nothing'}` : 'no term carries Arabic');

  // ---- the study loop: scheduling, the due filter and an interview round
  const study = await browser.newPage({ viewport: { width: 1280, height: 950 } });
  watch(study);
  await study.goto(FILE, { waitUntil: 'load' });
  await study.evaluate(() => { localStorage.removeItem('hcm-atlas-v2'); location.hash = 'hcm/drill'; });
  await study.reload({ waitUntil: 'load' });
  await study.evaluate(() => { location.hash = 'hcm/drill'; });
  await study.waitForTimeout(400);
  const dueBefore = await study.textContent('#dueBtn');
  await study.click('[data-g="1"]');
  await study.waitForTimeout(200);
  const scheduled = await study.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('hcm-atlas-v2') || '{}');
    const due = Object.values(st.due || {});
    return due.length === 1 && due[0] > Date.now() + 36e5;   // a day out, not now
  });
  check('grading a card schedules its return', scheduled, dueBefore.trim());

  await study.click('#ivBtn');
  await study.waitForTimeout(300);
  for (let i = 0; i < 10; i++) {
    await study.click('#ivShow');
    await study.waitForTimeout(40);
    await study.click(i % 2 ? '[data-iv="1"]' : '[data-iv="0"]');
    await study.waitForTimeout(40);
  }
  const summary = await study.textContent('h1');
  const weak = await study.locator('.ivlist li').count();
  check('an interview round runs to a summary', /^\d+ of 10$/.test(summary.trim()) && weak > 0,
    `${summary.trim()}, ${weak} chapters to reread`);
  await study.close();

  check('no runtime errors', errors.length === 0, errors.join(' | '));
  await browser.close();

  for (const r of results) {
    console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  (' + r.detail + ')' : ''}`);
  }
  const failed = results.filter(r => !r.pass).length;
  console.log(failed ? `\n${failed} check(s) failed.` : `\nAll ${results.length} checks passed.`);
  process.exit(failed ? 1 : 0);
})();
