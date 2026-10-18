// Browser end-to-end checks against a running server:   PORT=3300 node server.mjs   then   node scripts/e2e.mjs http://127.0.0.1:3300
// Needs Playwright (PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs) and a Chromium build (CHROMIUM_PATH).
import { pathToFileURL } from 'node:url';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const base = (process.argv[2] || 'http://127.0.0.1:3300').replace(/\/$/, '');
const dataDir = process.env.DATA_DIR || join(process.cwd(), 'data');
const pw = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright').catch(() => import(pathToFileURL('/opt/node-tools/node_modules/playwright/index.mjs').href));
const chromium = pw.chromium || pw.default.chromium;
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const lines = (n) => { const f = join(dataDir, n + '.jsonl'); return existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []; };

let failed = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) failed++; };
const browser = await chromium.launch({ executablePath: exe });
const issues = [];
async function page(lang = 'en', opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, ...opts });
  await ctx.addInitScript(() => { try { localStorage.setItem('gba.cookie', 'essential'); } catch {} });
  const p = await ctx.newPage();
  p.on('console', (m) => { const t = m.text(); if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)|ERR_|net::|Failed to load resource/.test(t)) issues.push(t); if (/Content Security Policy/i.test(t)) issues.push('CSP: ' + t); });
  p.on('pageerror', (e) => issues.push('pageerror: ' + e.message));
  return p;
}

/* ---- scorecard ---- */
for (const lang of ['en', 'ar']) {
  const p = await page(lang);
  await p.goto(`${base}/${lang}/readiness-scorecard/assessment/index.html`);
  await p.waitForSelector('#sc-app select');
  await p.selectOption('#sc-sector', 'fmcg'); await p.selectOption('#sc-stage', '1'); await p.selectOption('#sc-size', '1');
  await p.click('.sc-nav .btn--gold');
  // try to continue without answering: blocked
  await p.click('.sc-nav .btn--gold'); ok(await p.locator('.sc-warn').isVisible(), `[${lang}] scorecard blocks an incomplete part`);
  for (let part = 0; part < 6; part++) {
    for (let q = 0; q < 4; q++) { const idx = part * 4 + q; const v = part === 3 ? 0 : part === 5 ? '-1' : String(1 + ((q + part) % 3)); const sel = v === '-1' ? `#q${idx}_u` : `#q${idx}_${v}`; await p.locator(sel).check({ force: true }); }
    await p.click('.sc-nav .btn--gold');
  }
  await p.waitForURL('**/results/**'); await p.waitForSelector('.sc-overall');
  const score = Number(await p.textContent('.sc-ring b'));
  ok(score >= 0 && score <= 100, `[${lang}] report shows an overall score (${score})`);
  ok((await p.locator('.sc-dim').count()) === 6, `[${lang}] report has six area sections`);
  ok((await p.locator('.sc-list--flag li').count()) > 0, `[${lang}] report lists flagged questions`);
  if (lang === 'en') {
    ok(/FMCG/.test(await p.textContent('#sc-report')), '[en] report is tailored to the chosen sector');
    // email my report with consent
    await p.fill('#sm-name', 'Sara Almansour'); await p.fill('#sm-mail', 'sara@example.com');
    await p.click('.sc-mail button[type=submit]'); ok(await p.locator('[data-mail-err]').isVisible(), '[en] email-report requires consent');
    await p.locator('.sc-mail input[name=consent]').check({ force: true }); await p.click('.sc-mail button[type=submit]');
    await p.waitForSelector('[data-mail-ok]:not([hidden])');
    const lead = lines('leads').filter((l) => l.type === 'scorecard').at(-1);
    ok(lead && lead.contact.email === 'sara@example.com' && /overall/.test(Object.keys(lead.data).join()), '[en] scorecard lead stored with a score summary');
    ok(lead && lead.consents.processing.given && !lead.consents.marketing.given, '[en] marketing consent stays off unless ticked');
  }
  await p.context().close();
}

/* ---- shop: basket -> checkout -> order -> secure download ---- */
{
  const p = await page('en');
  await p.goto(`${base}/en/shop/fmcg-market-entry-brief/index.html`);
  await p.click('.buybox [data-add]'); ok((await p.textContent('[data-basket-count]')) === '1', 'basket count updates in the header');
  await p.goto(`${base}/en/shop/basket/index.html`); await p.waitForSelector('.basket-list');
  ok((await p.textContent('.basket-sum')).includes('862.5'), 'basket shows the price plus 15% VAT (862.5)');
  await p.click('.basket-act .btn--gold'); await p.waitForSelector('#checkout');
  await p.click('#checkout button[type=submit]'); ok((await p.locator('#checkout .err:visible').count()) >= 3, 'checkout validates name, email and consents');
  await p.fill('#co-name', 'Sara Almansour'); await p.fill('#co-email', 'sara@example.com'); await p.fill('#co-company', 'Neom Ventures');
  await p.locator('#checkout input[name=licence]').check({ force: true }); await p.locator('#checkout input[name=privacy]').check({ force: true });
  await Promise.all([p.waitForURL('**/shop/order/**'), p.click('#checkout button[type=submit]')]);
  ok(p.url().includes('#k='), 'order URL keeps the access key in the fragment (never sent to the server)');
  await p.waitForSelector('.order-items button');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('.order-items button')]);
  const path = await dl.path(); const head = readFileSync(path).subarray(0, 4).toString();
  ok(head === '%PDF' && /growth-blueprint-fmcg/.test(dl.suggestedFilename()), `secure download delivers the PDF (${dl.suggestedFilename()})`);
  const order = lines('orders').at(-1); ok(order.total === 862.5 && order.items.length === 1, 'server computed total and kept the order');
  ok(lines('consents').some((c) => c.type === 'order-licence') && lines('consents').some((c) => c.type === 'order-privacy'), 'licence and privacy consents were recorded');
  ok(!lines('consents').some((c) => c.type === 'order-marketing'), 'no marketing consent was recorded (box was not ticked)');
  await p.context().close();
}

/* ---- newsletter: footer sign-up, explicit consent, double opt-in ---- */
{
  const p = await page('ar');
  await p.goto(`${base}/ar/index.html`);
  await p.fill('#fnl-email', 'reader@example.com'); await p.click('.ftr-news button[type=submit]');
  ok(await p.locator('.ftr-news [data-news-err]').isVisible(), '[ar] newsletter refuses without the consent box');
  await p.locator('.ftr-news input[name=consent]').check({ force: true }); await p.click('.ftr-news button[type=submit]');
  await p.waitForSelector('.ftr-news [data-news-msg]:not([hidden])');
  const link = await p.getAttribute('.ftr-news [data-news-msg] a', 'href'); ok(!!link, '[ar] pending message shown with the demo confirm link');
  await p.goto(link); ok(p.url().includes('/ar/newsletter/confirmed/'), '[ar] confirm link lands on the confirmed page');
  const sub = lines('newsletter').filter((s) => s.email === 'reader@example.com').at(-1); ok(sub && sub.status === 'confirmed', 'subscriber is confirmed only after clicking the link');
  await p.context().close();
}

/* ---- enquiry + booking go to the CRM pipeline with consent ---- */
{
  const p = await page('en');
  await p.goto(`${base}/en/enquiry/index.html`);
  await p.fill('#name', 'Omar K'); await p.fill('#email', 'omar@example.com'); await p.fill('#company', 'Al Noor Foods'); await p.click('[data-next]');
  await p.selectOption('#interest', { index: 1 }); await p.click('[data-next]');
  await p.check('input[name=objectives][value="1"]', { force: true }); await p.selectOption('#timeline', { index: 1 }); await p.click('[data-next]'); await p.click('[data-next]');
  await p.click('[data-next]'); ok(await p.locator('#consentErr').isVisible(), 'enquiry will not submit without consent');
  await p.check('#consent', { force: true }); await Promise.all([p.waitForURL('**/confirmation/**'), p.click('[data-next]')]);
  ok(/ref=GBA-/.test(p.url()), 'enquiry confirmation carries a real reference');
  ok(/GBA-\d{6}-[0-9A-F]{6}/.test(await p.textContent('[data-ref]')), 'confirmation page shows the reference');
  ok(/Thank you/.test(await p.textContent('h1')), 'confirmation uses the live wording, not the demo wording');
  const l = lines('leads').filter((x) => x.type === 'enquiry').at(-1); ok(l && l.contact.company === 'Al Noor Foods' && l.consents.processing.version === 'privacy-2026-1', 'enquiry stored with consent version');
  ok(lines('crm-outbox').some((c) => c.evt && c.evt.event === 'lead.enquiry'), 'enquiry queued for the CRM webhook');
  await p.goto(`${base}/en/book-a-meeting/index.html`);
  await p.fill('#b-name', 'Lina'); await p.fill('#b-co', 'Lina Co'); await p.fill('#b-em', 'lina@example.com'); await p.selectOption('#b-help', { index: 1 });
  await p.click('.req button[type=submit]'); ok(await p.locator('[data-consent-err]').isVisible(), 'booking form needs consent');
  await p.locator('.req input[name=consent]').check({ force: true }); await p.locator('.req input[name=marketing]').check({ force: true });
  await Promise.all([p.waitForURL('**/confirmation/**'), p.click('.req button[type=submit]')]);
  const b = lines('leads').filter((x) => x.type === 'booking').at(-1); ok(b && b.consents.marketing.given === true, 'booking stored with the optional marketing consent that was ticked');
  await p.context().close();
}

/* ---- privacy request ---- */
{
  const p = await page('en');
  await p.goto(`${base}/en/privacy/index.html`);
  await p.fill('#pr-email', 'omar@example.com'); await p.selectOption('#pr-type', 'deletion'); await p.click('[data-privacy-form] button[type=submit]');
  await p.waitForSelector('[data-pr-msg]:not([hidden])'); ok(/PDP-/.test(await p.textContent('[data-pr-msg]')), 'privacy request returns a reference and a due date');
  ok(lines('privacy-requests').at(-1).type === 'deletion', 'privacy request logged');
  await p.context().close();
}

ok(issues.length === 0, `no console errors or CSP violations${issues.length ? ': ' + issues.slice(0, 4).join(' | ') : ''}`);
await browser.close();
console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed'); process.exit(failed ? 1 : 0);
