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

const FILE = 'file://' + path.resolve(__dirname, '..', 'dist', 'index.html');
const results = [];
const check = (name, pass, detail = '') => results.push({ name, pass, detail });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error' && !/fonts\.googleapis|ERR_|net::/.test(m.text())) errors.push(m.text());
  });

  await page.goto(FILE, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  check('home renders every chapter block',
    (await page.locator('.mnode').count()) > 0,
    `${await page.locator('.mnode').count()} blocks`);

  await page.evaluate(() => { location.hash = 'chapters/hdl'; });
  await page.waitForTimeout(400);
  check('chapter reader renders', (await page.textContent('.ch-head h1')).length > 0);
  check('embedded lab mounts', await page.evaluate(() => !!document.querySelector('.lab-embed .hdl .tok')));
  check('table of contents builds', (await page.locator('.reader-toc a').count()) > 0);

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

  for (const theme of ['light', 'dark']) {
    await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
    await page.waitForTimeout(150);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    check(`${theme} theme paints a background`, bg !== 'rgba(0, 0, 0, 0)', bg);
  }

  check('no runtime errors', errors.length === 0, errors.join(' | '));
  await browser.close();

  for (const r of results) {
    console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  (' + r.detail + ')' : ''}`);
  }
  const failed = results.filter(r => !r.pass).length;
  console.log(failed ? `\n${failed} check(s) failed.` : `\nAll ${results.length} checks passed.`);
  process.exit(failed ? 1 : 0);
})();
