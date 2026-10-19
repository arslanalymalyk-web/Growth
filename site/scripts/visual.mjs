// Visual regression: screenshots key pages (reduced motion, fixed viewport) and compares them with tests/visual/*.png.
//   node scripts/visual.mjs --update   writes new baselines      node scripts/visual.mjs   compares (fails if >0.8% of pixels differ)
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..'), dir = join(root, 'tests', 'visual'); mkdirSync(dir, { recursive: true });
const update = process.argv.includes('--update');
const pw = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright').catch(() => import(pathToFileURL('/opt/node-tools/node_modules/playwright/index.mjs').href));
const b = await (pw.chromium || pw.default.chromium).launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const pages = ['', 'services/', 'industries/', 'about/', 'team/', 'shop/', 'book-a-session/', 'readiness-scorecard/', 'privacy/'];
const views = [['d', 1280, 800], ['m', 390, 800]];
const diffPage = await b.newPage(); let failed = 0;
for (const lang of ['en', 'ar']) for (const p of pages) for (const [tag, w, h] of views) {
  const name = `${lang}-${(p || 'home').replace(/\//g, '')}-${tag}.png`;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' }); const pg = await ctx.newPage();
  await pg.addInitScript(() => localStorage.setItem('gba.cookie', 'essential'));
  await pg.goto(pathToFileURL(join(root, 'dist', lang, p, 'index.html')).href); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(250);
  await pg.evaluate(() => document.querySelectorAll('.rv').forEach((e) => e.classList.add('in')));
  const buf = await pg.screenshot({ fullPage: false }); await ctx.close();
  const f = join(dir, name);
  if (update || !existsSync(f)) { writeFileSync(f, buf); continue; }
  const pct = await diffPage.evaluate(async ([a, c]) => {
    const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
    const [x, y] = await Promise.all([load(a), load(c)]); const cv = (i) => { const k = document.createElement('canvas'); k.width = i.width; k.height = i.height; const g = k.getContext('2d'); g.drawImage(i, 0, 0); return g.getImageData(0, 0, i.width, i.height).data; };
    if (x.width !== y.width || x.height !== y.height) return 100; const A = cv(x), B = cv(y); let n = 0; for (let i = 0; i < A.length; i += 4) if (Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) > 48) n++; return (n / (A.length / 4)) * 100;
  }, [readFileSync(f).toString('base64'), buf.toString('base64')]);
  if (pct > 0.8) { failed++; writeFileSync(join(dir, name.replace('.png', '.NEW.png')), buf); console.log(`DIFF ${name}: ${pct.toFixed(2)}%`); }
}
await b.close(); console.log(update ? 'baselines written' : failed ? `${failed} visual differences` : 'visual: no differences'); process.exit(failed ? 1 : 0);
