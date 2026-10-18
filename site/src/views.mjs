import { icon } from './icons.mjs';
import { L, UI, SITE, NAV } from './ui.mjs';
import { SERVICES, STAGES, serviceBySlug, RESPONSIBILITIES } from './services.mjs';
import { INDUSTRIES, industryBySlug } from './industries.mjs';
import * as P from './pages.mjs';
import { CONSENT } from './legal.mjs';
import { newsletter, heroWow, imgAr, esc, shell, hero, ctaBand, btn, arrow, eyebrow, sectionHead, serviceCard, faq } from './render.mjs';

const T = (ctx, v) => esc(ctx.t(v));
const crumbs = (ctx, ...items) => [{ label: UI.breadcrumbHome, href: ctx.href('') }, ...items];

/* ===================== HOME ===================== */
export function home(ctx) {
  const H = P.HOME;
  const paths = H.paths.map((p) => `
    <div class="path">
      <span class="path__icon">${icon(p.icon)}</span>
      <div><h2 class="h3">${T(ctx, p.title)}</h2><p>${T(ctx, p.body)}</p>
      <a class="more more--caps" href="${ctx.href(p.href)}"><span>${T(ctx, p.cta)}</span>${arrow}</a></div>
    </div>`).join('');
  const svc = SERVICES.map((s) => `
    <a class="tile" href="${ctx.href(`services/${s.slug}/`)}"><span class="tile__icon">${icon(s.icon)}</span><h3>${T(ctx, s.title)}</h3><p>${T(ctx, s.short)}</p></a>`).join('');
  const ind = H.industries.ids.map((id) => {
    const i = industryBySlug(id);
    return `<li class="photo-tile"><a href="${ctx.href(`industries/${i.slug}/`)}"><img src="${ctx.img(i.card)}" alt="" loading="lazy"><span class="photo-tile__shade"></span><span class="photo-tile__t"><b>${T(ctx, i.short)}</b>${arrow}</span></a></li>`;
  }).join('');
  const steps = P.APPROACH.stages.map((s) => `<li class="step"><span class="step__icon">${icon(s.icon)}</span><h3>${T(ctx, s.t)}</h3><p>${T(ctx, s.d)}</p></li>`).join('');
  const ins = H.insights.slugs.map((sl) => {
    const a = P.articleBySlug(sl);
    return `<article class="post"><a class="post__img" href="${ctx.href(`insights/${a.slug}/`)}" tabindex="-1" aria-hidden="true"><img src="${ctx.img(a.thumb)}" alt="" loading="lazy"></a><h3 class="h4"><a href="${ctx.href(`insights/${a.slug}/`)}">${T(ctx, a.title)}</a></h3><p>${T(ctx, a.excerpt).slice(0, 118)}…</p><a class="more more--gold" href="${ctx.href(`insights/${a.slug}/`)}"><span>${T(ctx, UI.readMore)}</span>${arrow}</a></article>`;
  }).join('');
  const body = `
${heroWow(ctx, { eyebrow: H.hero.eyebrow, title: H.hero.title, lead: H.hero.lead, img: 'hero-home', card: H.hero.card,
  ctas: [btn(ctx, UI.book, 'book-a-meeting/', 'gold'), btn(ctx, UI.exploreServices, 'services/', 'outline')] })}
<section class="paths"><div class="container container--wide paths__in">${paths}</div></section>
<section class="sec sec--ivory" aria-labelledby="svc-t"><div class="container container--wide">
  ${sectionHead(ctx, { eyebrow: H.services.eyebrow, title: H.services.title, body: H.services.intro, id: 'svc-t', side: true })}
  <div class="tiles">${svc}</div>
</div></section>
<section class="sec sec--navy sec--flush" aria-labelledby="ind-t"><div class="container container--wide">
  ${sectionHead(ctx, { eyebrow: H.industries.eyebrow, title: H.industries.title, body: H.industries.intro, id: 'ind-t', side: true })}</div>
  <ul class="photo-tiles">${ind}</ul>
</section>
<section class="sec sec--ivory" aria-labelledby="app-t"><div class="container container--wide">
  ${sectionHead(ctx, { eyebrow: H.approach.eyebrow, title: H.approach.title, body: H.approach.intro, id: 'app-t', side: true })}
  <ol class="steps">${steps}</ol>
</div></section>
<section class="founder" aria-labelledby="fo-t">
  <div class="founder__img"><img src="${ctx.img('p-founder')}" alt="${esc(ctx.t(L('A Saudi business leader looking over the city skyline', 'قائد أعمال سعودي يتأمل أفق المدينة')))}" loading="lazy"></div>
  <div class="founder__copy"><p class="eyebrow">${T(ctx, H.founder.eyebrow)}</p><h2 class="h2" id="fo-t">${T(ctx, H.founder.title)}</h2><p>${T(ctx, H.founder.body)}</p>
    <a class="btn btn--outline-dark" href="${ctx.href('about/')}"><span>${T(ctx, H.founder.cta)}</span>${arrow}</a></div>
</section>
<section class="sec sec--ivory" aria-labelledby="in-t"><div class="container container--wide">
  <div class="sec-head sec-head--split"><div>${eyebrow(ctx, H.insights.eyebrow, 'eyebrow--rule')}<h2 class="h2" id="in-t">${T(ctx, H.insights.title)}</h2></div>
  <a class="more more--gold" href="${ctx.href('insights/')}"><span>${T(ctx, UI.viewAllInsights)}</span>${arrow}</a></div>
  <div class="posts">${ins}</div>
</div></section>
<section class="resource" style="--cta-img:url('${ctx.img('p-desert')}')"><div class="resource__bg" aria-hidden="true"></div>
  <div class="container container--wide resource__in"><div><p class="eyebrow">${T(ctx, H.resource.eyebrow)}</p><h2 class="h2">${T(ctx, H.resource.title)}</h2><p>${T(ctx, H.resource.body)}</p>
  <a class="btn btn--outline" href="${ctx.href('readiness-scorecard/')}"><span>${T(ctx, H.resource.cta)}</span>${arrow}</a></div>
  <span class="resource__ic" aria-hidden="true">${icon('filechk')}</span></div></section>
<section class="talk"><div class="container container--wide talk__in"><div><p class="eyebrow">${T(ctx, H.cta.eyebrow)}</p><h2 class="h2">${T(ctx, H.cta.title)}</h2></div><p>${T(ctx, H.cta.body)}</p>${btn(ctx, UI.book, 'book-a-meeting/', 'gold')}</div></section>`;
  return shell(ctx, { title: H.meta.title, description: H.meta.description, active: 'home', body, bodyClass: 'page-home' });
}

/* ===================== SERVICES ===================== */
export function servicesOverview(ctx) {
  const S = P.SERVICES_PAGE;
  const stages = STAGES.map((st, i) => {
    const list = SERVICES.filter((s) => s.stage === st.id);
    const navy = i !== 1;
    return `
<section class="stage ${navy ? 'stage--navy' : 'stage--ivory'}" aria-label="${esc(ctx.t(st.label))}"><div class="container container--wide stage__grid">
  <div class="stage__intro"><p class="eyebrow">${T(ctx, st.label)}</p><h2 class="h2">${T(ctx, st.heading)}</h2><p>${T(ctx, st.body)}</p><span class="rule" aria-hidden="true"></span>
    <p class="eyebrow eyebrow--sm">${T(ctx, UI.ideal)}</p><p class="stage__ideal">${T(ctx, st.ideal)}</p></div>
  <div class="stage__cards">${list.map((s) => serviceCard(ctx, s)).join('')}</div>
</div></section>`;
  }).join('');
  const body = `
${hero(ctx, { ...S.hero, ctas: [btn(ctx, UI.book, 'book-a-meeting/', 'gold')], pos: 'right center' })}
<section class="sec sec--ivory"><div class="container container--wide intro-split">
  <div>${eyebrow(ctx, S.intro.eyebrow)}<h2 class="h2">${T(ctx, S.intro.title)}</h2></div><div><span class="rule" aria-hidden="true"></span><p class="lead">${T(ctx, S.intro.body)}</p></div>
</div></section>
${stages}
${ctaBand(ctx, { ...S.cta, img: 'cta-desert-cliffs' })}`;
  return shell(ctx, { title: S.meta.title, description: S.meta.description, active: 'services', body });
}

export function serviceDetail(ctx, s) {
  const Lb = P.SERVICE_LABELS;
  const ico = ['doc', 'building', 'check', 'globe', 'users', 'scale', 'shield', 'clipboard', 'chart'];
  const list = (items, kind) => `<ul class="ic-list ic-list--${kind}">${items.map((x, i) => `<li><span class="ic-list__i">${icon(ico[(i + (kind === 'ch' ? 3 : 0)) % ico.length])}</span><span>${T(ctx, x)}</span></li>`).join('')}</ul>`;
  const rel = s.related.map((r) => serviceBySlug(r)).map((r) => `
    <a class="rel" href="${ctx.href(`services/${r.slug}/`)}"><span class="rel__img"><img src="${ctx.img(r.card)}" alt="" loading="lazy"></span><span class="rel__b"><b>${T(ctx, r.title)}</b><span>${T(ctx, r.short)}</span><span class="more more--sm"><span>${T(ctx, UI.learnMore)}</span>${arrow}</span></span></a>`).join('');
  const body = `
${hero(ctx, { crumbs: crumbs(ctx, { label: L('Services', 'خدماتنا'), href: ctx.href('services/') }, { label: s.title }), title: s.title, lead: s.lead, img: s.hero, pos: s.heroPos, ctas: [btn(ctx, UI.book, 'book-a-meeting/', 'gold')] })}
<section class="sec sec--ivory"><div class="container container--wide split split--img-end">
  <div>${eyebrow(ctx, s.overview.eyebrow, 'eyebrow--rule')}<h2 class="h2">${T(ctx, s.overview.heading)}</h2><p class="lead">${T(ctx, s.overview.body)}</p></div>
  <figure class="figure"><img src="${ctx.img(s.overview.img)}" alt="" loading="lazy"></figure>
</div></section>
<section class="sec sec--ivory sec--tight sec--line"><div class="container container--wide two-col">
  <div><p class="eyebrow eyebrow--rule">${T(ctx, Lb.whoFor)}</p><h2 class="h3 h3--lg">${T(ctx, Lb.whoForTitle)}</h2>${list(s.whoFor, 'wf')}</div>
  <div class="two-col__r"><p class="eyebrow eyebrow--rule">${T(ctx, Lb.challenges)}</p><h2 class="h3 h3--lg">${T(ctx, Lb.challengesTitle)}</h2>${list(s.challenges, 'ch')}</div>
</div></section>
<section class="sec sec--navy"><div class="container container--wide">
  <div class="sec-head sec-head--split"><div><p class="eyebrow eyebrow--rule">${T(ctx, Lb.scope)}</p><h2 class="h2">${T(ctx, Lb.scopeTitle)}</h2></div><p class="sec-head__body">${T(ctx, s.scopeLead)}</p></div>
  <ul class="scope">${s.scope.map((x, i) => `<li><span class="scope__i">${icon(ico[i % ico.length])}</span><span>${T(ctx, x)}</span></li>`).join('')}</ul>
</div></section>
<section class="sec sec--ivory"><div class="container container--wide">
  <p class="eyebrow eyebrow--rule">${T(ctx, Lb.deliverables)}</p><h2 class="h2 h2--md">${T(ctx, Lb.deliverablesTitle)}</h2>
  <ul class="deliv">${s.deliverables.map((x, i) => `<li><span>${icon(['doc', 'filechk', 'clipboard', 'doc', 'shield'][i % 5])}</span><p>${T(ctx, x)}</p></li>`).join('')}</ul>
</div></section>
<section class="sec sec--deep"><div class="container container--wide">
  <p class="eyebrow eyebrow--rule">${T(ctx, Lb.process)}</p><h2 class="h2 h2--md">${T(ctx, Lb.processTitle)}</h2>
  <ol class="proc">${s.process.map((p, i) => `<li><span class="proc__n">${i + 1}</span><h3 class="h4">${T(ctx, p.t)}</h3><p>${T(ctx, p.d)}</p></li>`).join('')}</ol>
</div></section>
<section class="sec sec--ivory sec--tight"><div class="container container--wide">
  <p class="eyebrow eyebrow--rule">${T(ctx, Lb.resp)}</p><h2 class="h2 h2--md">${T(ctx, Lb.respTitle)}</h2>
  <ul class="resp">${RESPONSIBILITIES.map((r) => `<li><span>${icon(r.icon)}</span><p>${T(ctx, r.t)}</p></li>`).join('')}</ul>
</div></section>
<section class="sec sec--ivory sec--line"><div class="container container--wide faq-wrap">
  <div><p class="eyebrow eyebrow--rule">${T(ctx, Lb.faqs)}</p><h2 class="h2 h2--md">${T(ctx, Lb.faqsTitle)}</h2></div>
  ${faq(ctx, s.faqs)}
</div></section>
<section class="sec sec--deep"><div class="container container--wide">
  <div class="sec-head sec-head--split"><div><p class="eyebrow eyebrow--rule">${T(ctx, Lb.related)}</p><h2 class="h2 h2--md">${T(ctx, Lb.relatedTitle)}</h2></div><a class="more more--gold" href="${ctx.href('services/')}"><span>${T(ctx, UI.viewAllServices)}</span>${arrow}</a></div>
  <div class="rels">${rel}</div>
</div></section>
${ctaBand(ctx, { title: Lb.ctaTitle, body: Lb.ctaBody, img: 'band-man-desert' })}`;
  return shell(ctx, { title: L(`${s.title.en} | Growth Blueprint Advisory`, `${s.title.ar} | غروث بلوبرنت للاستشارات`), description: s.lead, active: 'services', body });
}

/* ===================== INDUSTRIES ===================== */
export function industriesOverview(ctx) {
  const I = P.INDUSTRIES_PAGE;
  const card = (i, big) => `
  <a class="icard ${big ? 'icard--big' : ''}" href="${ctx.href(`industries/${i.slug}/`)}"><span class="icard__img"><img src="${ctx.img(i.card)}" alt="" loading="lazy"></span><span class="icard__b"><span class="icard__ic">${icon(i.icon)}</span><b>${T(ctx, i.title)}</b>${arrow}</span></a>`;
  const core = INDUSTRIES.filter((i) => i.group === 'core').map((i) => card(i, true)).join('');
  const tgt = INDUSTRIES.filter((i) => i.group === 'target').map((i) => card(i, false)).join('');
  const body = `
${hero(ctx, { ...I.hero, ctas: [btn(ctx, UI.book, 'book-a-meeting/', 'gold')] })}
<section class="sec sec--ivory"><div class="container container--wide">
  <p class="eyebrow eyebrow--rule">${T(ctx, I.core.eyebrow)}</p><h2 class="h2">${T(ctx, I.core.title)}</h2><p class="lead lead--narrow">${T(ctx, I.core.body)}</p>
  <div class="icards icards--4">${core}</div>
</div></section>
<section class="sec sec--deep"><div class="container container--wide">
  <p class="eyebrow eyebrow--rule">${T(ctx, I.target.eyebrow)}</p><h2 class="h2">${T(ctx, I.target.title)}</h2><p class="lead lead--narrow">${T(ctx, I.target.body)}</p>
  <div class="icards icards--7">${tgt}</div>
</div></section>
${ctaBand(ctx, { ...I.cta, img: 'cta-desert-cliffs' })}`;
  return shell(ctx, { title: I.meta.title, description: I.meta.description, active: 'industries', body });
}

export function industryDetail(ctx, i) {
  const Lb = P.INDUSTRY_LABELS;
  const ch = i.challenges.map(([t, d, ic]) => `<li><span class="ch__i">${icon(ic)}</span><h3 class="h4">${T(ctx, t)}</h3><p>${T(ctx, d)}</p></li>`).join('');
  const svc = i.services.map((sl) => serviceBySlug(sl)).map((s) => `<li><a href="${ctx.href(`services/${s.slug}/`)}"><span>${icon(s.icon)}</span><b>${T(ctx, s.title)}</b>${arrow}</a></li>`).join('');
  const others = INDUSTRIES.filter((x) => x.slug !== i.slug).slice(0, 4).map((x) => `<a class="chip" href="${ctx.href(`industries/${x.slug}/`)}">${T(ctx, x.short)}</a>`).join('');
  const body = `
${hero(ctx, { crumbs: crumbs(ctx, { label: L('Industries', 'القطاعات'), href: ctx.href('industries/') }, { label: i.title }), eyebrow: Lb.eyebrow, title: i.title, lead: i.tagline, img: i.hero, ctas: [btn(ctx, Lb.enquire, 'enquiry/', 'gold')] })}
<section class="sec sec--ivory"><div class="container container--wide split split--img-end">
  <div>${eyebrow(ctx, Lb.overview, 'eyebrow--rule')}<h2 class="h2">${T(ctx, i.overviewTitle)}</h2><p class="lead">${T(ctx, i.overview)}</p></div>
  <figure class="figure"><img src="${ctx.img(i.over)}" alt="" loading="lazy"></figure>
</div></section>
<section class="sec sec--deep"><div class="container container--wide">
  ${eyebrow(ctx, Lb.challenges, 'eyebrow--rule')}<h2 class="h2 h2--md">${T(ctx, i.challengesTitle)}</h2>
  <ul class="ch">${ch}</ul>
</div></section>
<section class="sec sec--navy"><div class="container container--wide split">
  <div>${eyebrow(ctx, Lb.servicesEyebrow, 'eyebrow--rule')}<h2 class="h2">${T(ctx, Lb.servicesTitle)}</h2><p class="lead">${T(ctx, Lb.servicesBody)}</p></div>
  <ul class="svc-links">${svc}</ul>
</div></section>
<section class="sec sec--ivory sec--tight"><div class="container container--wide chips"><p class="eyebrow">${T(ctx, Lb.otherSectors)}</p><div>${others}<a class="chip chip--all" href="${ctx.href('industries/')}">${T(ctx, UI.viewAllIndustries)}</a></div></div></section>
${ctaBand(ctx, { title: Lb.ctaTitle, body: Lb.ctaBody, img: 'cta-fort-palm', target: 'enquiry/', cta: UI.enquire })}`;
  return shell(ctx, { title: L(`${i.title.en} | Growth Blueprint Advisory`, `${i.title.ar} | غروث بلوبرنت للاستشارات`), description: i.tagline, active: 'industries', body });
}

/* ===================== APPROACH ===================== */
export function approach(ctx) {
  const A = P.APPROACH;
  const rows = A.stages.map((s) => `
<article class="stg">
  <div class="stg__img" style="background-image:url('${ctx.img(s.img)}')"><div class="stg__t"><b class="stg__n">${s.n}</b><h2>${T(ctx, s.t)}</h2><span class="rule" aria-hidden="true"></span><p>${T(ctx, s.d)}</p></div></div>
  <div class="stg__cols">
    <div><span class="stg__ic">${icon(s.icon)}</span><h3>${T(ctx, A.labels.activities)}</h3><ul>${s.act.map((x) => `<li>${T(ctx, x)}</li>`).join('')}</ul></div>
    <div><span class="stg__ic">${icon('doc')}</span><h3>${T(ctx, A.labels.outputs)}</h3><ul>${s.out.map((x) => `<li>${T(ctx, x)}</li>`).join('')}</ul></div>
    <div><span class="stg__ic">${icon('pyramid')}</span><h3>${T(ctx, A.labels.gate)}</h3><p>${T(ctx, s.gate)}</p></div>
  </div>
</article>`).join('');
  const rel = A.related.slugs.map((sl) => serviceBySlug(sl)).map((s) => `<a class="rbox" href="${ctx.href(`services/${s.slug}/`)}"><span>${icon(s.icon)}</span><b>${T(ctx, s.title)}</b>${arrow}</a>`).join('');
  const body = `
${hero(ctx, { eyebrow: A.hero.eyebrow, title: A.hero.title, sub: A.hero.sub, lead: A.hero.lead, img: A.hero.img, ctas: [btn(ctx, UI.book, 'book-a-meeting/', 'gold')] })}
<section class="sec sec--ivory sec--center"><div class="container container--wide"><p class="eyebrow">${T(ctx, A.intro.eyebrow)}</p><h2 class="h2">${T(ctx, A.intro.title)}</h2><p class="lead lead--center">${T(ctx, A.intro.body)}</p></div></section>
<div class="stgs">${rows}</div>
<section class="band-photo" style="--cta-img:url('${ctx.img(A.band.img)}');--ar:${imgAr(A.band.img)}"><div class="band-photo__bg" aria-hidden="true"></div><div class="container container--wide band-photo__in"><div><p class="eyebrow">${T(ctx, A.band.eyebrow)}</p><h2 class="h2">${T(ctx, A.band.title)}</h2><p>${T(ctx, A.band.body)}</p>${btn(ctx, UI.book, 'book-a-meeting/', 'gold')}</div></div></section>
<section class="sec sec--ivory sec--center"><div class="container container--wide"><p class="eyebrow">${T(ctx, A.related.eyebrow)}</p><h2 class="h2">${T(ctx, A.related.title)}</h2><p class="lead lead--center">${T(ctx, A.related.body)}</p><div class="rboxes">${rel}</div></div></section>
${ctaBand(ctx, { ...A.cta, img: 'cta-fort-palm', variant: 'gold' })}`;
  return shell(ctx, { title: A.meta.title, description: A.meta.description, active: 'approach', body });
}

/* ===================== ABOUT ===================== */
export function about(ctx) {
  const A = P.ABOUT;
  const pr = A.principles.items.map((p) => `<li><span>${icon(p.icon)}</span><h3 class="h4">${T(ctx, p.t)}</h3><p>${T(ctx, p.d)}</p></li>`).join('');
  const body = `
${hero(ctx, { ...A.hero, ctas: [] })}
<section class="sec sec--ivory"><div class="container container--wide split split--img-start">
  <figure class="figure figure--tall"><img src="${ctx.img(A.founder.img)}" alt="${esc(ctx.t(L('A Saudi business leader looking over the Riyadh skyline', 'قائد أعمال سعودي يتأمل أفق الرياض')))}" loading="lazy"></figure>
  <div><p class="eyebrow">${T(ctx, A.founder.eyebrow)}</p><h2 class="h2">${T(ctx, A.founder.title)}</h2>${A.founder.paras.map((p) => `<p class="body-p">${T(ctx, p)}</p>`).join('')}</div>
</div></section>
<section class="sec sec--deep sec--center"><div class="container container--wide"><p class="eyebrow">${T(ctx, A.principles.eyebrow)}</p><h2 class="h2">${T(ctx, A.principles.title)}</h2><p class="lead lead--center">${T(ctx, A.principles.body)}</p><ul class="principles">${pr}</ul></div></section>
<section class="sec sec--ivory"><div class="container container--wide split split--img-end">
  <div><p class="eyebrow">${T(ctx, A.specialists.eyebrow)}</p><h2 class="h2">${T(ctx, A.specialists.title)}</h2>${A.specialists.paras.map((p) => `<p class="body-p">${T(ctx, p)}</p>`).join('')}</div>
  <figure class="figure"><img src="${ctx.img(A.specialists.img)}" alt="" loading="lazy"></figure>
</div></section>
${ctaBand(ctx, { ...A.cta, img: 'cta-rocks-dark' })}`;
  return shell(ctx, { title: A.meta.title, description: A.meta.description, active: 'about', body });
}

/* ===================== JOURNEYS ===================== */
export function journey(ctx, J, which) {
  const steps = J.path.steps.map((s, i) => `<li><span class="jstep__n">0${i + 1}</span><span class="jstep__c">${icon(s.icon)}</span><h3 class="h4">${T(ctx, s.t)}</h3><p>${T(ctx, s.d)}</p></li>`).join('');
  const pts = (arr) => `<ul class="pts">${arr.map(([ic, tx]) => `<li><span>${icon(ic)}</span>${T(ctx, tx)}</li>`).join('')}</ul>`;
  const blocks = J.blocks.map((b) => `<div class="jblock"><span>${icon(b.icon)}</span><div><p class="eyebrow eyebrow--rule">${T(ctx, b.t)}</p><p>${T(ctx, b.d)}</p></div></div>`).join('');
  const body = `
${hero(ctx, { eyebrow: J.hero.eyebrow, title: J.hero.title, lead: J.hero.lead, img: J.hero.img, side: J.hero.side, ctas: [btn(ctx, UI.book, 'book-a-meeting/', 'gold')] })}
<section class="sec sec--ivory"><div class="container container--wide split split--img-end"><div>${eyebrow(ctx, J.path.eyebrow, 'eyebrow--rule')}<h2 class="h2">${T(ctx, J.path.title)}</h2><p class="lead">${T(ctx, J.path.body)}</p></div><figure class="figure"><img src="${ctx.img(J.path.img)}" alt="" loading="lazy"></figure></div>
<div class="container container--wide"><ol class="jsteps">${steps}</ol></div></section>
<section class="split-band split-band--navy"><figure class="split-band__img"><img src="${ctx.img(J.assess.img)}" alt="" loading="lazy"></figure><div class="split-band__copy">${eyebrow(ctx, J.assess.eyebrow, 'eyebrow--rule')}<h2 class="h2">${T(ctx, J.assess.title)}</h2><p>${T(ctx, J.assess.body)}</p>${pts(J.assess.points)}</div></section>
<section class="split-band split-band--ivory split-band--rev"><div class="split-band__copy">${eyebrow(ctx, J.models.eyebrow, 'eyebrow--rule')}<h2 class="h2">${T(ctx, J.models.title)}</h2><p>${T(ctx, J.models.body)}</p>${pts(J.models.points)}</div><figure class="split-band__img"><img src="${ctx.img(J.models.img)}" alt="" loading="lazy"></figure></section>
<section class="sec sec--ivory sec--tight"><div class="container container--wide jblocks">${blocks}</div></section>
<section class="split-band split-band--navy split-band--rev"><div class="split-band__copy">${eyebrow(ctx, J.services.eyebrow, 'eyebrow--rule')}<h2 class="h2">${T(ctx, J.services.title)}</h2><p>${T(ctx, J.services.body)}</p>${btn(ctx, J.services.cta, 'services/', 'gold')}</div><figure class="split-band__img"><img src="${ctx.img(J.services.img)}" alt="" loading="lazy"></figure></section>
${ctaBand(ctx, { eyebrow: J.cta.eyebrow, title: J.cta.title, body: J.cta.body, img: J.cta.img, variant: 'light' })}`;
  return shell(ctx, { title: J.meta.title, description: J.meta.description, active: null, body });
}

/* ===================== INSIGHTS ===================== */
export function insights(ctx) {
  const I = P.INSIGHTS_PAGE;
  const chips = [`<button class="fchip is-on" data-filter="all" aria-pressed="true">${T(ctx, I.all)}</button>`].concat(P.INSIGHT_CATEGORIES.map((c) => `<button class="fchip" data-filter="${c.id}" aria-pressed="false">${T(ctx, c.label)}</button>`)).join('');
  const rows = P.ARTICLES.map((a) => {
    const cat = P.INSIGHT_CATEGORIES.find((c) => c.id === a.cat);
    return `<article class="irow" data-cat="${a.cat}"><a class="irow__img" href="${ctx.href(`insights/${a.slug}/`)}" tabindex="-1" aria-hidden="true"><img src="${ctx.img(a.img)}" alt="" loading="lazy"></a>
      <div class="irow__b"><p class="eyebrow">${T(ctx, cat.label)}</p><h2 class="h2 h2--md"><a href="${ctx.href(`insights/${a.slug}/`)}">${T(ctx, a.title)}</a></h2><p class="irow__tag">${T(ctx, I.sample)}</p><p>${T(ctx, a.excerpt)}</p>${btn(ctx, UI.readArticle, `insights/${a.slug}/`, 'gold', 'btn--sm')}</div></article>`;
  }).join('');
  const rel = I.related.slugs.map((sl) => serviceBySlug(sl)).map((s) => `<a class="rlink" href="${ctx.href(`services/${s.slug}/`)}"><span>${icon(s.icon)}</span><b>${T(ctx, s.title)}</b>${arrow}</a>`).join('');
  const body = `
${hero(ctx, { ...I.hero })}
<section class="sec sec--ivory sec--tight"><div class="container container--wide"><div class="filters" role="group" aria-label="${esc(ctx.t(L('Filter articles', 'تصفية المقالات')))}">${chips}</div>
<div class="ilist" id="ilist">${rows}</div><p class="empty" id="iempty" hidden>${T(ctx, I.empty)}</p></div></section>
<section class="sec sec--ivory sec--line"><div class="container container--wide"><p class="eyebrow eyebrow--rule">${T(ctx, I.related.eyebrow)}</p><h2 class="h2">${T(ctx, I.related.title)}</h2><p class="lead">${T(ctx, I.related.body)}</p><div class="rlinks">${rel}</div></div></section>
<section class="sec sec--deep"><div class="container container--md">${newsletter(ctx, { variant: 'band', id: 'inl', source: 'insights' })}</div></section>
${ctaBand(ctx, { ...I.cta, img: 'cta-rocks-dark' })}`;
  return shell(ctx, { title: I.meta.title, description: I.meta.description, active: 'insights', body });
}

export function article(ctx, a) {
  const Lb = P.ARTICLE_LABELS;
  const toc = a.sections.map((s, i) => `<li><a href="#s${i + 1}"><span>0${i + 1}</span>${T(ctx, s.h).replace(/\?$/, '')}</a></li>`).join('');
  const secs = a.sections.map((s, i) => `
  <section class="asec" id="s${i + 1}"><div class="asec__t"><span class="asec__n">0${i + 1}</span><span class="asec__ic">${icon(s.icon)}</span></div>
    <div class="asec__b"><h2 class="h3 h3--lg">${T(ctx, s.h)}</h2>${[].concat(s.p).map((x) => `<p>${T(ctx, x)}</p>`).join('')}</div><figure class="asec__img"><img src="${ctx.img(s.img)}" alt="" loading="lazy"></figure></section>`).join('');
  const rel = a.related.slice(0, 6).map((sl) => serviceBySlug(sl)).map((s) => `<li><a href="${ctx.href(`services/${s.slug}/`)}"><span>${icon(s.icon)}</span><b>${T(ctx, s.title)}</b>${arrow}</a></li>`).join('');
  const body = `
${hero(ctx, { eyebrow: Lb.eyebrow, title: a.title, lead: a.lead, img: a.hero, crumbs: crumbs(ctx, { label: L('Insights', 'رؤى'), href: ctx.href('insights/') }, { label: a.title }) })}
<section class="sec sec--ivory"><div class="container container--wide art">
  <div class="art__main">
    <figure class="art__hero"><img src="${ctx.img(a.bodyImg)}" alt="" loading="eager"></figure>
    <div class="art__intro">${[].concat(a.intro).map((x) => `<p>${T(ctx, x)}</p>`).join('')}</div>
    ${secs}
    <div class="art__concl" id="concl"><h2 class="h3 h3--lg">${T(ctx, Lb.conclusion)}</h2>${[].concat(a.conclusion).map((x) => `<p>${T(ctx, x)}</p>`).join('')}</div>
  </div>
  <aside class="art__aside">
    <nav class="box" aria-label="${esc(ctx.t(Lb.toc))}"><h2 class="h4">${T(ctx, Lb.toc)}</h2><span class="rule" aria-hidden="true"></span><ol class="toc"><li><a href="#top">${T(ctx, Lb.intro)}</a></li>${toc}<li><a href="#concl">${T(ctx, Lb.conclusion)}</a></li></ol></nav>
    <div class="box"><h2 class="h4">${T(ctx, Lb.related)}</h2><span class="rule" aria-hidden="true"></span><ul class="rel-list">${rel}</ul></div>
    <div class="box box--navy"><span class="rule" aria-hidden="true"></span><h2 class="h4">${T(ctx, Lb.ctaTitle)}</h2><p>${T(ctx, Lb.ctaBody)}</p>${btn(ctx, UI.book, 'book-a-meeting/', 'gold')}</div>
  </aside>
</div></section>
${ctaBand(ctx, { eyebrow: Lb.bandEyebrow, title: UI.book, body: Lb.bandBody, img: 'cta-rocks-dark' })}`;
  return shell(ctx, { title: L(`${a.title.en} | Growth Blueprint Advisory`, `${a.title.ar} | غروث بلوبرنت للاستشارات`), description: a.excerpt, active: 'insights', body });
}

/* ===================== CHECKLIST ===================== */
export function checklist(ctx) {
  const C = P.CHECKLIST; let n = 0;
  const stats = C.stats.map(([ic, num, label, big]) => `<li><span>${icon(ic)}</span><b>${num || T(ctx, big)}</b><small>${T(ctx, label)}</small></li>`).join('');
  const areas = C.areas.map((a) => `
  <article class="ck" data-area="${a.id}"><figure class="ck__img"><img src="${ctx.img(a.img)}" alt="" loading="lazy"></figure>
    <div class="ck__meta"><span class="ck__ic">${icon(a.icon)}</span><div><h3 class="h3">${T(ctx, a.t)}</h3><p class="ck__count"><span data-count>0</span>/${a.q.length} ${T(ctx, C.list.questionsWord)}</p><p class="ck__d">${T(ctx, a.d)}</p></div></div>
    <ul class="ck__q">${a.q.map((q) => { n += 1; return `<li><label><input type="checkbox" data-q="${n}"><span class="ck__box" aria-hidden="true">${icon('check')}</span><span class="ck__txt">${n}. ${T(ctx, q)}</span></label></li>`; }).join('')}</ul></article>`).join('');
  const body = `
${hero(ctx, { eyebrow: C.hero.eyebrow, title: C.hero.title, lead: C.hero.lead, img: C.hero.img, ctas: [`<button class="btn btn--gold" data-print><span>${T(ctx, C.hero.download)}</span>${icon('download', 'btn-ic')}</button>`, `<span class="hero__or">${T(ctx, C.hero.or)} <a href="${ctx.href('book-a-meeting/')}">${T(ctx, UI.book)} ${arrow}</a></span>`] })}
<section class="ck-stats"><ul class="container container--wide">${stats}</ul></section>
<section class="sec sec--ivory"><div class="container container--wide split split--img-end"><div>${eyebrow(ctx, C.start.eyebrow)}<h2 class="h2">${T(ctx, C.start.title)}</h2><p class="lead">${T(ctx, C.start.body)}</p></div><figure class="figure"><img src="${ctx.img(C.start.img)}" alt="" loading="lazy"></figure></div></section>
<section class="sec sec--ivory sec--tight" id="checklist"><div class="container container--wide">
  <div class="ck-head"><div>${eyebrow(ctx, C.list.eyebrow)}<h2 class="h2">${T(ctx, C.list.title)}</h2></div>
    <div class="ck-progress" role="group" aria-label="${esc(ctx.t(C.list.progress))}"><div class="ck-progress__l"><span>${T(ctx, C.list.progress)}</span><b id="ckPct">0%</b></div><div class="ck-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="ckBar"><i id="ckFill"></i></div>
      <div class="ck-actions"><button class="link-btn" data-ck-reset>${T(ctx, C.list.reset)}</button><button class="link-btn" data-print>${T(ctx, C.list.print)}</button></div></div></div>
  <div class="cks">${areas}</div>
</div></section>
${ctaBand(ctx, { ...C.cta, variant: 'navy', img: C.cta.img })}
<section class="note"><div class="container container--wide note__in"><span>${icon('doc')}</span><div><h2 class="h4">${T(ctx, C.note.title)}</h2><p>${T(ctx, C.note.body)}</p></div></div></section>`;
  return shell(ctx, { title: C.meta.title, description: C.meta.description, active: null, body, bodyClass: 'page-checklist' });
}

/* ===================== BOOK A MEETING ===================== */
export function book(ctx) {
  const B = P.BOOK, F = B.form.labels;
  const why = B.why.items.map((w) => `<li><span>${icon(w.icon)}</span><h3 class="h4">${T(ctx, w.t)}</h3><p>${T(ctx, w.d)}</p></li>`).join('');
  const prep = B.prepare.steps.map((s, i) => `<li><span>${i + 1}</span>${T(ctx, s)}</li>`).join('');
  const opts = B.form.options.map((o) => `<option>${T(ctx, o)}</option>`).join('');
  const body = `
${hero(ctx, { eyebrow: B.hero.eyebrow, title: B.hero.title, lead: B.hero.lead, img: B.hero.img, ctas: [btn(ctx, UI.book, 'book-a-meeting/#request', 'gold')] })}
<section class="sec sec--ivory"><div class="container container--wide"><p class="eyebrow">${T(ctx, B.why.eyebrow)}</p><h2 class="h2">${T(ctx, B.why.title)}</h2><ul class="why">${why}</ul></div></section>
<section class="sec sec--ivory sec--tight"><div class="container container--wide"><div class="sched"><h2 class="h2 h2--md">${T(ctx, B.schedule.title)}</h2><p>${T(ctx, B.schedule.body)}</p>
  <div class="sched__soon"><span>${icon('calendar')}</span><div><b>${T(ctx, B.schedule.soonTitle)}</b><p>${T(ctx, B.schedule.soonBody)}</p></div></div></div></div></section>
<section class="split-band split-band--ivory"><div class="split-band__copy"><h2 class="h2">${T(ctx, B.prepare.title)}</h2><span class="rule" aria-hidden="true"></span><p>${T(ctx, B.prepare.lead)}</p><ol class="prep">${prep}</ol></div><figure class="split-band__img"><img src="${ctx.img(B.prepare.img)}" alt="" loading="lazy"></figure></section>
<section class="req" id="request"><div class="req__form"><div class="container-half">
  <p class="eyebrow">${T(ctx, B.form.eyebrow)}</p><h2 class="h2">${T(ctx, B.form.title)}</h2><p>${T(ctx, B.form.body)}</p>
  <form class="form form--dark" data-demo-form action="${ctx.href('enquiry/confirmation/')}" novalidate>
    <div class="fgrid">
      <div class="field"><label for="b-name">${T(ctx, F.name)}</label><input id="b-name" name="name" type="text" autocomplete="name" required><small class="err" hidden></small></div>
      <div class="field"><label for="b-co">${T(ctx, F.company)}</label><input id="b-co" name="company" type="text" autocomplete="organization" required><small class="err" hidden></small></div>
      <div class="field"><label for="b-em">${T(ctx, F.email)}</label><input id="b-em" name="email" type="email" autocomplete="email" required dir="ltr"><small class="err" hidden></small></div>
      <div class="field"><label for="b-ph">${T(ctx, F.phone)}</label><input id="b-ph" name="phone" type="tel" autocomplete="tel" dir="ltr"></div>
    </div>
    <div class="field"><label for="b-help">${T(ctx, F.help)}</label><select id="b-help" name="help" required><option value="">${T(ctx, F.select)}</option>${opts}</select><small class="err" hidden></small></div>
    <div class="field"><label for="b-more">${T(ctx, F.more)}</label><textarea id="b-more" name="more" rows="4" placeholder="${esc(ctx.t(F.moreHint))}"></textarea></div>
    <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="field"><label class="check"><input type="checkbox" name="consent"><span class="check__b" aria-hidden="true">${icon('check')}</span><span>${T(ctx, CONSENT.processing)} <a href="${ctx.href('privacy/')}">${T(ctx, CONSENT.privacy)}</a></span></label><small class="err" data-consent-err hidden>${T(ctx, CONSENT.err)}</small></div>
    <label class="check"><input type="checkbox" name="marketing"><span class="check__b" aria-hidden="true">${icon('check')}</span><span>${T(ctx, CONSENT.marketing)}</span></label>
    <p class="err" role="alert" hidden data-form-err>${T(ctx, CONSENT.formErr)}</p>
    <button class="btn btn--gold" type="submit"><span>${T(ctx, F.submit)}</span>${arrow}</button>
  </form></div></div>
  <figure class="req__img" style="background-image:url('${ctx.img(B.location.img)}')"><figcaption><p class="eyebrow">${T(ctx, B.location.eyebrow)}</p><h2 class="h2">${T(ctx, B.location.title)}</h2><span class="rule" aria-hidden="true"></span><p>${T(ctx, B.location.body)}</p></figcaption></figure>
</section>
<section class="split-band split-band--ivory split-band--rev split-band--short"><div class="split-band__copy"><h2 class="h2">${T(ctx, B.office.title)}</h2><span class="rule" aria-hidden="true"></span><p>${T(ctx, B.office.body)}</p><p class="locn"><span>${icon('pin')}</span><span><b>${T(ctx, SITE.address)}</b><small>${T(ctx, B.office.note)}</small></span></p></div><figure class="split-band__img"><img src="${ctx.img(B.office.img)}" alt="" loading="lazy"></figure></section>`;
  return shell(ctx, { title: B.meta.title, description: B.meta.description, active: null, body });
}

/* ===================== ENQUIRY ===================== */
export function enquiry(ctx) {
  const E = P.ENQUIRY, f = E.f;
  const steps = E.steps.map((s, i) => `<li data-step-i="${i + 1}"><span class="stp__c"><i>${i + 1}</i></span><span class="stp__n">${i + 1}</span><b>${T(ctx, s)}</b></li>`).join('');
  const sectorOpts = INDUSTRIES.map((i) => `<option value="${i.slug}">${T(ctx, i.title)}</option>`).join('');
  const sel = (id, label, opts, err) => `<div class="field"><label for="${id}">${T(ctx, label)}</label><select id="${id}" name="${id}" required><option value="">${T(ctx, L('Select an option', 'اختر خيارًا'))}</option>${opts.map((o) => `<option>${T(ctx, o)}</option>`).join('')}</select><small class="err" hidden>${T(ctx, err)}</small></div>`;
  const body = `
${hero(ctx, { title: E.hero.title, lead: E.hero.lead, img: E.hero.img, pos: 'right center' })}
<section class="sec sec--ivory enq"><div class="container container--md">
  <nav class="crumbs crumbs--dark" aria-label="${esc(ctx.t(L('Breadcrumb', 'مسار التنقل')))}"><ol><li><a href="${ctx.href('')}">${T(ctx, UI.breadcrumbHome)}</a></li><li>${T(ctx, E.crumbs)}</li><li><span id="enqCrumb" aria-current="page">${T(ctx, E.steps[0])}</span></li></ol></nav>
  <div class="enq__head"><h1 class="h2" id="enqTitle" tabindex="-1">${T(ctx, E.stepWord)} 1 — ${T(ctx, E.steps[0])}</h1><p id="enqIntro">${T(ctx, E.stepIntros[0])}</p></div>
  <ol class="stp" id="stp" aria-label="${esc(ctx.t(L('Progress', 'التقدّم')))}">${steps}</ol>
  <form class="enq__card form" id="enqForm" data-enquiry data-confirm="${ctx.href('enquiry/confirmation/')}" novalidate>
    <h2 class="h3">${T(ctx, E.card.details)}</h2><p class="enq__req">${T(ctx, E.card.required)}</p>
    <div class="enq__step" data-step="1">
      <div class="field"><label for="name">${T(ctx, f.name)}</label><input id="name" name="name" type="text" autocomplete="name" required><small class="err" hidden>${T(ctx, f.nameErr)}</small></div>
      <div class="field"><label for="email">${T(ctx, f.email)}</label><input id="email" name="email" type="email" autocomplete="email" dir="ltr" required><small class="hint">${T(ctx, f.emailHint)}</small><small class="err" hidden>${T(ctx, f.emailErr)}</small></div>
      <div class="field"><label for="company">${T(ctx, f.company)}</label><input id="company" name="company" type="text" autocomplete="organization" required><small class="err" hidden>${T(ctx, f.companyErr)}</small></div>
    </div>
    <div class="enq__step" data-step="2" hidden>
      ${sel('interest', f.interest, f.interestOpts, f.interestErr)}
      <div class="field"><label for="sector">${T(ctx, f.sector)}</label><select id="sector" name="sector"><option value="">${T(ctx, f.sectorSelect)}</option>${sectorOpts}</select></div>
      <div class="field"><label for="role">${T(ctx, f.role)}</label><input id="role" name="role" type="text" autocomplete="organization-title"></div>
    </div>
    <div class="enq__step" data-step="3" hidden>
      <fieldset class="field"><legend>${T(ctx, f.objectives)}</legend><div class="checks">${f.objectiveOpts.map((o, i) => `<label class="check"><input type="checkbox" name="objectives" value="${i}"><span class="check__b" aria-hidden="true">${icon('check')}</span><span>${T(ctx, o)}</span></label>`).join('')}</div><small class="err" hidden>${T(ctx, f.objectivesErr)}</small></fieldset>
      ${sel('timeline', f.timeline, f.timelineOpts, f.interestErr)}
    </div>
    <div class="enq__step" data-step="4" hidden>
      <div class="field"><label for="phone">${T(ctx, f.phone)}</label><input id="phone" name="phone" type="tel" autocomplete="tel" dir="ltr"></div>
      <div class="field"><label for="contact">${T(ctx, f.contactPref)}</label><select id="contact" name="contact">${f.contactOpts.map((o) => `<option>${T(ctx, o)}</option>`).join('')}</select></div>
      <div class="field"><label for="message">${T(ctx, f.message)}</label><textarea id="message" name="message" rows="5"></textarea></div>
    </div>
    <div class="enq__step" data-step="5" hidden>
      <h3 class="h4">${T(ctx, f.review)}</h3><dl class="review" id="review"></dl>
      <input class="hp" type="text" id="website" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="check check--consent"><input type="checkbox" id="consent" name="consent"><span class="check__b" aria-hidden="true">${icon('check')}</span><span>${T(ctx, CONSENT.processing)} <a href="${ctx.href('privacy/')}">${T(ctx, CONSENT.privacy)}</a></span></label><small class="err" id="consentErr" hidden>${T(ctx, CONSENT.err)}</small>
      <label class="check"><input type="checkbox" id="marketing" name="marketing"><span class="check__b" aria-hidden="true">${icon('check')}</span><span>${T(ctx, CONSENT.marketing)}</span></label>
      <p class="err" role="alert" hidden data-form-err>${T(ctx, CONSENT.formErr)}</p>
    </div>
    <div class="enq__nav"><button type="button" class="btn btn--outline-dark" data-back hidden><span>${T(ctx, UI.back)}</span></button><button type="submit" class="btn btn--gold" data-next><span data-next-l>${T(ctx, UI.continue)}</span>${arrow}</button></div>
  </form>
  <ul class="trust">${E.trust.map((t) => `<li><span>${icon(t.icon)}</span><h3 class="h4">${T(ctx, t.t)}</h3><p>${T(ctx, t.d)}</p></li>`).join('')}</ul>
</div></section>
<section class="split-band split-band--ivory split-band--photo-left"><figure class="split-band__img"><img src="${ctx.img(E.band.img)}" alt="" loading="lazy"></figure><div class="split-band__copy"><span class="rule" aria-hidden="true"></span><h2 class="h2">${T(ctx, E.band.title)}</h2><p>${T(ctx, E.band.body)}</p><span class="rule" aria-hidden="true"></span></div></section>
<script type="application/json" id="enqData">${JSON.stringify({ lang: ctx.lang, steps: E.steps.map((s) => ctx.t(s)), intros: E.stepIntros.map((s) => ctx.t(s)), word: ctx.t(E.stepWord), next: ctx.t(UI.continue), submit: ctx.t(UI.submit), none: ctx.t(f.none), edit: ctx.t(f.edit), labels: { name: ctx.t(f.name), email: ctx.t(f.email), company: ctx.t(f.company), role: ctx.t(f.role), interest: ctx.t(f.interest), sector: ctx.t(f.sector), objectives: ctx.t(f.objectives), timeline: ctx.t(f.timeline), phone: ctx.t(f.phone), contact: ctx.t(f.contactPref), message: ctx.t(f.message) }, objectiveOpts: f.objectiveOpts.map((o) => ctx.t(o)) })}</script>`;
  return shell(ctx, { title: E.meta.title, description: E.meta.description, active: null, body, bodyClass: 'page-enquiry' });
}

/* ===================== CONFIRMATION ===================== */
export function confirmation(ctx) {
  const C = P.CONFIRM, V = C.live;
  const next = C.next.items.map((n) => `<li><span>${icon(n.icon)}</span><div><b>${T(ctx, n.t)}</b><p>${T(ctx, n.d)}</p></div></li>`).join('');
  const info = C.info.items.map((n) => `<li><span>${icon(n.icon)}</span><h3 class="h4">${T(ctx, n.t)}</h3><p>${T(ctx, n.d)}</p></li>`).join('');
  const lv = (demo, live) => `data-live="${esc(ctx.t(live))}"`;
  const body = `
<div data-confirm-page data-live-title="${esc(ctx.t(V.title))}"></div>
${hero(ctx, { title: C.hero.title, lead: C.hero.lead, img: C.hero.img, live: { title: V.title, lead: V.lead } })}
<section class="sec sec--ivory sec--center"><div class="container container--md"><span class="thanks__ic">${icon('send')}</span><p class="eyebrow" ${lv(0, V.eyebrow)}>${T(ctx, C.thanks.eyebrow)}</p><h2 class="h2" ${lv(0, V.title)}>${T(ctx, C.thanks.title)}</h2><p class="lead lead--center" ${lv(0, V.body)}>${T(ctx, C.thanks.body)}</p>
  <p class="ref-line" data-live-only hidden>${T(ctx, V.ref)}: <b data-ref></b></p><p class="demo-chip" data-demo-only>${T(ctx, L('Demonstration: nothing was sent', 'عرض تجريبي: لم يُرسل شيء'))}</p></div></section>
<section class="sec sec--ivory sec--tight sec--line"><div class="container container--wide next"><div><p class="eyebrow" ${lv(0, V.nextEyebrow)}>${T(ctx, C.next.eyebrow)}</p><h2 class="h2">${T(ctx, C.next.title)}</h2><span class="rule" aria-hidden="true"></span><p ${lv(0, V.nextBody)}>${T(ctx, C.next.body)}</p></div><ol class="nxt">${next}</ol></div></section>
<section class="split-band split-band--navy split-band--photo-left"><figure class="split-band__img"><img src="${ctx.img(C.explore.img)}" alt="" loading="lazy"></figure><div class="split-band__copy"><p class="eyebrow">${T(ctx, C.explore.eyebrow)}</p><h2 class="h2">${T(ctx, C.explore.title)}</h2><p>${T(ctx, C.explore.body)}</p><div class="stack">${btn(ctx, C.explore.home, '', 'gold')}${btn(ctx, C.explore.services, 'services/', 'outline-gold')}</div></div></section>
<section class="sec sec--ivory sec--center" data-demo-only><div class="container container--wide"><p class="eyebrow">${T(ctx, C.info.eyebrow)}</p><h2 class="h2">${T(ctx, C.info.title)}</h2><p class="lead lead--center">${T(ctx, C.info.body)}</p><ul class="trust trust--4">${info}</ul></div></section>
${ctaBand(ctx, { eyebrow: C.purpose.eyebrow, title: C.purpose.title, body: C.purpose.body, img: C.purpose.img, variant: 'light', cta: C.purpose.cta, target: 'our-approach/' })}`;
  return shell(ctx, { title: C.meta.title, description: C.meta.description, active: null, body, extraHead: '<meta name="robots" content="noindex">' });
}

/* ===================== LEGAL / 404 ===================== */
export function notFound(ctx) {
  const body = `<section class="legal-hero"><div class="container container--md"><p class="eyebrow">404</p><h1 class="hero__title">${T(ctx, UI.notFoundTitle)}</h1><span class="rule" aria-hidden="true"></span><p class="hero__lead">${T(ctx, UI.notFoundBody)}</p><div class="hero__ctas">${btn(ctx, UI.home, '', 'gold')}${btn(ctx, UI.exploreServices, 'services/', 'outline')}</div></div></section>`;
  return shell(ctx, { title: UI.notFoundTitle, description: UI.notFoundBody, active: null, body, extraHead: '<meta name="robots" content="noindex">' });
}

/* ===================== SCORECARD ===================== */
import { SC_PAGE, SC_UI, SC_DIMS, SC_BANDS, SC_REPORT, SC_STAGE_PLAN, SC_SECTOR_NOTE, SC_RESULT, SC_VERSION } from './scorecard.mjs';
import { PRODUCTS } from './shop.mjs';
import { serviceBySlug as svcBySlug } from './services.mjs';

export function scorecardIntro(ctx) {
  const S = SC_PAGE;
  const get = S.get.items.map((g) => `<li><span>${icon(g.icon)}</span><h3 class="h4">${T(ctx, g.t)}</h3><p>${T(ctx, g.d)}</p></li>`).join('');
  const how = S.how.steps.map((h) => `<li><span class="how__n">${h.n}</span><h3 class="h4">${T(ctx, h.t)}</h3><p>${T(ctx, h.d)}</p></li>`).join('');
  const dims = SC_DIMS.map((d) => `<li><span>${icon(d.icon)}</span><div><b>${T(ctx, d.t)}</b><small>${T(ctx, d.d)}</small></div></li>`).join('');
  const body = `
${hero(ctx, { eyebrow: S.hero.eyebrow, title: S.hero.title, lead: S.hero.lead, img: S.hero.img, ctas: [`<a class="btn btn--gold" href="${ctx.href('readiness-scorecard/assessment/')}" data-sc-start><span>${T(ctx, S.start)}</span>${arrow}</a>`, `<a class="btn btn--outline" href="${ctx.href('readiness-scorecard/assessment/')}" data-sc-resume hidden><span>${T(ctx, S.resume)}</span>${arrow}</a>`] })}
<section class="sec sec--ivory"><div class="container container--wide"><p class="eyebrow eyebrow--rule">${T(ctx, S.get.eyebrow)}</p><h2 class="h2">${T(ctx, S.get.title)}</h2><ul class="sc-get">${get}</ul></div></section>
<section class="sec sec--deep"><div class="container container--wide split"><div><p class="eyebrow eyebrow--rule">${T(ctx, S.how.eyebrow)}</p><h2 class="h2">${T(ctx, S.how.title)}</h2><ol class="how">${how}</ol></div>
<div class="sc-dims"><h3 class="h4">${T(ctx, L('The six areas we look at', 'المجالات الستة التي ننظر فيها'))}</h3><ul>${dims}</ul></div></div></section>
<section class="sec sec--ivory sec--tight"><div class="container container--wide sc-priv"><span>${icon('lock')}</span><div><h2 class="h3">${T(ctx, S.privacy.title)}</h2><p>${T(ctx, S.privacy.body)}</p><a class="more" href="${ctx.href('privacy/')}"><span>${T(ctx, S.privacy.link)}</span>${arrow}</a></div></div></section>
${ctaBand(ctx, { eyebrow: L('Ten minutes, no sign-up', 'عشر دقائق دون تسجيل'), title: SC_PAGE.hero.title, body: SC_PAGE.note, img: 'ck-cta-terrace', cta: S.start, target: 'readiness-scorecard/assessment/' })}`;
  return shell(ctx, { title: S.meta.title, description: S.meta.description, active: null, body, scripts: ['scorecard.js'] });
}

const scData = (ctx) => {
  const t = ctx.t;
  return {
    v: SC_VERSION, lang: ctx.lang,
    ui: { ctx: { title: t(SC_UI.ctx.title), body: t(SC_UI.ctx.body), sector: t(SC_UI.ctx.sector), stage: t(SC_UI.ctx.stage), size: t(SC_UI.ctx.size), choose: t(SC_UI.ctx.choose), other: t(SC_UI.ctx.other), stages: SC_UI.ctx.stages.map(t), sizes: SC_UI.ctx.sizes.map(t) },
      scale: SC_UI.scale.map(t), unsure: t(SC_UI.unsure), q: t(SC_UI.q), part: t(SC_UI.step), of: t(SC_UI.of), min: t(SC_UI.min), minutes: t(SC_UI.minutes), back: t(SC_UI.back), next: t(SC_UI.next), finish: t(SC_UI.finish), saved: t(SC_UI.saved), answerAll: t(SC_UI.answerAll) },
    sectors: INDUSTRIES.map((i) => ({ id: i.slug, t: t(i.title) })),
    dims: SC_DIMS.map((d) => ({ id: d.id, t: t(d.t), d: t(d.d), icon: d.id, q: d.q.map(t), svc: d.svc }))
  };
};

export function scorecardAssessment(ctx) {
  const body = `
<section class="sc-app-wrap"><div class="container container--md">
  <div id="sc-app" data-results="${ctx.href('readiness-scorecard/results/')}" aria-live="polite"><noscript><p class="sc-nojs">${T(ctx, SC_UI.noJs)}</p></noscript></div>
</div></section>
<script type="application/json" id="sc-data">${JSON.stringify(scData(ctx))}</script>`;
  return shell(ctx, { title: SC_PAGE.meta.title, description: SC_PAGE.meta.description, active: null, body, bodyClass: 'page-sc', scripts: ['scorecard.js'], extraHead: '<meta name="robots" content="noindex">' });
}

export function scorecardResults(ctx) {
  const R = SC_RESULT, t = ctx.t;
  const data = {
    ...scData(ctx),
    r: { eyebrow: t(R.eyebrow), overall: t(R.overall), outOf: t(R.outOf), by: t(R.by), strengths: t(R.strengths), priorities: t(R.priorities), noStrength: t(R.noStrength), detail: t(R.detail), whatItMeans: t(R.whatItMeans), doNext: t(R.doNext), flagged: { t: t(R.flagged.t), d: t(R.flagged.d) }, sector: t(R.sector), plan: t(R.plan), help: { t: t(R.help.t), d: t(R.help.d) }, brief: { t: t(R.brief.t), d: t(R.brief.d), cta: t(R.brief.cta) }, cta: { t: t(R.cta.t), d: t(R.cta.d) },
      email: Object.fromEntries(Object.entries(R.email).map(([k, v]) => [k, t(v)])), print: t(R.print), retake: t(R.retake), book: t(R.book), none: t(R.none), disclaimer: t(R.disclaimer), levels: { low: t(R.levels.low), mid: t(R.levels.mid), high: t(R.levels.high) }, generated: t(R.generated), on: t(R.on), start: t(SC_PAGE.start) },
    bands: SC_BANDS.map((b) => ({ min: b.min, id: b.id, t: t(b.t), p: t(b.p), c: b.c })),
    report: Object.fromEntries(Object.entries(SC_REPORT).map(([k, lv]) => [k, Object.fromEntries(Object.entries(lv).map(([l, o]) => [l, { m: t(o.m), a: o.a.map(t) }]))])),
    stagePlan: Object.fromEntries(Object.entries(SC_STAGE_PLAN).map(([k, v]) => [k, v.map(t)])),
    sectorNote: Object.fromEntries(Object.entries(SC_SECTOR_NOTE).map(([k, v]) => [k, t(v)])),
    services: Object.fromEntries(SC_DIMS.flatMap((d) => d.svc).map((sl) => [sl, { t: t(svcBySlug(sl).title), href: ctx.href(`services/${sl}/`) }])),
    briefs: Object.fromEntries(PRODUCTS.map((p) => [p.sector, { t: t(p.title), href: ctx.href(`shop/${p.slug}/`) }])),
    urls: { assess: ctx.href('readiness-scorecard/assessment/'), book: ctx.href('book-a-meeting/'), privacy: ctx.href('privacy/'), results: ctx.href('readiness-scorecard/results/') }
  };
  const body = `
<section class="sc-report-wrap"><div class="container container--wide"><div id="sc-report" aria-live="polite"></div></div></section>
<script type="application/json" id="sc-data">${JSON.stringify(data)}</script>`;
  return shell(ctx, { title: R.meta.title, description: R.meta.description, active: null, body, bodyClass: 'page-sc page-report', scripts: ['scorecard.js'], extraHead: '<meta name="robots" content="noindex">' });
}
