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
    // Indexed once per body: a chapter with an in-depth version has section
    // rows for both, and the in-depth ones are only in the page when the
    // reader's depth setting is on. So the walk is done in both modes.
    const byCh = { 0: {}, 1: {} };
    buildIndex().filter(r => r.nav.sec).forEach(r => {
      const m = byCh[r.nav.depth ? 1 : 0];
      (m[r.nav.ch] = m[r.nav.ch] || []).push(r.nav.sec);
    });
    const bad = [];
    let links = 0;
    const was = S.depth;
    for (const mode of [0, 1]) {
      S.depth = mode;
      for (const c of CH) {
        if (mode && !c.deep) continue;
        location.hash = 'chapters/' + c.id;
        await new Promise(r => setTimeout(r, 90));
        render();
        await new Promise(r => setTimeout(r, 30));
        const dom = [...document.querySelectorAll('.prose h2')]
          .filter(h => !h.closest('.sources') && !h.closest('.lab')).map(h => h.id);
        // In depth, a section the two bodies share is indexed on the standard
        // row only, so both lists count as what this body should reach.
        const want = mode
          ? [...(byCh[1][c.id] || []), ...(byCh[0][c.id] || [])]
          : (byCh[0][c.id] || []);
        const label = c.id + (mode ? ' (in depth)' : '');
        (mode ? byCh[1][c.id] || [] : want).forEach(id => {
          if (!dom.includes(id)) bad.push(label + ' -> missing ' + id);
        });
        dom.forEach(id => { if (!want.includes(id)) bad.push(label + ' -> unindexed ' + id); });
        links += dom.length;
      }
    }
    S.depth = was;
    return { bad, links, chapters: CH.length, deepCh: CH.filter(c => c.deep).length };
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
    if (t.endsWith('drill')) {
      // The deck shows one card, drawn in a different order each time, so a
      // single look proves almost nothing: a long chapter name on one card in
      // twenty is a bug that only fails the build sometimes. Walk them all.
      const cards = await narrow.evaluate(async () => {
        const bad = [];
        const v = document.querySelector('#view');
        for (let i = 0; i < D.queue.length; i++) {
          for (const flipped of [false, true]) {
            D.idx = i; D.flipped = flipped; renderDrill(v);
            await new Promise(r => setTimeout(r, 0));
            const sw = document.documentElement.scrollWidth;
            if (sw > 360) { bad.push(`card ${i + 1}${flipped ? ' flipped' : ''} (${sw}px)`); break; }
          }
        }
        D.idx = 0; D.flipped = false; renderDrill(v);
        return bad;
      });
      cards.slice(0, 3).forEach(c => overflowing.push(`${t} ${c}`));
      if (cards.length > 3) overflowing.push(`${t} +${cards.length - 3} more cards`);
    }
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
  // The sweep above reads the standard body of every chapter. An in-depth body
  // is longer, embeds the same labs and figures, and is what a reader who
  // turned the switch on actually sees on a phone — so it gets the same pass.
  const deepNarrow = await narrow.evaluate(async () => {
    const bad = [];
    const was = S.depth;
    S.depth = 1;
    for (const c of CH.filter(x => x.deep)) {
      location.hash = c.domain + '/chapters/' + c.id;
      await new Promise(r => setTimeout(r, 90));
      render();
      await new Promise(r => setTimeout(r, 60));
      const w = document.documentElement.scrollWidth;
      if (w > 360) bad.push(c.id + ' in depth (' + w + 'px)');
    }
    S.depth = was;
    return bad;
  });
  deepNarrow.forEach(d => overflowing.push(d));

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

  // ---- the in-depth edition: one setting, two bodies, one set of slugs each.
  const depth = await page.evaluate(async () => {
    const c = CH.find(x => x.deep);
    if (!c) return { skip: true };
    S.depth = 0;
    location.hash = 'chapters/' + c.id;
    await new Promise(r => setTimeout(r, 120));
    render();
    await new Promise(r => setTimeout(r, 60));
    const std = document.querySelector('#prose').innerText.length;
    const btn = [...document.querySelectorAll('[data-depth]')].find(b => b.dataset.depth === '1');
    if (!btn) return { noControl: true };
    btn.click();
    await new Promise(r => setTimeout(r, 120));
    const now = document.querySelector('#prose').innerText.length;
    const mins = document.querySelector('.ch-head .meta span').textContent;
    const stuck = S.depth;
    // and back, so the run leaves the setting as it found it
    [...document.querySelectorAll('[data-depth]')].find(b => b.dataset.depth === '0').click();
    await new Promise(r => setTimeout(r, 120));
    const back = document.querySelector('#prose').innerText.length;
    S.depth = 0;
    return { id: c.id, std, now, back, mins, stuck };
  });
  // Longer, and exactly restored on the way back. How much longer is the
  // writer's business — a chapter that was already long grows by less.
  check('the in-depth switch swaps the chapter body', !!depth.skip || (depth.now > depth.std * 1.1 && depth.back === depth.std),
    depth.skip ? 'no chapter has an in-depth version yet'
      : `${depth.id}: ${depth.std} -> ${depth.now} -> ${depth.back} chars, ${depth.mins}`);

  const deepHit = await page.evaluate(async () => {
    const c = CH.find(x => x.deep);
    if (!c) return { skip: true };
    S.depth = 0;
    // A section that only the in-depth body has must still be reachable from
    // search, which means the hit has to turn the setting on by itself.
    const rows = buildIndex().filter(r => r.nav.sec && r.nav.depth && r.nav.ch === c.id);
    if (!rows.length) return { none: true };
    P.rows = rows; P.sel = 0;
    palGo(0);
    await new Promise(r => setTimeout(r, 200));
    const found = !!document.getElementById(rows[0].nav.sec);
    const on = !!S.depth;
    S.depth = 0; render();
    return { sec: rows[0].nav.sec, found, on };
  });
  check('a search hit inside an in-depth section opens it', !!deepHit.skip || (deepHit.found && deepHit.on),
    deepHit.skip ? 'no chapter has an in-depth version yet'
      : deepHit.none ? 'FAIL: the in-depth body contributed no section rows'
        : `${deepHit.sec}${deepHit.on ? ', depth on' : ', depth stayed off'}`);

  check('no runtime errors', errors.length === 0, errors.join(' | '));
  await browser.close();

  for (const r of results) {
    console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  (' + r.detail + ')' : ''}`);
  }
  const failed = results.filter(r => !r.pass).length;
  console.log(failed ? `\n${failed} check(s) failed.` : `\nAll ${results.length} checks passed.`);
  process.exit(failed ? 1 : 0);
})();
