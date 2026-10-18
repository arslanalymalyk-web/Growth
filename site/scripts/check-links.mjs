// Checks every internal href/src in dist/ (files, anchors) and flags pages missing a title, description or h1.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
const dist = resolve(process.argv[2] || 'dist');
const pages = []; (function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : f.endsWith('.html') && pages.push(p); } })(dist);
let refs = 0; const bad = [];
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  if (!/<title>[^<]{3,}/.test(html)) bad.push(`${file}: no title`);
  if (!/<meta name="description" content="[^"]{10,}/.test(html) && !file.endsWith('404.html') && file !== join(dist, 'index.html')) bad.push(`${file}: no description`);
  if (!/<h1[ >]/.test(html) && !file.endsWith('404.html') && file !== join(dist, 'index.html')) bad.push(`${file}: no h1`);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const u = m[1]; if (!u || /^(https?:|mailto:|tel:|data:|javascript:|#$)/.test(u)) continue; refs++;
    const [path, hash] = u.split('#'); let target = path ? resolve(dirname(file), path.split('?')[0]) : file;
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) { bad.push(`${file}: missing ${u}`); continue; }
    if (hash && target.endsWith('.html')) { const t = target === file ? ids : new Set([...readFileSync(target, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((x) => x[1])); if (!t.has(hash)) bad.push(`${file}: missing anchor ${u}`); }
  }
}
console.log(`${pages.length} pages, ${refs} internal references, ${bad.length} problems`); bad.slice(0, 40).forEach((b) => console.log('  ' + b)); process.exit(bad.length ? 1 : 0);
