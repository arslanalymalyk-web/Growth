import { icon, social, logoMark } from './icons.mjs';
import { L, NAV, UI, SITE } from './ui.mjs';
import { SERVICES } from './services.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const imgDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'img');
const arCache = {};
/** Aspect ratio (w/h) of a webp in assets/img, read from its header. */
export function imgAr(name) {
  if (arCache[name]) return arCache[name];
  const b = readFileSync(join(imgDir, `${name}.webp`));
  let w, h;
  const kind = b.toString('ascii', 12, 16);
  if (kind === 'VP8 ') { w = b.readUInt16LE(26) & 0x3fff; h = b.readUInt16LE(28) & 0x3fff; }
  else if (kind === 'VP8L') { const v = b.readUInt32LE(21); w = (v & 0x3fff) + 1; h = ((v >> 14) & 0x3fff) + 1; }
  else { w = 1 + (b[24] | (b[25] << 8) | (b[26] << 16)); h = 1 + (b[27] | (b[28] << 8) | (b[29] << 16)); }
  return (arCache[name] = Math.round((w / h) * 1000) / 1000);
}

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Per-page rendering context: language, current path, link helpers. */
export function makeCtx(lang, path) {
  const depth = path.split('/').filter(Boolean).length;
  const up = '../'.repeat(depth);
  const t = (v) => (v && typeof v === 'object' && 'en' in v ? v[lang] : v);
  const href = (target = '') => `${up}${target}index.html`.replace(/index\.html$/, (m) => m);
  const asset = (name) => `${up}../assets/${name}`;
  const img = (name, ext = 'webp') => `${up}../assets/img/${name}.${ext}`;
  const other = lang === 'en' ? 'ar' : 'en';
  const switchHref = `${up}../${other}/${path}index.html`;
  return { lang, path, depth, t, href, asset, img, other, switchHref, dir: lang === 'ar' ? 'rtl' : 'ltr' };
}

const arrow = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
export { arrow };

export const btn = (ctx, label, target, variant = 'gold', extra = '') =>
  `<a class="btn btn--${variant} ${extra}" href="${ctx.href(target)}"><span>${esc(ctx.t(label))}</span>${arrow}</a>`;

export const eyebrow = (ctx, text, cls = '') => (text ? `<p class="eyebrow ${cls}">${esc(ctx.t(text))}</p>` : '');

export const sectionHead = (ctx, { eyebrow: e, title, body, tone = 'light', center = false, id, side }) => `
  <div class="sec-head ${center ? 'sec-head--center' : ''} ${side ? 'sec-head--split' : ''}">
    <div>${e ? eyebrow(ctx, e, 'eyebrow--rule') : ''}<h2 ${id ? `id="${id}"` : ''} class="h2">${esc(ctx.t(title))}</h2></div>
    ${body ? `<p class="sec-head__body">${esc(ctx.t(body))}</p>` : ''}
  </div>`;

/* ---------- Header / footer ---------- */
export function header(ctx, active) {
  const items = NAV.map((n) => `<li><a href="${ctx.href(n.path)}" ${active === n.id ? 'aria-current="page" class="is-active"' : ''}>${esc(ctx.t(n.label))}</a></li>`).join('');
  return `
<a class="skip" href="#main">${esc(ctx.t(UI.skipToContent))}</a>
<header class="site-header" id="top">
  <div class="hdr container container--wide">
    <a class="brand" href="${ctx.href('')}" aria-label="${esc(ctx.t(SITE.name))}">${logoMark}<span class="brand__text"><b>GROWTH BLUEPRINT</b><i>ADVISORY</i></span></a>
    <nav class="main-nav" id="main-nav" aria-label="${esc(ctx.t(L('Primary', 'التنقل الرئيسي')))}">
      <ul>${items}</ul>
      <div class="main-nav__mobile">
        ${btn(ctx, UI.book, 'book-a-meeting/', 'gold')}
      </div>
    </nav>
    <div class="hdr__right">
      <div class="lang" role="group" aria-label="${esc(ctx.t(UI.language))}">
        <a href="${ctx.lang === 'en' ? '#' : ctx.switchHref}" lang="en" ${ctx.lang === 'en' ? 'aria-current="true" class="is-active"' : ''}>EN</a><span aria-hidden="true">|</span><a href="${ctx.lang === 'ar' ? '#' : ctx.switchHref}" lang="ar" ${ctx.lang === 'ar' ? 'aria-current="true" class="is-active"' : ''}>AR</a>
      </div>
      ${btn(ctx, UI.book, 'book-a-meeting/', 'gold', 'btn--sm hdr__cta')}
    </div>
    <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="${esc(ctx.t(UI.menu))}"><span></span><span></span><span></span></button>
  </div>
</header>`;
}

const skyline = `<svg class="skyline" viewBox="0 0 420 110" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" aria-hidden="true" preserveAspectRatio="xMaxYMax meet">
<path d="M0 108h420"/><path d="M8 108V92M5 92h6M8 92v-14M4 80l4-6 4 6M8 86l-5 5M8 86l5 5" opacity=".7"/>
<path d="M40 108V70h14v38M47 70V60M62 108V82h12v26M80 108V58l8-6 8 6v50M104 108V76h16v32M126 108V50h4v-8h4v8h4v58"/>
<path d="M150 108V64l12-14 12 14v44M170 108V80h10v28M186 108V40l10-22 10 22v68M196 18V8"/>
<path d="M214 108V30l10-26 10 26v78M219 108V60M229 108V60" />
<path d="M244 108V72h14l6 6v30M270 108V90h14v18M290 108V44l6-8h10l6 8v64M300 36V26M312 108V62h16v46M334 108V84h10v24M350 108V54l16-10 16 10v54M374 108V70M390 108V86h14v22" opacity=".85"/>
<path d="M410 108V94M407 94h6M410 94v-12M406 84l4-6 4 6" opacity=".7"/></svg>`;

export function footer(ctx) {
  const svc = SERVICES.map((s) => `<li><a href="${ctx.href(`services/${s.slug}/`)}">${esc(ctx.t(s.title))}</a></li>`).join('');
  const q = NAV.concat([{ id: 'book', path: 'book-a-meeting/', label: UI.book }]).map((n) => `<li><a href="${ctx.href(n.path)}">${esc(ctx.t(n.label))}</a></li>`).join('');
  return `
<footer class="site-footer">
  <div class="container container--wide">
    <div class="ftr-grid">
      <div class="ftr-brand">
        <a class="brand" href="${ctx.href('')}">${logoMark}<span class="brand__text"><b>GROWTH BLUEPRINT</b><i>ADVISORY</i></span></a>
        <p>${esc(ctx.t(UI.footerTag))}</p>
        <div class="social"><a href="#" aria-label="LinkedIn">${social('linkedin')}</a><a href="#" aria-label="X">${social('x')}</a><a href="#" aria-label="YouTube">${social('youtube')}</a></div>
      </div>
      <div><h2 class="ftr-h">${esc(ctx.t(UI.quickLinks))}</h2><ul class="ftr-list">${q}</ul></div>
      <div><h2 class="ftr-h">${esc(ctx.t(UI.ourServices))}</h2><ul class="ftr-list ftr-list--sm">${svc}</ul></div>
      <div class="ftr-contact"><h2 class="ftr-h">${esc(ctx.t(UI.getInTouch))}</h2>
        <ul class="ftr-list ftr-list--icons">
          <li>${icon('pin')}<span>${esc(ctx.t(SITE.address))}</span></li>
          <li>${icon('mail')}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li>${icon('phone')}<a href="tel:${SITE.phoneHref}" dir="ltr">${SITE.phone}</a></li>
        </ul>
        ${btn(ctx, UI.book, 'book-a-meeting/', 'outline-gold', 'btn--sm')}
      </div>
    </div>
    ${skyline}
    <div class="ftr-bottom">
      <p>© ${SITE.year} ${esc(ctx.t(SITE.name))}. ${esc(ctx.t(UI.rights))}</p>
      <ul><li><a href="${ctx.href('privacy/')}">${esc(ctx.t(UI.privacy))}</a></li><li><a href="${ctx.href('terms/')}">${esc(ctx.t(UI.terms))}</a></li><li><a href="${ctx.href('cookies/')}">${esc(ctx.t(UI.cookies))}</a></li></ul>
    </div>
    <p class="ftr-demo">${esc(ctx.t(UI.demoNote))}</p>
  </div>
</footer>
<div class="cookie" id="cookie" role="region" aria-label="${esc(ctx.t(UI.cookies))}" hidden>
  <p>${esc(ctx.t(UI.cookieText))} <a href="${ctx.href('cookies/')}">${esc(ctx.t(UI.cookies))}</a></p>
  <div><button class="btn btn--gold btn--sm" data-cookie="accept"><span>${esc(ctx.t(UI.cookieAccept))}</span></button><button class="btn btn--outline btn--sm" data-cookie="essential"><span>${esc(ctx.t(UI.cookieDecline))}</span></button></div>
</div>`;
}

/* ---------- Page shell ---------- */
export function shell(ctx, { title, description, active, body, extraHead = '', bodyClass = '' }) {
  const t = ctx.t;
  const alt = ctx.path;
  const base = `${ctx.href('').replace(/index\.html$/, '')}`;
  const ogImg = ctx.img('hero-skyline-dusk');
  return `<!doctype html>
<html lang="${ctx.lang}" dir="${ctx.dir}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t(title))}</title>
<meta name="description" content="${esc(t(description || ''))}">
<meta name="theme-color" content="#0d1f38">
<meta property="og:title" content="${esc(t(title))}">
<meta property="og:description" content="${esc(t(description || ''))}">
<meta property="og:type" content="website">
<meta property="og:image" content="${ogImg}">
<meta property="og:locale" content="${ctx.lang === 'ar' ? 'ar_SA' : 'en_GB'}">
<link rel="alternate" hreflang="en" href="${ctx.lang === 'en' ? '' : ctx.switchHref}">
<link rel="alternate" hreflang="ar" href="${ctx.lang === 'ar' ? '' : ctx.switchHref}">
<link rel="icon" href="${ctx.asset('favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Noto+Naskh+Arabic:wght@400;500;600&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap">
<link rel="stylesheet" href="${ctx.asset('styles.css')}">
<script>document.documentElement.className='js'</script>
${extraHead}
</head>
<body class="${bodyClass}">
${header(ctx, active)}
<main id="main">
${body}
</main>
${footer(ctx)}
<script src="${ctx.asset('app.js')}" defer></script>
</body>
</html>`;
}

/* ---------- Shared sections ---------- */
export function hero(ctx, { eyebrow: e, title, sub, lead, img, side, ctas = [], crumbs, tone = 'dark', pos, full = false }) {
  const cr = crumbs
    ? `<nav class="crumbs" aria-label="${esc(ctx.t(L('Breadcrumb', 'مسار التنقل')))}"><ol>${crumbs.map((c, i) => `<li>${c.href ? `<a href="${c.href}">${esc(ctx.t(c.label))}</a>` : `<span aria-current="page">${esc(ctx.t(c.label))}</span>`}</li>`).join('')}</ol></nav>`
    : '';
  return `
<section class="hero ${full ? 'hero--full' : ''}" ${pos ? `style="--hero-pos:${pos}"` : ''}>
  <div class="hero__bg" style="background-image:url('${ctx.img(img)}');--ar:${imgAr(img)}" aria-hidden="true"></div>
  <div class="hero__shade" aria-hidden="true"></div>
  <div class="container container--wide hero__in">
    <div class="hero__copy">
      ${cr}
      ${e ? `<p class="eyebrow">${esc(ctx.t(e))}</p>` : ''}
      <h1 class="hero__title">${esc(ctx.t(title))}</h1>
      <span class="rule" aria-hidden="true"></span>
      ${sub ? `<p class="hero__sub">${esc(ctx.t(sub))}</p>` : ''}
      ${lead ? `<p class="hero__lead">${esc(ctx.t(lead))}</p>` : ''}
      ${ctas.length ? `<div class="hero__ctas">${ctas.join('')}</div>` : ''}
    </div>
    ${side ? `<ul class="hero__side" aria-hidden="true">${side.map((s) => `<li>${esc(ctx.t(s))}</li>`).join('')}</ul>` : ''}
  </div>
</section>`;
}

export function ctaBand(ctx, { eyebrow: e, title, body, img, variant = 'photo', cta = UI.book, target = 'book-a-meeting/' }) {
  return `
<section class="cta-band cta-band--${variant}" ${img ? `style="--cta-img:url('${ctx.img(img)}');--ar:${imgAr(img)}"` : ''}>
  <div class="cta-band__bg" aria-hidden="true"></div>
  <div class="container container--wide cta-band__in">
    <div class="cta-band__copy">
      ${e ? `<p class="eyebrow">${esc(ctx.t(e))}</p>` : ''}
      <h2 class="h2">${esc(ctx.t(title))}</h2>
      ${body ? `<p>${esc(ctx.t(body))}</p>` : ''}
    </div>
    <div class="cta-band__act">${btn(ctx, cta, target, 'gold')}</div>
  </div>
</section>`;
}

export const serviceCard = (ctx, s, { photo = true } = {}) => `
<article class="card svc-card">
  ${photo ? `<a class="card__img" href="${ctx.href(`services/${s.slug}/`)}" tabindex="-1" aria-hidden="true"><img src="${ctx.img(s.card)}" alt="" loading="lazy"></a>` : ''}
  <div class="card__body">
    <span class="card__icon">${icon(s.icon)}</span>
    <h3 class="card__title"><a href="${ctx.href(`services/${s.slug}/`)}">${esc(ctx.t(s.title))}</a></h3>
    <p>${esc(ctx.t(s.short))}</p>
    <a class="more" href="${ctx.href(`services/${s.slug}/`)}"><span>${esc(ctx.t(UI.explore))}</span>${arrow}</a>
  </div>
</article>`;

export const faq = (ctx, items) => `<div class="faq">${items.map((f, i) => `<details ${i === 0 ? '' : ''}><summary><span>${esc(ctx.t(f.q))}</span><i aria-hidden="true">${icon('plus')}</i></summary><div class="faq__a"><p>${esc(ctx.t(f.a))}</p></div></details>`).join('')}</div>`;
