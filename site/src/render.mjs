import { icon, social, logoMark } from './icons.mjs';
import { L, NAV, UI, SITE } from './ui.mjs';
import { NEWS } from './legal.mjs';
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
  const href = (target = '') => { const [p, h] = String(target).split('#'); return `${up}${p}index.html${h ? '#' + h : ''}`; };
  const asset = (name) => `${up}../assets/${name}`;
  const img = (name, ext = 'webp') => `${up}../assets/img/${name}.${ext}`;
  const other = lang === 'en' ? 'ar' : 'en';
  const switchHref = `${up}../${other}/${path}index.html`;
  return { lang, path, depth, t, href, asset, img, other, switchHref, dir: lang === 'ar' ? 'rtl' : 'ltr' };
}

const arrow = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
export { arrow };

/** Cloudflare Turnstile widget, only when TURNSTILE_SITE_KEY is set at build time. */
export const tsWidget = () => (process.env.TURNSTILE_SITE_KEY ? `<div class="cf-turnstile" data-sitekey="${process.env.TURNSTILE_SITE_KEY}" data-theme="light"></div>` : '');
export const btn = (ctx, label, target, variant = 'gold', extra = '') =>
  `<a class="btn btn--${variant} ${extra}" href="${ctx.href(target)}"><span>${esc(ctx.t(label))}</span>${arrow}</a>`;

export const eyebrow = (ctx, text, cls = '') => (text ? `<p class="eyebrow ${cls}">${esc(ctx.t(text))}</p>` : '');

export const sectionHead = (ctx, { eyebrow: e, title, body, tone = 'light', center = false, id, side }) => `
  <div class="sec-head ${center ? 'sec-head--center' : ''} ${side ? 'sec-head--split' : ''}">
    <div>${e ? eyebrow(ctx, e, 'eyebrow--rule') : ''}<h2 ${id ? `id="${id}"` : ''} class="h2">${esc(ctx.t(title))}</h2></div>
    ${body ? `<p class="sec-head__body">${esc(ctx.t(body))}</p>` : ''}
  </div>`;


/* ---------- newsletter form (footer, Insights, shop) ---------- */
export function newsletter(ctx, { variant = 'band', id = 'nl', source = 'site' } = {}) {
  const compact = variant === 'compact';
  const data = `data-newsletter data-source="${source}" data-ok="${esc(ctx.t(NEWS.ok))}" data-demo="${esc(ctx.t(NEWS.demo))}" data-demo-confirm="${esc(ctx.t(NEWS.demoConfirm))}" data-err-email="${esc(ctx.t(NEWS.errEmail))}" data-err-consent="${esc(ctx.t(NEWS.errConsent))}" data-err-server="${esc(ctx.t(NEWS.errServer))}"`;
  return `
<form class="nl nl--${variant}" ${data} novalidate aria-label="${esc(ctx.t(NEWS.eyebrow))}">
  ${compact ? `<h2 class="ftr-h">${esc(ctx.t(NEWS.eyebrow))}</h2><p class="nl__body">${esc(ctx.t(L('One useful email a month about doing business in Saudi Arabia.', 'رسالة واحدة مفيدة كل شهر عن ممارسة الأعمال في السعودية.')))}</p>` : `<p class="eyebrow">${esc(ctx.t(NEWS.eyebrow))}</p><h2 class="h2">${esc(ctx.t(NEWS.title))}</h2><p class="nl__body">${esc(ctx.t(NEWS.body))}</p>`}
  <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">${tsWidget()}
  <div class="nl__row">
    ${compact ? '' : `<div class="field"><label for="${id}-name">${esc(ctx.t(NEWS.name))}</label><input id="${id}-name" name="name" type="text" autocomplete="name"></div>`}
    <div class="field"><label ${compact ? 'class="sr-only"' : ''} for="${id}-email">${esc(ctx.t(NEWS.email))}</label><input id="${id}-email" name="email" type="email" autocomplete="email" dir="ltr" placeholder="${compact ? esc(ctx.t(NEWS.email)) : ''}" required></div>
    <button class="btn btn--gold" type="submit"><span>${esc(ctx.t(NEWS.submit))}</span>${arrow}</button>
  </div>
  <label class="check"><input type="checkbox" name="consent"><span class="check__b" aria-hidden="true">${icon('check')}</span><span>${esc(ctx.t(NEWS.consent))} <a href="${ctx.href('privacy/')}">${esc(ctx.t(NEWS.privacyLink))}</a></span></label>
  <p class="err" role="alert" hidden data-news-err></p>
  <p class="nl__ok" role="status" hidden data-news-msg></p>
</form>`;
}

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
      <a class="basket-link" href="${ctx.href('shop/basket/')}" aria-label="${esc(ctx.t(L('Basket', 'السلة')))}">${icon('bag')}<span class="basket-link__n" data-basket-count hidden>0</span></a>
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
  const q = NAV.concat([{ id: 'how', path: 'how-we-work/', label: L('How we work', 'كيف نعمل') }, { id: 'team', path: 'team/', label: L('Team', 'الفريق') }, { id: 'faq', path: 'faq/', label: L('Investor FAQ', 'أسئلة المستثمرين') }, { id: 'book', path: 'book-a-meeting/', label: UI.book }]).map((n) => `<li><a href="${ctx.href(n.path)}">${esc(ctx.t(n.label))}</a></li>`).join('');
  return `
<footer class="site-footer">
  <div class="container container--wide">
    <div class="ftr-news">${newsletter(ctx, { variant: 'compact', id: 'fnl', source: 'footer' })}</div>
    <div class="ftr-grid">
      <div class="ftr-brand">
        <a class="brand" href="${ctx.href('')}">${logoMark}<span class="brand__text"><b>GROWTH BLUEPRINT</b><i>ADVISORY</i></span></a>
        <p>${esc(ctx.t(UI.footerTag))}</p>
        <div class="social"><a href="${SITE.linkedin}" rel="noopener" target="_blank" aria-label="LinkedIn (opens in a new tab)">${social('linkedin')}</a></div>
      </div>
      <div><h2 class="ftr-h">${esc(ctx.t(UI.quickLinks))}</h2><ul class="ftr-list">${q}</ul></div>
      <div><h2 class="ftr-h">${esc(ctx.t(UI.ourServices))}</h2><ul class="ftr-list ftr-list--sm">${svc}</ul></div>
      <div class="ftr-contact"><h2 class="ftr-h">${esc(ctx.t(UI.getInTouch))}</h2>
        <ul class="ftr-list ftr-list--icons">
          <li>${icon('pin')}<span>${esc(ctx.t(SITE.address))}</span></li>
          <li>${icon('mail')}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li>${icon('phone')}<a href="tel:${SITE.phoneHref}" dir="ltr">${SITE.phone}</a></li>
        </ul>
        <p class="ftr-lic">${esc(ctx.t(L('Licensed by MHRSD #970146 · Saudi Arabia · Vision 2030 aligned', 'مرخّصة من وزارة الموارد البشرية والتنمية الاجتماعية رقم 970146 · المملكة العربية السعودية · متوافقة مع رؤية 2030')))}</p>
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
const NOINDEX = new Set(['shop/basket/', 'shop/checkout/', 'shop/order/', 'readiness-scorecard/assessment/', 'readiness-scorecard/results/', 'enquiry/confirmation/', 'newsletter/confirmed/', 'newsletter/unsubscribed/']);
export const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '');

/** Site-wide organisation data (home page). Facts come from the firm's published website. */
const orgLd = (ctx) => ({
  '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Growth Blueprint', alternateName: 'غروث بلوبرينت', url: `${SITE_URL}/${ctx.lang}/`,
  logo: `${SITE_URL}/assets/logo-primary.png`, image: `${SITE_URL}/assets/og-image.png`, email: SITE.email, telephone: SITE.phone,
  description: 'Saudi advisory firm helping international investors understand and access the Saudi market, aligned with Vision 2030.',
  address: { '@type': 'PostalAddress', streetAddress: 'Office #303, Optima Tower, Al-Shatie District', addressLocality: 'Jeddah', addressCountry: 'SA' },
  areaServed: { '@type': 'Country', name: 'Saudi Arabia' }, foundingDate: '2024', sameAs: [SITE.linkedin],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:30', closes: '17:30' }]
});

/** Page shell. SEO tags that need absolute URLs (canonical, hreflang, Open Graph URL, JSON-LD, sitemap) switch on when SITE_URL is set at build time. */
export function shell(ctx, { title, description, active, body, extraHead = '', bodyClass = '', scripts = [], jsonld = [] }) {
  const t = ctx.t;
  const abs = (lang) => `${SITE_URL}/${lang}/${ctx.path}`;
  const og = SITE_URL ? `${SITE_URL}/assets/og-image.png` : ctx.asset('og-image.png');
  const seo = SITE_URL ? `
<link rel="canonical" href="${abs(ctx.lang)}">
<link rel="alternate" hreflang="en" href="${abs('en')}">
<link rel="alternate" hreflang="ar" href="${abs('ar')}">
<link rel="alternate" hreflang="x-default" href="${abs('en')}">
<meta property="og:url" content="${abs(ctx.lang)}">` : '';
  const ld = (ctx.path === '' ? [orgLd(ctx)] : []).concat(jsonld).filter(() => SITE_URL).map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
  return `<!doctype html>
<html lang="${ctx.lang}" dir="${ctx.dir}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t(title))}</title>
<meta name="description" content="${esc(t(description || ''))}">
<meta name="theme-color" content="#0d1f38">
${NOINDEX.has(ctx.path) ? '<meta name="robots" content="noindex, follow">' : ''}
<meta property="og:site_name" content="Growth Blueprint | غروث بلوبرينت">
<meta property="og:title" content="${esc(t(title))}">
<meta property="og:description" content="${esc(t(description || ''))}">
<meta property="og:type" content="website">
<meta property="og:image" content="${og}">
<meta property="og:locale" content="${ctx.lang === 'ar' ? 'ar_SA' : 'en_GB'}">
<meta property="og:locale:alternate" content="${ctx.lang === 'ar' ? 'en_GB' : 'ar_SA'}">
<meta name="twitter:card" content="summary_large_image">${seo}
${process.env.ANALYTICS_DOMAIN ? `<meta name="gba-analytics" content="${process.env.ANALYTICS_DOMAIN}">` : ''}
${process.env.TURNSTILE_SITE_KEY ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ''}
<link rel="icon" href="${ctx.asset('favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${ctx.asset('apple-touch-icon.png')}">
<link rel="preload" href="${ctx.asset(ctx.lang === 'ar' ? 'fonts/noto-naskh-arabic.woff2' : 'fonts/newsreader-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${ctx.asset('styles.css')}">
${ld}
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
${scripts.map((f) => `<script src="${ctx.asset(f)}" defer></script>`).join('\n')}
</body>
</html>`;
}

/* ---------- Shared sections ---------- */
export function hero(ctx, { eyebrow: e, title, sub, lead, img, side, ctas = [], crumbs, tone = 'dark', pos, full = false, live = null }) {
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
      <h1 class="hero__title"${live ? ` data-live="${esc(ctx.t(live.title))}"` : ''}>${esc(ctx.t(title))}</h1>
      <span class="rule" aria-hidden="true"></span>
      ${sub ? `<p class="hero__sub">${esc(ctx.t(sub))}</p>` : ''}
      ${lead ? `<p class="hero__lead"${live ? ` data-live="${esc(ctx.t(live.lead))}"` : ''}>${esc(ctx.t(lead))}</p>` : ''}
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


/* ---------- WOW hero: blueprint draws itself, photo reveals, scorecard card floats in ---------- */
function skylineBlueprint() {
  const W = 1440, base = 330;
  const gen = [], lm = [];
  // generic towers (x, width, height, setback): kept below y=140 so nothing is cropped on wide screens
  const towers = [[0, 74, 96, 1], [86, 52, 150, 0], [150, 64, 118, 1], [226, 48, 176, 0], [286, 72, 104, 1], [366, 56, 156, 0], [434, 62, 126, 1], [506, 46, 186, 0], [548, 64, 112, 1],
    [964, 50, 124, 1], [1030, 58, 170, 0], [1100, 56, 150, 1], [1126, 56, 176, 0], [1194, 70, 126, 1], [1276, 52, 160, 0], [1340, 62, 108, 1], [1410, 40, 136, 0]];
  towers.forEach(([x, w, h, sb]) => {
    const top = base - h;
    gen.push(`M${x} ${base}V${top}H${x + w}V${base}`);
    if (sb) gen.push(`M${x + 8} ${top}V${top - 12}H${x + w - 8}V${top}`);
    for (let y = top + 16; y < base - 8; y += 16) gen.push(`M${x + 6} ${y}H${x + w - 6}`);
  });
  // Landmarks sit in the clear space between the headline and the scorecard card
  const f = 640, k = 826; // centre x of each landmark
  lm.push(`M${f - 18} ${base}V236L${f - 12} 218H${f + 12}L${f + 18} 236V${base}`, `M${f} 218V208`, `M${f - 12} 196a12 12 0 1 0 24 0a12 12 0 1 0-24 0`, `M${f} 184V150`, `M${f - 10} 250H${f + 10}M${f - 10} 268H${f + 10}M${f - 10} 286H${f + 10}`);
  lm.push(`M${k - 56} ${base}V210C${k - 56} 166 ${k - 30} 140 ${k} 140C${k + 30} 140 ${k + 56} 166 ${k + 56} 210V${base}`, `M${k - 28} 236C${k - 24} 196 ${k - 10} 180 ${k} 180C${k + 10} 180 ${k + 24} 196 ${k + 28} 236`, `M${k - 28} 236H${k + 28}`, `M${k - 28} 236V${base}M${k + 28} 236V${base}`, `M${k} 140V120`);
  lm.push(`M${k - 56} ${base + 14}H${k + 56}M${k - 56} ${base + 8}V${base + 20}M${k + 56} ${base + 8}V${base + 20}`);
  const ground = `<path d="M0 ${base}H${W}" pathLength="1" style="--i:0"/>`;
  const el = (arr, off) => arr.map((d, i) => `<path d="${d}" pathLength="1" style="--i:${i + off}"/>`).join('');
  return `<svg class="wow__sky" viewBox="0 0 ${W} ${base + 24}" preserveAspectRatio="xMidYMax slice" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><g class="gen">${el(gen, 1)}</g><g class="lm">${el(lm, 40)}</g>${ground}</svg>`;
}

export function heroWow(ctx, { eyebrow: e, title, lead, img, card, ctas }) {
  const words = ctx.t(title).split(' ').map((w, i) => `<span class="w"><span style="--wi:${i}">${esc(w)}</span></span>`).join(' ');
  const bars = card.sample.map(([k, v], i) => `<li style="--i:${i}"><span>${esc(ctx.t(k))}</span><i><b style="--v:${v}%"></b></i><em>${v}</em></li>`).join('');
  return `
<section class="wow" aria-labelledby="wow-title">
  <div class="wow__grid" aria-hidden="true"></div>
  <div class="wow__photo" aria-hidden="true"><div class="wow__img" style="background-image:url('${ctx.img(img)}')"></div></div>
  <div class="wow__shade" aria-hidden="true"></div>
  ${skylineBlueprint()}
  <p class="wow__coords" dir="ltr" aria-hidden="true">24.7136° N · 46.6753° E</p>
  <div class="container container--wide wow__in">
    <div class="wow__copy">
      <p class="eyebrow wow__eyebrow">${esc(ctx.t(e))}</p>
      <h1 class="wow__title" id="wow-title" aria-label="${esc(ctx.t(title))}">${words}</h1>
      <span class="wow__rule" aria-hidden="true"></span>
      <p class="wow__lead">${esc(ctx.t(lead))}</p>
      <div class="wow__ctas">${ctas.join('')}</div>
      <ul class="wow__pills" aria-hidden="true"><li>${esc(ctx.t(L('Clarity', 'وضوح')))}</li><li>${esc(ctx.t(L('Confidence', 'ثقة')))}</li><li>${esc(ctx.t(L('Connections', 'علاقات')))}</li></ul>
    </div>
    <aside class="wow__card" aria-label="${esc(ctx.t(card.label))}">
      <p class="wow__card-k">${esc(ctx.t(card.kicker))}</p>
      <h2 class="wow__card-t">${esc(ctx.t(card.title))}</h2>
      <div class="wow__ring" data-score="${card.score}" role="img" aria-label="${esc(ctx.t(card.sampleLabel))} ${card.score}/100">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" pathLength="100" style="--s:${card.score}"/></svg>
        <div><b data-count="${card.score}">${card.score}</b><small>${esc(ctx.t(card.sampleLabel))}</small></div>
      </div>
      <ul class="wow__bars" aria-hidden="true">${bars}</ul>
      <p class="wow__card-d">${esc(ctx.t(card.body))}</p>
      <a class="btn btn--gold" href="${ctx.href('readiness-scorecard/')}"><span>${esc(ctx.t(card.cta))}</span>${arrow}</a>
    </aside>
  </div>
  <a class="wow__cue" href="#after-hero" aria-label="${esc(ctx.t(L('Scroll down', 'مرّر للأسفل')))}"><span></span></a>
</section>
<div id="after-hero"></div>`;
}
