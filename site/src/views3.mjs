// Advisory sessions: booking page and confirmation page.
import { L, UI } from './ui.mjs';
import { icon } from './icons.mjs';
import { tsWidget, esc, shell, hero, btn, arrow } from './render.mjs';
import { SESS, SX } from './sessions.mjs';

const T = (ctx, v) => esc(ctx.t(v));
const t = (ctx, v) => ctx.t(v);
const plainObj = (ctx, o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v && typeof v === 'object' && 'en' in v ? ctx.t(v) : v]));
function data(ctx) {
  const plans = Object.fromEntries(Object.entries(SX.plans).map(([k, p]) => [k, { n: SESS.plans[k].n, price: SESS.plans[k].price, t: t(ctx, p.t), d: t(ctx, p.d), pts: p.pts.map((x) => t(ctx, x)), badge: p.badge ? t(ctx, p.badge) : '' }]));
  return { lang: ctx.lang, cur: SESS.cur, vat: SESS.vat, tz: SESS.tzName, minutes: SESS.minutes, plans, ui: plainObj(ctx, SX.ui), conf: plainObj(ctx, SX.conf), steps: SX.steps.map((x) => t(ctx, x)),
    rules: { days: SESS.days, times: SESS.times, tzOffsetMin: SESS.tzOffsetMin, leadHours: SESS.leadHours, horizonDays: SESS.horizonDays }, bundleValidDays: SESS.bundleValidDays, rescheduleHours: SESS.rescheduleHours,
    urls: { confirm: ctx.href('book-a-session/confirmation/'), book: ctx.href('book-a-session/'), privacy: ctx.href('privacy/'), terms: ctx.href('terms/'), contact: ctx.href('enquiry/') } };
}
const script = (ctx) => `<script type="application/json" id="sx-data">${JSON.stringify(data(ctx)).replace(/</g, '\\u003c')}</script>`;
const money = (ctx, n) => (ctx.lang === 'ar' ? `${new Intl.NumberFormat('ar-SA-u-nu-latn').format(n)} ${SESS.cur}` : `${SESS.cur} ${new Intl.NumberFormat('en-GB').format(n)}`);

export function bookSession(ctx) {
  const planCard = (k) => { const p = SX.plans[k], pr = SESS.plans[k]; const per = pr.price / pr.n;
    return `<label class="sx-plan"><input type="radio" name="plan" value="${k}" ${k === 'single' ? 'checked' : ''}><span class="sx-plan__in">${p.badge ? `<em class="sx-plan__badge">${T(ctx, p.badge)}</em>` : ''}<b class="sx-plan__t">${T(ctx, p.t)}</b><span class="sx-plan__price">${money(ctx, pr.price)} <small>${T(ctx, SX.ui.exVat)}</small></span>${pr.n > 1 ? `<small class="sx-plan__per">${money(ctx, Math.round(per))} ${T(ctx, SX.ui.perSession)}</small>` : ''}<span class="sx-plan__d">${T(ctx, p.d)}</span><ul>${p.pts.map((x) => `<li>${icon('check')}<span>${T(ctx, x)}</span></li>`).join('')}</ul></span></label>`; };
  const U = SX.ui, fld = (id, name, label, extra = '') => `<div class="field"><label for="${id}">${T(ctx, label)}</label><input id="${id}" name="${name}" ${extra}><small class="err" hidden></small></div>`;
  const chk = (name, text, err) => `<div class="field"><label class="check"><input type="checkbox" name="${name}"><span class="check__b" aria-hidden="true">${icon('check')}</span><span>${text}</span></label>${err ? '<small class="err" hidden></small>' : ''}</div>`;
  const body = `
${hero(ctx, { ...SX.hero, ctas: [btn(ctx, L('Free 30-minute consultation', 'استشارة مجانية مدتها 30 دقيقة'), 'book-a-meeting/', 'outline')] })}
<section class="sec sec--ivory sx-page"><div class="container container--wide sx">
  <form id="sx-form" class="sx__main" novalidate>
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">${tsWidget()}
    <ol class="sx-steps" aria-label="${esc(ctx.t(L('Booking steps', 'خطوات الحجز')))}">${SX.steps.map((s, i) => `<li><span>${i + 1}</span>${T(ctx, s)}</li>`).join('')}</ol>
    <fieldset class="sx-block"><legend class="h3">${T(ctx, L('1. Choose', '1. اختر'))}</legend><div class="sx-plans">${planCard('single')}${planCard('bundle')}</div></fieldset>
    <fieldset class="sx-block"><legend class="h3">${T(ctx, L('2. Pick a time', '2. حدّد الموعد'))}</legend>
      <p class="sx-note">${T(ctx, U.tzNote)}</p>
      <div id="sx-days" class="sx-days" role="group" aria-label="${esc(ctx.t(U.pickDay))}"><p class="sx-load">${T(ctx, U.loading)}</p></div>
      <div id="sx-times" class="sx-times" role="group" aria-label="${esc(ctx.t(U.pickTime))}" aria-live="polite"></div>
      <small class="err" data-err="slot" hidden></small>
    </fieldset>
    <fieldset class="sx-block"><legend class="h3">${T(ctx, L('3. Your details', '3. بياناتك'))}</legend>
      <div class="fgrid">${fld('sx-name', 'name', U.name, 'type="text" autocomplete="name" required')}${fld('sx-email', 'email', U.email, 'type="email" autocomplete="email" dir="ltr" required')}${fld('sx-company', 'company', U.company, 'type="text" autocomplete="organization"')}${fld('sx-phone', 'phone', U.phone, 'type="tel" autocomplete="tel" dir="ltr"')}</div>
      <div class="field"><label for="sx-vat">${T(ctx, U.vatNo)}</label><input id="sx-vat" name="vatNo" type="text" dir="ltr" inputmode="numeric"></div>
      <div class="field"><span class="lbl" id="sx-mode-l">${T(ctx, U.mode)}</span><div class="sx-mode" role="radiogroup" aria-labelledby="sx-mode-l"><label><input type="radio" name="mode" value="online" checked><span>${T(ctx, U.online)}</span></label><label><input type="radio" name="mode" value="person"><span>${T(ctx, U.person)}</span></label></div></div>
      <div class="field"><label for="sx-topic">${T(ctx, U.topic)}</label><textarea id="sx-topic" name="topic" rows="4"></textarea><small class="hint">${T(ctx, U.topicHint)}</small><small class="err" hidden></small></div>
      ${chk('terms', `${T(ctx, U.terms)} <a href="${ctx.href('terms/')}">${T(ctx, L('Terms', 'الشروط'))}</a>`, true)}
      ${chk('privacy', `${T(ctx, U.privacy)} <a href="${ctx.href('privacy/')}">${T(ctx, L('Privacy Notice', 'إشعار الخصوصية'))}</a>`, true)}
      ${chk('marketing', T(ctx, U.marketing), false)}
    </fieldset>
    <p class="err" role="alert" data-err="form" hidden></p>
    <button class="btn btn--gold btn--block" type="submit" id="sx-pay"><span data-pay-label>${T(ctx, U.pay)} · <span data-pay-amount></span></span>${icon('lock', 'btn-ic')}</button>
    <p class="co__demo" data-pay-note>${T(ctx, U.payNote)}</p>
  </form>
  <aside class="sx__sum"><div class="buybox"><h2 class="h4">${T(ctx, U.summary)}</h2><div id="sx-sum" aria-live="polite"></div></div><p class="sx-free"><a href="${ctx.href('book-a-meeting/')}">${T(ctx, SX.free)} ${arrow}</a></p></aside>
</div></section>${script(ctx)}`;
  return shell(ctx, { title: SX.meta.title, description: SX.meta.description, active: null, body, scripts: ['sessions.js'] });
}

export function sessionConfirmation(ctx) {
  const C = SX.conf;
  const body = `
${hero(ctx, { eyebrow: SX.hero.eyebrow, title: C.title, lead: C.lead, img: 'hero-man-skyline', crumbs: [{ label: UI.breadcrumbHome, href: ctx.href('') }, { label: SX.hero.title, href: ctx.href('book-a-session/') }, { label: C.title }] })}
<section class="sec sec--ivory sx-page"><div class="container container--md"><div id="sx-conf" aria-live="polite"><noscript><p>${T(ctx, L('This page needs JavaScript to show your booking.', 'تحتاج هذه الصفحة إلى جافاسكربت لعرض حجزك.'))}</p></noscript></div></div></section>${script(ctx)}`;
  return shell(ctx, { title: L(`${SX.conf.title.en} | Growth Blueprint`, `${SX.conf.title.ar} | غروث بلوبرينت`), description: SX.meta.description, active: null, body, scripts: ['sessions.js'], extraHead: '<meta name="robots" content="noindex">' });
}
