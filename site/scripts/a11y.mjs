// Accessibility audit with axe-core (WCAG 2.1 A/AA). Violations fail the run; "incomplete" results are listed and need a manual check.
//   node scripts/a11y.mjs        (needs Playwright + Chromium, and axe-core in scripts/axe.min.js: npm i axe-core && cp node_modules/axe-core/axe.min.js scripts/)
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const axeSrc = readFileSync(join(root, 'scripts', 'axe.min.js'), 'utf8');
const pw = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright').catch(() => import(pathToFileURL('/opt/node-tools/node_modules/playwright/index.mjs').href));
const b = await (pw.chromium || pw.default.chromium).launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const pages = ['', 'services/', 'services/advisory-sessions/', 'services/market-intelligence/', 'industries/', 'industries/food-agriculture/', 'about/', 'team/', 'faq/', 'how-we-work/', 'work-with-us/', 'insights/', 'insights/zakat-tax-and-vat-basics/', 'readiness-scorecard/', 'readiness-scorecard/assessment/', 'readiness-checklist/', 'shop/', 'shop/fmcg-market-entry-brief/', 'shop/basket/', 'shop/checkout/', 'book-a-meeting/', 'book-a-session/', 'enquiry/', 'privacy/', 'terms/', 'cookies/', 'image-credits/'];
let bad = 0; const incomplete = new Map();
for (const lang of ['en', 'ar']) for (const [tag, w] of [['d', 1280], ['m', 390]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(() => localStorage.setItem('gba.cookie', 'essential'));
  for (const path of pages) {
    await p.goto(pathToFileURL(join(root, 'dist', lang, path, 'index.html')).href); await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => document.querySelectorAll('.rv').forEach((e) => e.classList.add('in'))); await p.addScriptTag({ content: axeSrc }); await p.waitForTimeout(150);
    const r = await p.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
    for (const v of r.violations) { bad++; console.log(`VIOLATION ${lang}/${tag} ${path || 'home'}: ${v.id} (${v.impact}) x${v.nodes.length} :: ${v.nodes[0].target.join(' ')} :: ${(v.nodes[0].failureSummary || '').split('\n')[1] || ''}`); }
    for (const v of r.incomplete) incomplete.set(v.id, (incomplete.get(v.id) || 0) + v.nodes.length);
  }
  await ctx.close();
}
await b.close();
console.log(bad ? `\n${bad} violations` : '\nNo axe violations on 27 pages x EN/AR x desktop/phone');
if (incomplete.size) console.log('Needs a manual check (axe "incomplete"):', [...incomplete].map(([k, n]) => `${k} (${n})`).join(', '));
process.exit(bad ? 1 : 0);
