// Static site generator: node build.mjs  ->  dist/
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeCtx, SITE_URL } from './src/render.mjs';
import * as V from './src/views.mjs';
import * as P from './src/pages.mjs';
import * as V2 from './src/views2.mjs';
import * as X from './src/extra.mjs';
import * as V3 from './src/views3.mjs';
import { PRODUCTS } from './src/shop.mjs';
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
  ['how-we-work/', X.howWeWork],
  ['team/', X.teamPage],
  ['faq/', X.faqPage],
  ['work-with-us/', X.workWithUs],
  ['image-credits/', X.imageCredits],
  ['about/', V.about],
  ['entering-saudi-arabia/', (c) => V.journey(c, P.ENTERING, 'enter')],
  ['growing-in-saudi-arabia/', (c) => V.journey(c, P.GROWING, 'grow')],
  ['insights/', V.insights],
  ...P.ARTICLES.map((a) => [`insights/${a.slug}/`, (c) => V.article(c, a)]),
  ['readiness-checklist/', V.checklist],
  ['book-a-meeting/', V.book],
  ['book-a-session/', V3.bookSession],
  ['book-a-session/confirmation/', V3.sessionConfirmation],
  ['enquiry/', V.enquiry],
  ['enquiry/confirmation/', V.confirmation],
  ['readiness-scorecard/', V.scorecardIntro],
  ['readiness-scorecard/assessment/', V.scorecardAssessment],
  ['readiness-scorecard/results/', V.scorecardResults],
  ['shop/', V2.shopIndex],
  ...PRODUCTS.map((p) => [`shop/${p.slug}/`, (c) => V2.shopProduct(c, p)]),
  ['shop/basket/', V2.shopBasket],
  ['shop/checkout/', V2.shopCheckout],
  ['shop/order/', V2.shopOrder],
  ['newsletter/confirmed/', (c) => V2.newsletterPage(c, 'confirmed')],
  ['newsletter/unsubscribed/', (c) => V2.newsletterPage(c, 'unsubscribed')],
  ['privacy/', V2.privacy],
  ['terms/', V2.terms],
  ['cookies/', V2.cookies]
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
writeFileSync(join(dist, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Growth Blueprint</title>
<meta http-equiv="refresh" content="0; url=en/index.html"><link rel="canonical" href="en/index.html">
<script>var l=(navigator.language||'en').toLowerCase().indexOf('ar')===0?'ar':'en';location.replace(l+'/index.html')</script></head>
<body><p><a href="en/index.html">English</a> · <a href="ar/index.html">العربية</a></p></body></html>`);

// Static assets
cpSync(join(root, 'assets'), join(dist, 'assets'), { recursive: true });
// robots + sitemap: search engines are blocked unless SITE_URL is set at build time (e.g. SITE_URL=https://www.example.com node build.mjs)
const NO_INDEX = ['book-a-session/confirmation/', 'shop/basket/', 'shop/checkout/', 'shop/order/', 'readiness-scorecard/assessment/', 'readiness-scorecard/results/', 'enquiry/confirmation/', 'newsletter/confirmed/', 'newsletter/unsubscribed/'];
if (SITE_URL) {
  writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /download/\nDisallow: /admin\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  const day = new Date().toISOString().slice(0, 10);
  const urls = routes.map(([p]) => p).filter((p) => !NO_INDEX.includes(p)).map((p) => {
    const loc = (l) => `${SITE_URL}/${l}/${p}`;
    return ['en', 'ar'].map((l) => `<url><loc>${loc(l)}</loc><lastmod>${day}</lastmod><xhtml:link rel="alternate" hreflang="en" href="${loc('en')}"/><xhtml:link rel="alternate" hreflang="ar" href="${loc('ar')}"/><xhtml:link rel="alternate" hreflang="x-default" href="${loc('en')}"/></url>`).join('');
  }).join('\n');
  writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);
} else {
  writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
}

console.log(`built ${count} pages, ${readdirSync(join(dist, 'assets', 'img')).length} images -> ${dist}`);
