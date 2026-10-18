// Newer pages: briefs shop, newsletter, privacy notice, terms, cookies, newsletter confirmations.
import { icon } from './icons.mjs';
import { L, UI, SITE } from './ui.mjs';
import { INDUSTRIES } from './industries.mjs';
import { SHOP, PRODUCTS, productBySlug, VAT_RATE, CURRENCY } from './shop.mjs';
import { BRIEFS, BRIEF_CHAPTERS } from './briefs.mjs';
import { NEWS, CONSENT, PRIVACY, TERMS, COOKIES } from './legal.mjs';
import { SC_PAGE } from './scorecard.mjs';
import { esc, shell, hero, ctaBand, btn, arrow, eyebrow, newsletter } from './render.mjs';

const T = (ctx, v) => esc(ctx.t(v));
const crumbs = (ctx, ...items) => [{ label: UI.breadcrumbHome, href: ctx.href('') }, ...items];
const sar = (ctx, n) => (ctx.lang === 'ar' ? `${n.toLocaleString('ar-SA')} ر.س` : `SAR ${n.toLocaleString('en-GB')}`);

/* ---------- shop ---------- */
const shopData = (ctx) => {
  const S = SHOP, t = ctx.t;
  return {
    lang: ctx.lang, cur: ctx.lang === 'ar' ? 'ر.س' : 'SAR', vat: VAT_RATE,
    products: PRODUCTS.map((p) => ({ slug: p.slug, title: t(p.title), price: p.price, pages: p.pages, img: ctx.img(p.card) })),
    urls: { shop: ctx.href('shop/'), basket: ctx.href('shop/basket/'), checkout: ctx.href('shop/checkout/') },
    t: { add: t(S.add), inBasket: t(S.inBasket), pages: t(S.pages), empty: t(S.basketPage.empty), emptyCta: t(S.basketPage.emptyCta), remove: t(S.basketPage.remove), subtotal: t(S.basketPage.subtotal), vat: t(S.basketPage.vat), total: t(S.basketPage.total), continue: t(S.basketPage.continue), checkout: t(S.basketPage.checkout),
      err: { name: t(S.checkout.err.name), email: t(S.checkout.err.email), licence: t(S.checkout.err.licence), privacy: t(S.checkout.err.privacy), server: t(S.checkout.err.server) }, noServer: t(S.checkout.noServer), paying: t(S.checkout.paying),
      ref: t(S.order.ref), download: t(S.order.download), preparing: t(S.order.preparing), left: t(S.order.left), none: t(S.order.none), expired: t(S.order.expired), tips: t(S.order.tips), invoice: t(S.order.invoice), notFound: t(S.order.notFound), vatIncl: t(L('incl. 15% VAT', 'شاملة ضريبة القيمة المضافة ١٥٪')) }
  };
};
const shopScript = (ctx) => `<script type="application/json" id="shop-data">${JSON.stringify(shopData(ctx))}</script>`;
const basketLink = (ctx) => `<a class="basket-link" href="${ctx.href('shop/basket/')}" aria-label="${esc(ctx.t(SHOP.basket))}">${icon('bag')}<span class="basket-link__n" data-basket-count hidden>0</span></a>`;

const productCard = (ctx, p) => `
<article class="pcard">
  <a class="pcard__img" href="${ctx.href(`shop/${p.slug}/`)}" tabindex="-1" aria-hidden="true"><img src="${ctx.img(p.card)}" alt="" loading="lazy"><span class="pcard__badge">${T(ctx, SHOP.pdf)} · ${p.pages} ${T(ctx, SHOP.pages)}</span></a>
  <div class="pcard__b"><h3 class="h4"><a href="${ctx.href(`shop/${p.slug}/`)}">${T(ctx, p.title)}</a></h3><p>${T(ctx, p.tagline)}</p>
    <div class="pcard__f"><b>${sar(ctx, p.price)}</b><button class="btn btn--outline-dark btn--sm" type="button" data-add="${p.slug}" aria-pressed="false"><span>${T(ctx, SHOP.add)}</span></button></div>
    <a class="more" href="${ctx.href(`shop/${p.slug}/`)}"><span>${T(ctx, SHOP.view)}</span>${arrow}</a></div>
</article>`;

export function shopIndex(ctx) {
  const S = SHOP;
  const why = S.why.items.map((w) => `<li><span>${icon(w.icon)}</span><h3 class="h4">${T(ctx, w.t)}</h3><p>${T(ctx, w.d)}</p></li>`).join('');
  const body = `
${hero(ctx, { eyebrow: S.hero.eyebrow, title: S.hero.title, lead: S.hero.lead, img: S.hero.img, ctas: [`<a class="btn btn--gold" href="#briefs"><span>${T(ctx, L('Browse the briefs', 'تصفح الموجزات'))}</span>${icon('arrowdown', 'btn-ic')}</a>`] })}
<section class="sec sec--ivory"><div class="container container--wide"><p class="eyebrow eyebrow--rule">${T(ctx, S.why.eyebrow)}</p><h2 class="h2">${T(ctx, S.why.title)}</h2><ul class="why why--3">${why}</ul></div></section>
<section class="sec sec--deep" id="briefs"><div class="container container--wide"><div class="sec-head sec-head--split"><div><h2 class="h2">${T(ctx, L('Eight sector briefs', 'ثمانية موجزات قطاعية'))}</h2></div><p class="sec-head__body">${T(ctx, S.vatNote)}</p></div>
<div class="pcards">${PRODUCTS.map((p) => productCard(ctx, p)).join('')}</div></div></section>
<section class="sec sec--ivory sec--tight"><div class="container container--wide split"><div><p class="eyebrow eyebrow--rule">${T(ctx, L('Not sure which one?', 'لست متأكدًا أيها تحتاج؟'))}</p><h2 class="h2 h2--md">${T(ctx, L('Start with the scorecard', 'ابدأ بالمقياس'))}</h2><p class="lead">${T(ctx, L('Ten minutes, and your report will point you to the brief that fits your sector.', 'عشر دقائق، وسيوجهك تقريرك إلى الموجز المناسب لقطاعك.'))}</p>${btn(ctx, SC_PAGE.start, 'readiness-scorecard/', 'gold')}</div><div class="shop-note">${icon('shield')}<p>${T(ctx, S.detail.notAdvice)}</p></div></div></section>
${shopScript(ctx)}`;
  return shell(ctx, { title: S.meta.title, description: S.meta.description, active: 'shop', body, scripts: ['shop.js'] });
}

export function shopProduct(ctx, p) {
  const S = SHOP, D = S.detail, b = BRIEFS[p.sector], ind = INDUSTRIES.find((i) => i.slug === p.sector);
  const inside = [
    ['doc', `How the sector works, in plain words`], ['chart', `Five forces driving demand`], ['route', `Ways in: ${b.routes.map((r) => r[0].toLowerCase()).slice(0, 3).join(', ')}`], ['scale', `${b.rules.length} rules and approvals to check early`], ['handshake', `Who you will meet: ${b.partners.map((x) => x[0].toLowerCase()).slice(0, 3).join(', ')}`], ['warning', `${b.pitfalls.length} common mistakes, and how to avoid them`], ['calendar', 'A 90-day plan, in three phases'], ['clipboard', `${b.questions.length} questions to ask before you commit`]
  ];
  const insideAr = ['كيف يعمل القطاع بكلمات بسيطة', 'خمسة عوامل تحرك الطلب', 'طرق الدخول وأنواعها', `${b.rules.length} أنظمة وموافقات تتحقق منها مبكرًا`, 'الشركاء الذين ستقابلهم', `${b.pitfalls.length} أخطاء شائعة وكيف تتجنبها`, 'خطة لـ٩٠ يومًا على ثلاث مراحل', `${b.questions.length} أسئلة تطرحها قبل أن تلتزم`];
  const list = inside.map((x, i) => `<li><span>${icon(x[0])}</span>${esc(ctx.lang === 'ar' ? insideAr[i] : x[1])}</li>`).join('');
  const tocAr = ['القطاع بكلمات بسيطة', 'ما الذي يحرك الطلب', 'كيف يتنظم السوق', 'طرق الدخول', 'أنظمة تتحقق منها مبكرًا', 'الشركاء: من ستقابل', 'أين يخطئ الناس', 'أول ٩٠ يومًا لك', 'أسئلة تطرحها قبل الالتزام'];
  const toc = BRIEF_CHAPTERS.map((c, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${esc(ctx.lang === 'ar' ? tocAr[i] : c)}</li>`).join('');
  const forWho = ctx.lang === 'ar'
    ? ['فرق القيادة والتطوير التجاري التي تدرس دخول السوق السعودي', 'المستثمرون الذين يريدون فهم القطاع قبل أن يقابلوا الشركاء', 'من دخل السوق حديثًا ويريد التأكد من أنه لم يفته شيء']
    : ['Leadership and business-development teams weighing a Saudi entry', 'Investors who want to understand a sector before they meet partners', 'Teams that have just entered and want to check they have not missed something'];
  const related = PRODUCTS.filter((x) => x.slug !== p.slug).slice(0, 3).map((x) => productCard(ctx, x)).join('');
  const sample = ctx.lang === 'ar' ? b.ar : b.intro[0];
  const body = `
${hero(ctx, { crumbs: crumbs(ctx, { label: SHOP.hero.eyebrow, href: ctx.href('shop/') }, { label: p.title }), eyebrow: SHOP.hero.eyebrow, title: p.title, lead: p.tagline, img: ind.hero })}
<section class="sec sec--ivory"><div class="container container--wide pdp">
  <div class="pdp__main">
    <p class="lead lead--flush">${T(ctx, p.desc)}</p>
    <h2 class="h3 h3--lg">${T(ctx, D.inside)}</h2><ul class="inside">${list}</ul>
    <h2 class="h3 h3--lg">${T(ctx, D.forWho)}</h2><ul class="ic-list ic-list--wf">${forWho.map((x, i) => `<li><span class="ic-list__i">${icon(['target', 'coins', 'check'][i])}</span><span>${esc(x)}</span></li>`).join('')}</ul>
    <h2 class="h3 h3--lg">${T(ctx, D.toc)}</h2><ol class="toc-list">${toc}</ol>
    <h2 class="h3 h3--lg">${T(ctx, D.sample)}</h2><blockquote class="sample"${ctx.lang === 'ar' ? '' : ' lang="en" dir="ltr"'}><p>${esc(sample)}</p></blockquote>
  </div>
  <aside class="pdp__buy" aria-label="${esc(ctx.t(D.details))}"><div class="buybox">
    <p class="buybox__price"><b>${sar(ctx, p.price)}</b><small>${T(ctx, L('+ 15% VAT', '+ ضريبة القيمة المضافة ١٥٪'))}</small></p>
    <a class="btn btn--gold" href="${ctx.href('shop/checkout/')}" data-buy="${p.slug}"><span>${T(ctx, S.buyNow)}</span>${arrow}</a>
    <button class="btn btn--outline-dark" type="button" data-add="${p.slug}" aria-pressed="false"><span>${T(ctx, S.add)}</span></button>
    <dl class="buybox__dl"><div><dt>${T(ctx, D.format)}</dt><dd>PDF · ${p.pages} ${T(ctx, S.pages)}</dd></div><div><dt>${T(ctx, D.language)}</dt><dd>${T(ctx, D.lang)}</dd></div><div><dt>${T(ctx, D.edition)}</dt><dd>${T(ctx, D.updated)}</dd></div><div><dt>${T(ctx, L('Licence', 'الترخيص'))}</dt><dd>${T(ctx, D.licence)}</dd></div><div><dt>${T(ctx, L('Delivery', 'التسليم'))}</dt><dd>${T(ctx, D.delivery)}</dd></div></dl>
    <p class="buybox__secure">${icon('lock')}<span>${T(ctx, D.secure)}</span></p>
  </div></aside>
</div></section>
<section class="sec sec--deep"><div class="container container--wide"><div class="sec-head sec-head--split"><div><h2 class="h2 h2--md">${T(ctx, D.related)}</h2></div><a class="more more--gold" href="${ctx.href('shop/')}"><span>${T(ctx, D.back)}</span>${arrow}</a></div><div class="pcards pcards--3">${related}</div><p class="shop-disc">${T(ctx, D.notAdvice)}</p></div></section>
${shopScript(ctx)}`;
  return shell(ctx, { title: L(`${p.title.en} | Growth Blueprint`, `${p.title.ar} | غروث بلوبرينت`), description: p.tagline, active: 'shop', body, scripts: ['shop.js'] });
}

export function shopBasket(ctx) {
  const B = SHOP.basketPage;
  const body = `<section class="sec sec--ivory shop-page"><div class="container container--md"><h1 class="h2">${T(ctx, B.title)}</h1><div id="basket" aria-live="polite"></div></div></section>${shopScript(ctx)}`;
  return shell(ctx, { title: L(`${B.title.en} | Growth Blueprint`, `${B.title.ar} | غروث بلوبرينت`), description: SHOP.meta.description, active: 'shop', body, scripts: ['shop.js'], extraHead: '<meta name="robots" content="noindex">' });
}

export function shopCheckout(ctx) {
  const C = SHOP.checkout, f = C.f;
  const body = `
<section class="sec sec--ivory shop-page"><div class="container container--wide co">
  <div class="co__form"><p class="eyebrow eyebrow--rule">${T(ctx, C.eyebrow)}</p><h1 class="h2">${T(ctx, C.title)}</h1><p class="lead">${T(ctx, C.lead)}</p>
  <form id="checkout" class="form enq__card" novalidate>
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="fgrid">
      <div class="field"><label for="co-name">${T(ctx, f.name)}</label><input id="co-name" name="name" type="text" autocomplete="name" required><small class="err" hidden></small></div>
      <div class="field"><label for="co-email">${T(ctx, f.email)}</label><input id="co-email" name="email" type="email" autocomplete="email" dir="ltr" required><small class="hint">${T(ctx, f.emailHint)}</small><small class="err" hidden></small></div>
      <div class="field"><label for="co-company">${T(ctx, f.company)}</label><input id="co-company" name="company" type="text" autocomplete="organization"></div>
      <div class="field"><label for="co-vat">${T(ctx, f.vat)}</label><input id="co-vat" name="vatno" type="text" dir="ltr" inputmode="numeric"></div>
    </div>
    <div class="field"><label for="co-country">${T(ctx, f.country)}</label><input id="co-country" name="country" type="text" autocomplete="country-name" value="${ctx.lang === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}"></div>
    <div class="licbox"><h2 class="h4">${T(ctx, C.licenceTitle)}</h2><p>${T(ctx, C.licenceBody)}</p></div>
    <div class="field"><label class="check"><input type="checkbox" name="licence"><span class="check__b" aria-hidden="true">${icon('check')}</span><span>${T(ctx, C.consent.licence)}</span></label><small class="err" hidden></small></div>
    <div class="field"><label class="check"><input type="checkbox" name="privacy"><span class="check__b" aria-hidden="true">${icon('check')}</span><span>${T(ctx, C.consent.privacy)} <a href="${ctx.href('privacy/')}">${T(ctx, CONSENT.privacy)}</a></span></label><small class="err" hidden></small></div>
    <label class="check"><input type="checkbox" name="marketing"><span class="check__b" aria-hidden="true">${icon('check')}</span><span>${T(ctx, C.consent.marketing)}</span></label>
    <p class="err" role="alert" hidden data-co-err></p>
    <button class="btn btn--gold btn--block" type="submit"><span>${T(ctx, C.pay)} · <span data-pay-amount></span></span>${icon('lock', 'btn-ic')}</button>
    <p class="co__demo">${T(ctx, C.demo)}</p>
  </form></div>
  <aside class="co__sum"><div class="buybox"><h2 class="h4">${T(ctx, C.summary)}</h2><div id="co-summary"></div></div></aside>
</div></section>${shopScript(ctx)}`;
  return shell(ctx, { title: L(`${C.eyebrow.en} | Growth Blueprint`, `${C.eyebrow.ar} | غروث بلوبرينت`), description: SHOP.meta.description, active: 'shop', body, scripts: ['shop.js'], extraHead: '<meta name="robots" content="noindex">' });
}

export function shopOrder(ctx) {
  const O = SHOP.order;
  const body = `
${hero(ctx, { eyebrow: O.eyebrow, title: O.title, lead: O.lead, img: 'hero-man-light' })}
<section class="sec sec--ivory shop-page"><div class="container container--md"><div id="order" aria-live="polite"><p class="shop-empty">${T(ctx, SHOP.order.preparing)}</p></div>
<div class="licbox licbox--next"><p class="eyebrow">${T(ctx, O.next)}</p><p>${T(ctx, O.nextBody)}</p>${btn(ctx, O.nextCta, 'readiness-scorecard/', 'gold', 'btn--sm')}</div></div></section>${shopScript(ctx)}`;
  return shell(ctx, { title: L(`${O.eyebrow.en} | Growth Blueprint`, `${O.eyebrow.ar} | غروث بلوبرينت`), description: O.lead, active: 'shop', body, scripts: ['shop.js'], extraHead: '<meta name="robots" content="noindex"><meta name="referrer" content="no-referrer">' });
}

/* ---------- newsletter confirmation pages ---------- */
export function newsletterPage(ctx, kind) {
  const N = NEWS[kind];
  const body = `<section class="legal-hero"><div class="container container--md"><span class="thanks__ic">${icon(kind === 'confirmed' ? 'check' : 'mail')}</span><h1 class="hero__title">${T(ctx, N.title)}</h1><span class="rule" aria-hidden="true"></span><p class="hero__lead">${T(ctx, N.body)}</p><div class="hero__ctas">${btn(ctx, UI.home, '', 'gold')}${btn(ctx, UI.viewAllInsights, 'insights/', 'outline')}</div></div></section>`;
  return shell(ctx, { title: N.title, description: N.body, active: null, body, extraHead: '<meta name="robots" content="noindex">' });
}

/* ---------- legal: privacy (PDPL), terms, cookies ---------- */
export function privacy(ctx) {
  const P = PRIVACY, tb = P.sections.find((s) => s.table);
  const secs = P.sections.map((s) => `<h2 class="h3" id="p${P.sections.indexOf(s) + 1}">${T(ctx, s.h)}</h2>${(s.p || []).map((x) => `<p>${T(ctx, x)}</p>`).join('')}${s.table ? `<div class="tbl" role="region" tabindex="0" aria-label="${esc(ctx.t(s.h))}"><table><thead><tr>${P.tableHead.map((h) => `<th>${T(ctx, h)}</th>`).join('')}</tr></thead><tbody>${s.table.map((r) => `<tr>${r.map((c, i) => `<${i === 0 ? 'th scope="row"' : 'td'}>${T(ctx, c)}</${i === 0 ? 'th' : 'td'}>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}`).join('');
  const F = P.form;
  const body = `
<section class="legal-hero"><div class="container container--md"><p class="eyebrow">${T(ctx, P.hero.eyebrow)}</p><h1 class="hero__title">${T(ctx, P.hero.title)}</h1><span class="rule" aria-hidden="true"></span><p class="hero__lead">${T(ctx, P.hero.lead)}</p></div></section>
<section class="sec sec--ivory"><div class="container container--md legal">
  <p class="draft-note">${icon('warning')}<span>${T(ctx, P.draft)}</span></p>
  <div class="box box--sum"><h2 class="h4">${T(ctx, P.summary.title)}</h2><ul class="tick-list">${P.summary.items.map((i) => `<li>${icon('check')}<span>${T(ctx, i)}</span></li>`).join('')}</ul></div>
  ${secs}
  <p class="legal__upd">${T(ctx, P.versionLine)}</p>
  <h2 class="h3" id="rights">${T(ctx, F.title)}</h2><p>${T(ctx, F.lead)}</p>
  <form class="form enq__card" data-privacy-form novalidate data-ok="${esc(ctx.t(F.ok))}" data-demo="${esc(ctx.t(F.demo))}" data-err-email="${esc(ctx.t(F.errEmail))}" data-err-server="${esc(ctx.t(F.errServer))}">
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="field"><label for="pr-email">${T(ctx, F.email)}</label><input id="pr-email" name="email" type="email" dir="ltr" autocomplete="email" required></div>
    <div class="field"><label for="pr-type">${T(ctx, F.type)}</label><select id="pr-type" name="type">${F.types.map(([v, l]) => `<option value="${v}">${T(ctx, l)}</option>`).join('')}</select></div>
    <div class="field"><label for="pr-d">${T(ctx, F.details)}</label><textarea id="pr-d" name="details" rows="4"></textarea></div>
    <p class="err" role="alert" hidden data-pr-err></p><p class="nl__ok" role="status" hidden data-pr-msg></p>
    <button class="btn btn--gold" type="submit"><span>${T(ctx, F.submit)}</span>${arrow}</button>
  </form>
  <p class="legal__contact">faisal@getgrowthblueprint.com · ${T(ctx, SITE.address)}</p>
</div></section>`;
  return shell(ctx, { title: P.meta.title, description: P.meta.description, active: null, body });
}

export function terms(ctx) {
  const D = TERMS;
  const body = `<section class="legal-hero"><div class="container container--md"><p class="eyebrow">${T(ctx, UI.terms)}</p><h1 class="hero__title">${T(ctx, D.title)}</h1><span class="rule" aria-hidden="true"></span><p class="hero__lead">${T(ctx, D.lead)}</p></div></section>
<section class="sec sec--ivory"><div class="container container--md legal"><p class="draft-note">${icon('warning')}<span>${T(ctx, D.updated)}</span></p>${D.sections.map(([h, p]) => `<h2 class="h3">${T(ctx, h)}</h2><p>${T(ctx, p)}</p>`).join('')}<h2 class="h3">${T(ctx, L('Contact', 'التواصل'))}</h2><p><a href="mailto:${SITE.email}">${SITE.email}</a> · ${T(ctx, SITE.address)}</p></div></section>`;
  return shell(ctx, { title: D.meta.title, description: D.meta.description, active: null, body });
}

export function cookies(ctx) {
  const D = COOKIES;
  const body = `<section class="legal-hero"><div class="container container--md"><p class="eyebrow">${T(ctx, UI.cookies)}</p><h1 class="hero__title">${T(ctx, D.title)}</h1><span class="rule" aria-hidden="true"></span><p class="hero__lead">${T(ctx, D.lead)}</p></div></section>
<section class="sec sec--ivory"><div class="container container--md legal"><div class="tbl" role="region" tabindex="0" aria-label="${esc(ctx.t(D.title))}"><table><thead><tr>${D.head.map((h) => `<th>${T(ctx, h)}</th>`).join('')}</tr></thead><tbody>${D.table.map((r) => `<tr>${r.map((c, i) => `<td>${typeof c === 'string' ? (i === 1 ? `<code>${esc(c)}</code>` : esc(c)) : T(ctx, c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>${T(ctx, D.closing)}</p><p class="legal__upd">${T(ctx, D.updated)}</p></div></section>`;
  return shell(ctx, { title: D.meta.title, description: D.meta.description, active: null, body });
}

export { basketLink, newsletter };
