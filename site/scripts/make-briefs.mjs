// Generates the sector-brief PDFs into private/briefs/ (never into dist/). Needs Playwright with a Chromium build.
//   node scripts/make-briefs.mjs
// Override: PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs  CHROMIUM_PATH=/path/to/chrome
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BRIEFS, BRIEF_CHAPTERS } from '../src/briefs.mjs';
import { PRODUCTS } from '../src/shop.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'private', 'briefs');
mkdirSync(out, { recursive: true });

const pw = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright').catch(() => import(pathToFileURL('/opt/node-tools/node_modules/playwright/index.mjs').href));
const chromium = pw.chromium || pw.default.chromium;
const exe = process.env.CHROMIUM_PATH || ['/opt/pw-browsers/chromium'].find((p) => { try { readFileSync(p); return true; } catch { return false; } });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const css = `
@page { size: A4; margin: 0 }
* { box-sizing: border-box }
body { margin: 0; font: 10.5pt/1.55 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif; color: #1a2433 }
.serif { font-family: Georgia, 'FreeSerif', 'DejaVu Serif', serif }
.page { width: 210mm; min-height: 297mm; padding: 22mm 20mm 24mm; page-break-after: always; position: relative }
.cover { background: #0d1f38; color: #fff; padding: 0; display: flex; flex-direction: column; justify-content: space-between }
.cover .top { padding: 22mm 20mm 0 }
.brand { letter-spacing: .26em; font-size: 9pt; color: #dcc48f; text-transform: uppercase }
.cover h1 { font: 400 40pt/1.05 Georgia, 'FreeSerif', serif; margin: 70mm 0 0; padding: 0 20mm; max-width: 170mm }
.cover .rule { width: 26mm; height: 1.4mm; background: #c9a867; margin: 8mm 20mm 0 }
.cover .sub { padding: 6mm 20mm 0; font-size: 15pt; color: #dcc48f; font-family: Georgia, 'FreeSerif', serif }
.cover .bot { padding: 0 20mm 20mm; font-size: 9pt; color: rgba(255,255,255,.7); display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,.15); margin: 0 20mm; padding-top: 6mm }
.grid { position: absolute; inset: 0; opacity: .12; background-image: linear-gradient(#c9a867 1px, transparent 1px), linear-gradient(90deg, #c9a867 1px, transparent 1px); background-size: 14mm 14mm }
h2 { font: 400 22pt/1.15 Georgia, 'FreeSerif', serif; color: #0d1f38; margin: 0 0 4mm }
h2 small { display: block; font: 600 8pt/1 'Helvetica Neue', Arial, sans-serif; letter-spacing: .22em; text-transform: uppercase; color: #7a5c22; margin-bottom: 3mm }
h3 { font: 600 11pt/1.3 'Helvetica Neue', Arial, sans-serif; margin: 0 0 1.5mm; color: #0d1f38 }
p { margin: 0 0 3.5mm }
.lead { font-size: 12pt; color: #3f4b5e }
.glance { width: 100%; border-collapse: collapse; margin-top: 6mm }
.glance td { padding: 3mm 0; border-top: 1px solid #e3dccb; vertical-align: top }
.glance td:first-child { width: 38mm; font-weight: 600; color: #7a5c22; font-size: 9.5pt }
.cards { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm }
.card { background: #f8f5ee; border-inline-start: 1.2mm solid #c9a867; padding: 4mm 5mm }
.card p { margin: 0; color: #3f4b5e; font-size: 10pt }
ul.tick { list-style: none; padding: 0; margin: 0 }
ul.tick li { padding: 2.2mm 0 2.2mm 8mm; border-top: 1px solid #e3dccb; position: relative }
ul.tick li::before { content: ''; position: absolute; left: 0; top: 3.6mm; width: 3.2mm; height: 3.2mm; border: 1.2px solid #b8944d }
.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm }
.cols .col { border-top: 1.2mm solid #c9a867; padding-top: 3mm }
.cols ul { margin: 2mm 0 0; padding-left: 4mm } .cols li { margin-bottom: 2mm; font-size: 10pt }
.note { margin-top: 8mm; padding: 4mm 5mm; background: #f0ebe0; font-size: 9pt; color: #3f4b5e }
.ar { direction: rtl; font-family: 'DejaVu Sans', 'Noto Naskh Arabic', Tahoma, sans-serif; font-size: 12pt; line-height: 2 }
.ar h2 { font-family: 'DejaVu Sans', sans-serif; font-weight: 600; font-size: 20pt }
.lic { font-size: 8.5pt; color: #5c6778; margin-top: 10mm }
.toc li { margin: 1.5mm 0; color: #3f4b5e } .toc { padding-left: 5mm }
`;

const section = (num, title, inner) => `<div class="page"><h2><small>${String(num).padStart(2, '0')}</small>${esc(title)}</h2>${inner}</div>`;

function html(p, b) {
  const lic = `Licensed for single-user internal use. Please do not share, resell or publish. © 2026 Growth Blueprint Advisory.`;
  const pages = [];
  pages.push(`<div class="page cover"><div class="grid"></div><div class="top"><div class="brand">Growth Blueprint Advisory</div></div><div><h1>${esc(b.title)}</h1><div class="rule"></div><div class="sub">${esc(b.subtitle)}</div></div><div class="bot"><span>Sector brief · Edition 1 · 2026</span><span>growthblueprint.sa</span></div></div>`);
  pages.push(`<div class="page"><h2><small>${esc(BRIEF_CHAPTERS[0])}</small>Before we start</h2>${b.intro.map((t, i) => `<p class="${i === 0 ? 'lead' : ''}">${esc(t)}</p>`).join('')}<h3 style="margin-top:8mm">In this brief</h3><ol class="toc">${BRIEF_CHAPTERS.map((c) => `<li>${esc(c)}</li>`).join('')}</ol><div class="note"><b>Please note.</b> This brief is general guidance written by advisers. It is not legal, tax or investment advice. Rules and programmes change, so confirm current requirements with the relevant authority and licensed advisers before you act. We do not include market-size statistics because they date quickly; ask us for current figures.</div><p class="lic">${lic}</p></div>`);
  pages.push(section(2, BRIEF_CHAPTERS[1], `<div class="cards">${b.forces.map(([t, d]) => `<div class="card"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>`) .replace('</div></div>', '</div></div>'));
  pages.push(section(3, BRIEF_CHAPTERS[2], `<p class="lead">The market at a glance.</p><table class="glance">${b.glance.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>`));
  pages.push(section(4, BRIEF_CHAPTERS[3], `<div class="cards">${b.routes.map(([t, d]) => `<div class="card"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>`));
  pages.push(section(5, BRIEF_CHAPTERS[4], `<p class="lead">Confirm these early, with the relevant authority and a licensed adviser.</p><ul class="tick">${b.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`));
  pages.push(section(6, BRIEF_CHAPTERS[5], `<div class="cards">${b.partners.map(([t, d]) => `<div class="card"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>`));
  pages.push(section(7, BRIEF_CHAPTERS[6], `<div class="cards">${b.pitfalls.map(([t, d]) => `<div class="card"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>`));
  pages.push(section(8, BRIEF_CHAPTERS[7], `<div class="cols">${b.ninety.map(([t, items]) => `<div class="col"><h3>${esc(t)}</h3><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div>`));
  pages.push(section(9, BRIEF_CHAPTERS[8], `<p class="lead">Take these into your next meeting. If you cannot answer one, that is your next piece of homework.</p><ul class="tick">${b.questions.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`));
  pages.push(`<div class="page ar"><h2><small>ملخص بالعربية</small>${esc(p.arTitle)}</h2><p>${esc(b.ar)}</p><div class="note" style="direction:rtl;font-family:inherit">هذا الموجز إرشاد عام كتبه مستشارون، وليس مشورة قانونية أو ضريبية أو استثمارية. تتغير الأنظمة والبرامج، فتأكد دائمًا من المتطلبات الحالية مع الجهة المختصة ومستشارين مرخّصين.</div><p style="direction:ltr;font-family:Helvetica,Arial,sans-serif;font-size:9pt;color:#5c6778;margin-top:14mm">Growth Blueprint Advisory · info@growthblueprint.sa · Want to talk it through? Book a conversation at growthblueprint.sa</p></div>`);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(b.title)}: ${esc(b.subtitle)}</title><style>${css}</style></head><body>${pages.join('')}</body></html>`;
}

const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const manifest = {};
for (const p of PRODUCTS) {
  const b = BRIEFS[p.sector];
  const page = await browser.newPage();
  await page.setContent(html({ arTitle: p.title.ar }, b), { waitUntil: 'load' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 }, displayHeaderFooter: false, preferCSSPageSize: true });
  writeFileSync(join(out, p.file), pdf);
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  manifest[p.file] = { pages, bytes: pdf.length };
  console.log(p.file, pages + ' pages', Math.round(pdf.length / 1024) + ' KB');
  await page.close();
}
writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
await browser.close();
