// Renders the artwork library to assets/img/*.webp (crisp, vector-drawn, rasterised at 2-3x the display size).
//   node scripts/make-art.mjs [name ...]     (needs Playwright + Chromium and python3 with Pillow)
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { W, H, grain, vignette } from './art/lib.mjs';
import { MAP } from './art/map.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'), out = join(root, 'assets', 'img'), tmp = join(process.env.TMPDIR || '/tmp', 'gba-art'); mkdirSync(tmp, { recursive: true });
const only = process.argv.slice(2);
const pw = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright').catch(() => import(pathToFileURL('/opt/node-tools/node_modules/playwright/index.mjs').href));
const b = await (pw.chromium || pw.default.chromium).launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
for (const [name, spec] of Object.entries(MAP)) {
  if (only.length && !only.includes(name)) continue;
  const { w, h, scene, focus = 'xMidYMid', pw: pxw } = spec; const px = pxw || Math.min(2200, Math.max(900, Math.round(w * 2.6))), ph = Math.round(px * h / w);
  const s = scene(); const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${ph}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="${focus} slice"><defs>${s.d}</defs>${s.b}${grain(spec.seed || 5)}${vignette(.38)}</svg>`;
  const page = await b.newPage({ viewport: { width: px, height: ph } });
  writeFileSync(join(tmp, 'a.html'), `<body style="margin:0;background:#000">${svg}</body>`); await page.goto(pathToFileURL(join(tmp, 'a.html')).href);
  await page.screenshot({ path: join(tmp, name + '.png'), clip: { x: 0, y: 0, width: px, height: ph } }); await page.close();
  execFileSync('python3', ['-c', `from PIL import Image;Image.open(${JSON.stringify(join(tmp, name + '.png'))}).convert('RGB').save(${JSON.stringify(join(process.env.ART_OUT || out, name + '.webp'))},'WEBP',quality=${spec.q || 80},method=6)`]);
  console.log(name, px + 'x' + ph);
}
await b.close();
