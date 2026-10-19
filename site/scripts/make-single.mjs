// Packs the built site into ONE self-contained HTML file: every page (English and Arabic), styles, fonts, images and scripts inlined.
// Pages switch in place with a small hash router (#/en/services/). Forms and the shop run in demo mode, because a single file has no server.
//   node build.mjs && node scripts/make-single.mjs   ->  growth-blueprint-single.html
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
const root = resolve(dirname(new URL(import.meta.url).pathname), '..'), dist = join(root, 'dist');
const b64 = (f) => readFileSync(f).toString('base64');

/* images and fonts as data URIs */
const IMG = {}; for (const f of readdirSync(join(dist, 'assets', 'img'))) if (f.endsWith('.webp')) IMG[f.slice(0, -5)] = 'data:image/webp;base64,' + b64(join(dist, 'assets', 'img', f));
const ASSET = { 'favicon.svg': 'data:image/svg+xml;base64,' + b64(join(dist, 'assets', 'favicon.svg')), 'apple-touch-icon.png': '', 'og-image.png': '' };
let css = readFileSync(join(dist, 'assets', 'styles.css'), 'utf8').replace(/url\('fonts\/([^']+)'\)/g, (_, f) => `url('data:font/woff2;base64,${b64(join(dist, 'assets', 'fonts', f))}')`);
const js = { app: readFileSync(join(dist, 'assets', 'app.js'), 'utf8'), 'scorecard.js': readFileSync(join(dist, 'assets', 'scorecard.js'), 'utf8'), 'shop.js': readFileSync(join(dist, 'assets', 'shop.js'), 'utf8'), 'sessions.js': readFileSync(join(dist, 'assets', 'sessions.js'), 'utf8') };

/* pages */
const files = []; (function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : f === 'index.html' && /[\\/](en|ar)[\\/]/.test(p) && files.push(p); } })(dist);
const keyOf = (f) => relative(dist, dirname(f)).split(sep).join('/') + '/';
const keys = new Set(files.map(keyOf));
const PAGES = {};
for (const f of files) {
  const html = readFileSync(f, 'utf8'), key = keyOf(f), here = dirname(f);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || 'Growth Blueprint';
  const bcls = (html.match(/<body class="([^"]*)"/) || [])[1] || '';
  const lang = key.startsWith('ar/') ? 'ar' : 'en';
  const scripts = [...html.matchAll(/<script src="[^"]*?([\w.-]+\.js)" defer>/g)].map((m) => m[1]).filter((n) => n !== 'app.js');
  let body = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>')); body = body.slice(body.indexOf('>') + 1);
  body = body.replace(/<script(?![^>]*type="application\/json")[^>]*>[\s\S]*?<\/script>/g, '');
  body = body.replace(/\s(href|action)="([^"]*)"/g, (m, a, u) => {
    if (!u || /^(https?:|mailto:|tel:|data:|javascript:|#)/.test(u)) return m;
    const [pth, hash] = u.split('#'); const target = relative(dist, resolve(here, pth.replace(/index\.html$/, ''))).split(sep).join('/') + '/';
    return keys.has(target) ? ` ${a}="#/${target}${hash ? '~' + hash : ''}"` : m;
  });
  body = body.replace(/(?:\.\.\/)+assets\/favicon\.svg/g, ASSET['favicon.svg']);
  PAGES[key] = { t: title.replace(/&amp;/g, '&'), c: bcls, l: lang, s: scripts, h: body };
}
const json = (o) => JSON.stringify(o).replace(/<\//g, '<\\/');
const safeJs = (s) => s.replace(/<\/script/gi, '<\\/script');
const router = `(function(){
var PAGES=JSON.parse(document.getElementById('pages').textContent),IMG=JSON.parse(document.getElementById('imgs').textContent);
var CODE={app:document.getElementById('js-app').textContent,'scorecard.js':document.getElementById('js-sc').textContent,'shop.js':document.getElementById('js-shop').textContent,'sessions.js':document.getElementById('js-sess').textContent};
var cur='';window.__gbaSingle=true;
function fix(h){return h.replace(/(?:\\.\\.\\/)+assets\\/img\\/([\\w-]+)\\.webp/g,function(m,n){return IMG[n]||m})}
function run(c){try{(0,eval)(c)}catch(e){console.error(e)}}
function go(key,anchor){
  var p=PAGES[key]; if(!p){key=(/^ar\\//.test(key)?'ar/':'en/');p=PAGES[key]}
  var html=document.documentElement; html.lang=p.l; html.dir=p.l==='ar'?'rtl':'ltr';
  document.title=p.t; document.body.className=p.c; document.body.innerHTML=fix(p.h); cur=key;
  run(CODE.app); p.s.forEach(function(n){run(CODE[n])});
  if(anchor){var el=document.getElementById(anchor); if(el){el.scrollIntoView();return}} window.scrollTo(0,0);
}
function route(){var h=location.hash; if(h.indexOf('#/')!==0){ if(!cur) go(((navigator.language||'en').toLowerCase().indexOf('ar')===0)?'ar/':'en/'); return }
  var r=h.slice(2).split('~'); go(r[0],r[1]) }
window.addEventListener('hashchange',route);
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#/"]'); if(a&&a.getAttribute('href')==='#/'+cur){e.preventDefault();window.scrollTo(0,0)}});
route();
})();`;
const out = `<!doctype html>
<html lang="en" class="js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Growth Blueprint</title>
<meta name="description" content="Growth Blueprint: a Saudi advisory firm helping international investors understand and access the Saudi market. Single-file edition of the bilingual website.">
<link rel="icon" href="${ASSET['favicon.svg']}" type="image/svg+xml">
<style>${css}</style></head>
<body><noscript><p style="padding:2rem;font:16px system-ui">This single-file edition needs JavaScript to switch pages. Open the full site (dist/) for a no-JavaScript version.</p></noscript>
<script type="application/json" id="pages">${json(PAGES)}</script>
<script type="application/json" id="imgs">${json(IMG)}</script>
<script type="text/plain" id="js-app">${safeJs(js.app)}</script>
<script type="text/plain" id="js-sc">${safeJs(js['scorecard.js'])}</script>
<script type="text/plain" id="js-shop">${safeJs(js['shop.js'])}</script>
<script type="text/plain" id="js-sess">${safeJs(js['sessions.js'])}</script>
<script>${router}</script>
</body></html>`;
const target = join(root, 'growth-blueprint-single.html');
writeFileSync(target, out); console.log(target, (out.length / 1048576).toFixed(1) + ' MB,', Object.keys(PAGES).length, 'pages');
