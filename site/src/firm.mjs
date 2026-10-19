// Verified facts about the firm, taken from the firm's published website (getgrowthblueprint.com).
// Arabic text is our translation and needs native review. Client quotes are as published by the firm.
import { readFileSync } from 'node:fs';
import { L } from './ui.mjs';
import { icon } from './icons.mjs';
import { esc, sectionHead } from './render.mjs';

const T = (ctx, v) => esc(ctx.t(v));

export const FIRM = {
  founded: 2024, years: '25+', licence: '970146',
  licenceBody: L('Ministry of Human Resources & Social Development', 'وزارة الموارد البشرية والتنمية الاجتماعية'),
  linkedin: 'https://www.linkedin.com/company/105738251',
  hours: [
    { d: L('Sunday – Thursday', 'الأحد – الخميس'), t: L('9:30 AM – 5:30 PM', '9:30 ص – 5:30 م') },
    { d: L('Friday – Saturday', 'الجمعة – السبت'), t: L('Closed', 'مغلق') }
  ],
  tz: L('Saudi Arabia Time (AST)', 'توقيت السعودية (AST)'),
  vision: L('To be the trusted partner for international investors seeking to grow in Saudi Arabia, bridging global ambition with local opportunity.', 'أن نكون الشريك الموثوق للمستثمرين الدوليين الراغبين في النمو في المملكة العربية السعودية، نجسر بين الطموح العالمي والفرصة المحلية.'),
  mission: L('To provide clarity, confidence and connections that enable sustainable growth for our clients in Saudi Arabia.', 'أن نقدّم الوضوح والثقة والعلاقات التي تتيح لعملائنا نموًا مستدامًا في المملكة العربية السعودية.'),
  gateway: L('We act as both an Enabler and a Gateway to the Saudi market: your bridge to Vision 2030 opportunities.', 'نعمل مُمكِّنًا وبوابةً إلى السوق السعودي في آنٍ واحد: جسرك إلى فرص رؤية 2030.'),
  why: [
    { icon: 'globe', t: L('Deep local knowledge', 'معرفة محلية عميقة'), d: L('With a global perspective.', 'برؤية عالمية.') },
    { icon: 'route', t: L('Streamlined access', 'وصول مبسّط'), d: L('To opportunities and stakeholders.', 'إلى الفرص وأصحاب المصلحة.') },
    { icon: 'scale', t: L('Cost-effective', 'فعّالية في التكلفة'), d: L('A flexible advisory approach.', 'نهج استشاري مرن.') },
    { icon: 'users', t: L('A strong network', 'شبكة علاقات قوية'), d: L('Legal, accounting and sector experts.', 'خبراء في القانون والمحاسبة والقطاعات.') }
  ],
  team: [
    { i: 'FH', n: L('Faisal Halawani', 'فيصل حلواني'), r: L('Managing Director', 'المدير العام'), b: L('More than 25 years in multinational business, innovation and commercial planning. Member of the Saudi Management Consultants Association.', 'أكثر من 25 عامًا في الأعمال متعددة الجنسيات والابتكار والتخطيط التجاري. عضو في الجمعية السعودية للمستشارين الإداريين.'), tags: [L('Strategy', 'الاستراتيجية'), L('Innovation', 'الابتكار')] },
    { i: 'HS', n: L('Hatim Shetifi', 'حاتم شطيفي'), r: L('Legal Advisor', 'المستشار القانوني'), b: L('20 years as a legal consultant. Head of Hatim Shetifi Office for advocates and legal consultants.', '20 عامًا في الاستشارات القانونية. رئيس مكتب حاتم شطيفي للمحامين والمستشارين القانونيين.'), tags: [L('Legal', 'القانون'), L('Regulations', 'الأنظمة')] },
    { i: 'AA', n: L('Ahmad Al-Zaeem', 'أحمد الزعيم'), r: L('Marketing & Branding Expert', 'خبير التسويق والعلامات التجارية'), b: L('Managing Director of Saudi Aim, with extensive experience in marketing, creative design and branding and re-branding for Saudi and international businesses.', 'المدير العام لشركة سعودي إيم، وله خبرة واسعة في التسويق والتصميم الإبداعي وبناء العلامات التجارية وإعادة بنائها للشركات السعودية والدولية.'), tags: [L('Marketing', 'التسويق'), L('Branding', 'العلامة التجارية')] },
    { i: 'MS', n: L('Mohammed Shitifi', 'محمد شطيفي'), r: L('Real Estate Specialist', 'متخصص في العقار'), b: L('CEO of Shetifi Real Estate, with more than 5 years in the real estate industry, specialising in Saudi market opportunities and property investment.', 'الرئيس التنفيذي لشطيفي العقارية، بخبرة تزيد على 5 سنوات في القطاع العقاري، ومتخصص في فرص السوق السعودي والاستثمار العقاري.'), tags: [L('Real estate', 'العقار'), L('Investment', 'الاستثمار')] },
    { i: 'SA', n: L('Salah Abu Alwafa', 'صلاح أبو الوفا'), r: L('Advertising & PR Expert', 'خبير الإعلان والعلاقات العامة'), b: L('More than 28 years managing communication and PR campaigns, online and offline.', 'أكثر من 28 عامًا في إدارة حملات الاتصال والعلاقات العامة، عبر الإنترنت وخارجه.'), tags: [L('Advertising', 'الإعلان'), L('PR', 'العلاقات العامة')] }
  ]
};


/** Client testimonials live in src/testimonials.json (name, kind, initials, quote, each with en/ar). Only add quotes a client has approved in writing. */
const RAW = JSON.parse(readFileSync(new URL('./testimonials.json', import.meta.url), 'utf8'));
export const TESTIMONIALS = RAW.map((c) => ({ i: c.initials || String(c.name).split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(), n: L(c.name, c.name), k: L(c.kind.en, c.kind.ar), q: L(c.quote.en, c.quote.ar), date: c.date || '', role: c.role || '' }));
FIRM.clients = TESTIMONIALS;

const lab = {
  founded: L('Founded', 'تأسست'), years: L('Years of leadership experience', 'سنوات من الخبرة القيادية'), licensed: L('Licensed', 'مرخّصة'),
  licBody: L('Licensed by the Ministry of Human Resources & Social Development', 'مرخّصة من وزارة الموارد البشرية والتنمية الاجتماعية'),
  teamE: L('Our expert team', 'فريق خبرائنا'), teamT: L('Deep Saudi market knowledge, international business expertise', 'معرفة عميقة بالسوق السعودي وخبرة في الأعمال الدولية'),
  teamB: L('Five practitioners across strategy, law, branding, real estate and communications.', 'خمسة ممارسين في الاستراتيجية والقانون والعلامات التجارية والعقار والاتصال.'),
  cliE: L('What our clients say', 'ماذا يقول عملاؤنا'), cliT: L('Real businesses that trusted us with their entry', 'شركات حقيقية وثقت بنا في دخولها السوق'),
  cliN: L('Quotes are shared by the clients named, as published by the firm.', 'الاقتباسات مقدَّمة من العملاء المذكورين، كما نشرتها الشركة.'),
  vmE: L('Vision & mission', 'الرؤية والرسالة'), vis: L('Vision', 'الرؤية'), mis: L('Mission', 'الرسالة'),
  whyE: L('Why Growth Blueprint', 'لماذا غروث بلوبرينت'), whyT: L('Clarity, confidence and connections', 'الوضوح والثقة والعلاقات')
};

export const proofStrip = (ctx) => `<section class="proof" aria-label="${esc(ctx.t(L('Firm facts', 'عن الشركة')))}"><div class="container container--wide"><dl class="proof__in">
  <div><dt>${T(ctx, lab.founded)}</dt><dd>${FIRM.founded}</dd></div>
  <div><dt>${T(ctx, lab.years)}</dt><dd>${FIRM.years}</dd></div>
  <div><dt>${T(ctx, lab.licensed)}</dt><dd dir="ltr">#${FIRM.licence}</dd></div>
  <div><dt>${T(ctx, L('Based in', 'مقرنا'))}</dt><dd>${T(ctx, L('Jeddah', 'جدة'))}</dd></div></dl>
  <p class="proof__note">${T(ctx, lab.licBody)}</p></div></section>`;

export const vision = (ctx) => `<section class="sec sec--ivory" aria-labelledby="vm-t"><div class="container container--wide">
  ${sectionHead(ctx, { eyebrow: lab.vmE, title: FIRM.gateway, id: 'vm-t' })}
  <div class="vm"><article><h3 class="h4">${T(ctx, lab.vis)}</h3><p>${T(ctx, FIRM.vision)}</p></article><article><h3 class="h4">${T(ctx, lab.mis)}</h3><p>${T(ctx, FIRM.mission)}</p></article></div>
  <ul class="fwhy">${FIRM.why.map((w) => `<li><span>${icon(w.icon)}</span><h3 class="h4">${T(ctx, w.t)}</h3><p>${T(ctx, w.d)}</p></li>`).join('')}</ul>
</div></section>`;

export const team = (ctx, tone = 'sec--deep') => `<section class="sec ${tone}" aria-labelledby="tm-t"><div class="container container--wide">
  ${sectionHead(ctx, { eyebrow: lab.teamE, title: lab.teamT, body: lab.teamB, id: 'tm-t', tone: tone === 'sec--ivory' ? 'light' : 'dark' })}
  <ul class="team">${FIRM.team.map((m) => `<li class="member">${m.photo ? `<img class="member__ph" src="${ctx.asset('team/' + m.photo)}" alt="" width="72" height="72" loading="lazy">` : `<span class="member__av" aria-hidden="true">${m.i}</span>`}<h3 class="h4">${T(ctx, m.n)}</h3><p class="member__r">${T(ctx, m.r)}</p><p class="member__b">${T(ctx, m.b)}</p><p class="member__tags">${m.tags.map((t) => `<span>${T(ctx, t)}</span>`).join('')}</p></li>`).join('')}</ul>
  <p class="proof__note proof__note--c">${T(ctx, lab.licBody)} · <span dir="ltr">#${FIRM.licence}</span></p>
</div></section>`;

export const clients = (ctx) => `<section class="sec sec--ivory" aria-labelledby="cl-t"><div class="container container--wide">
  ${sectionHead(ctx, { eyebrow: lab.cliE, title: lab.cliT, id: 'cl-t' })}
  <div class="qs" role="region" aria-roledescription="carousel" aria-label="${esc(ctx.t(lab.cliE))}" data-qs data-qs-interval="3000">
    <ul class="quotes qs__track" tabindex="0" data-qs-track>${TESTIMONIALS.map((c, n) => `<li aria-label="${n + 1} / ${TESTIMONIALS.length}"><blockquote><p>${T(ctx, c.q)}</p></blockquote><footer><span class="member__av member__av--sm" aria-hidden="true">${c.i}</span><b>${T(ctx, c.n)}</b><i>${T(ctx, c.role ? L(c.role + ', ' + c.k.en, c.role + '، ' + c.k.ar) : c.k)}</i></footer></li>`).join('')}</ul>
    <div class="qs__ctl"><button type="button" class="qs__btn" data-qs-prev aria-label="${esc(ctx.t(L('Previous testimonials', 'الشهادات السابقة')))}">${icon('arrowLeft')}</button><button type="button" class="qs__btn" data-qs-next aria-label="${esc(ctx.t(L('Next testimonials', 'الشهادات التالية')))}">${icon('arrowRight')}</button><button type="button" class="qs__btn qs__btn--pp" data-qs-pause aria-pressed="false" aria-label="${esc(ctx.t(L('Pause automatic sliding', 'إيقاف التمرير التلقائي')))}">${icon('pause')}</button><span class="qs__count" aria-live="polite" data-qs-count></span></div>
  </div>
  <p class="proof__note proof__note--c">${T(ctx, lab.cliN)}</p>
</div></section>`;

export const hoursBlock = (ctx) => `<ul class="hours">${FIRM.hours.map((h) => `<li><span>${T(ctx, h.d)}</span><b>${T(ctx, h.t)}</b></li>`).join('')}<li class="hours__tz">${T(ctx, FIRM.tz)}</li></ul>`;
