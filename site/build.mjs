// Static site generator: node build.mjs  ->  dist/
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeCtx } from './src/render.mjs';
import * as V from './src/views.mjs';
import * as P from './src/pages.mjs';
import { SERVICES } from './src/services.mjs';
import { INDUSTRIES } from './src/industries.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const routes = [
  ['', V.home],
  ['services/', V.servicesOverview],
  ...SERVICES.map((s) => [`services/${s.slug}/`, (c) => V.serviceDetail(c, s)]),
  ['industries/', V.industriesOverview],
  ...INDUSTRIES.map((i) => [`industries/${i.slug}/`, (c) => V.industryDetail(c, i)]),
  ['our-approach/', V.approach],
  ['about/', V.about],
  ['entering-saudi-arabia/', (c) => V.journey(c, P.ENTERING, 'enter')],
  ['growing-in-saudi-arabia/', (c) => V.journey(c, P.GROWING, 'grow')],
  ['insights/', V.insights],
  ...P.ARTICLES.map((a) => [`insights/${a.slug}/`, (c) => V.article(c, a)]),
  ['readiness-checklist/', V.checklist],
  ['book-a-meeting/', V.book],
  ['enquiry/', V.enquiry],
  ['enquiry/confirmation/', V.confirmation],
  ['privacy/', (c) => V.legal(c, 'privacy')],
  ['terms/', (c) => V.legal(c, 'terms')],
  ['cookies/', (c) => V.legal(c, 'cookies')]
];

let count = 0;
for (const lang of ['en', 'ar']) {
  for (const [path, render] of routes) {
    const out = join(dist, lang, path, 'index.html');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, render(makeCtx(lang, path)));
    count++;
  }
  // 404 page sits at the language root
  const nf = join(dist, lang, '404.html');
  writeFileSync(nf, V.notFound(makeCtx(lang, '')).replaceAll('../assets', '../assets'));
  count++;
}

// Root: language redirect
writeFileSync(join(dist, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Growth Blueprint Advisory</title>
<meta http-equiv="refresh" content="0; url=en/index.html"><link rel="canonical" href="en/index.html">
<script>var l=(navigator.language||'en').toLowerCase().indexOf('ar')===0?'ar':'en';location.replace(l+'/index.html')</script></head>
<body><p><a href="en/index.html">English</a> · <a href="ar/index.html">العربية</a></p></body></html>`);

// Static assets
cpSync(join(root, 'assets'), join(dist, 'assets'), { recursive: true });
writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

console.log(`built ${count} pages, ${readdirSync(join(dist, 'assets', 'img')).length} images -> ${dist}`);
