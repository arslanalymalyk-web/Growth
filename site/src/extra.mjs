// Extra pages: how we work, team, investor FAQ, work with us.
import { L, UI, SITE } from './ui.mjs';
import { icon } from './icons.mjs';
import { SITE_URL, esc, shell, hero, ctaBand, btn, eyebrow, sectionHead, faq } from './render.mjs';
import { FIRM, vision } from './firm.mjs';

const T = (ctx, v) => esc(ctx.t(v));
const crumbs = (ctx, label) => [{ label: UI.breadcrumbHome, href: ctx.href('') }, { label }];

/* ---------------- How we work ---------------- */
export const HOW = {
  meta: { title: L('How We Work | Growth Blueprint', 'كيف نعمل | غروث بلوبرينت'), description: L('From a free 30-minute consultation to delivery: how an engagement with Growth Blueprint works.', 'من استشارة مجانية مدتها 30 دقيقة إلى التنفيذ: كيف تسير مهمة مع غروث بلوبرينت.') },
  hero: { eyebrow: L('How we work', 'كيف نعمل'), title: L('Clear steps, agreed in writing', 'خطوات واضحة، متفق عليها كتابةً'), lead: L('You should know what you are buying before you buy it. Here is how an engagement runs, and what is and is not included.', 'ينبغي أن تعرف ما تشتريه قبل أن تشتريه. هكذا تسير المهمة، وما الذي يشمله عملنا وما لا يشمله.'), img: 'hero-riyadh-sunset' },
  steps: [
    { icon: 'chat', t: L('1. Free 30-minute consultation', '1. استشارة مجانية مدتها 30 دقيقة'), d: L('We listen, ask questions and tell you honestly whether and how we can help. No obligation.', 'نصغي ونسأل ونخبرك بصدق هل نستطيع مساعدتك وكيف. بلا التزام.') },
    { icon: 'clipboard', t: L('2. Scope and proposal', '2. النطاق والعرض'), d: L('If we can help, we write down the questions, the deliverables and the fee, and agree them with you before any work starts.', 'إن استطعنا المساعدة كتبنا الأسئلة والمخرجات والأتعاب واتفقنا عليها معك قبل بدء أي عمل.') },
    { icon: 'gear', t: L('3. Delivery', '3. التنفيذ'), d: L('We do the work, bring in the right specialists from our network, and keep you updated.', 'ننفذ العمل ونستعين بالمتخصصين المناسبين من شبكتنا ونبقيك على اطلاع.') },
    { icon: 'check', t: L('4. Review and next step', '4. المراجعة والخطوة التالية'), d: L('We walk you through the results and agree what, if anything, comes next.', 'نستعرض معك النتائج ونتفق على الخطوة التالية إن وُجدت.') }
  ],
  incTitle: L('What is included', 'ما الذي يشمله عملنا'), notTitle: L('What is not included', 'ما الذي لا يشمله'),
  inc: [L('Advice and deliverables as set out in the written scope', 'المشورة والمخرجات كما في النطاق المكتوب'), L('Coordination with the specialists in our network', 'التنسيق مع متخصصي شبكتنا'), L('Honest views, including “not yet”', 'آراء صريحة، بما فيها «ليس بعد»')],
  not: [L('Legal opinions or filings: these come from qualified lawyers', 'الآراء القانونية أو الإجراءات: تصدر من محامين مؤهلين'), L('Government or licensing fees, and third-party specialist fees, unless agreed', 'الرسوم الحكومية ورسوم التراخيص ورسوم المتخصصين الخارجيين ما لم يُتفق على غير ذلك'), L('Guaranteed outcomes or introductions to named organisations', 'نتائج مضمونة أو تعريف بجهات بعينها')],
  feeTitle: L('How we price', 'كيف نسعّر'), feeBody: L('We quote each engagement after the free consultation, once we understand the scope. We agree the scope, the deliverables and the fee in writing before work starts, so there are no surprises.', 'نعرض سعرًا لكل مهمة بعد الاستشارة المجانية، حين نفهم النطاق. ونتفق كتابةً على النطاق والمخرجات والأتعاب قبل بدء العمل، فلا مفاجآت.'),
  faqs: [{ q: L('Is the first consultation really free?', 'هل الاستشارة الأولى مجانية فعلًا؟'), a: L('Yes. It lasts 30 minutes, online or in person, with no obligation.', 'نعم. مدتها 30 دقيقة، عبر الإنترنت أو حضوريًا، بلا التزام.') }, { q: L('What should I bring?', 'ماذا أُحضر؟'), a: L('Your goals, your biggest questions, and any background you think is useful. Nothing else is required.', 'أهدافك وأكبر أسئلتك وأي معلومات تراها مفيدة. لا شيء غير ذلك.') }, { q: L('Who will I deal with?', 'مع من سأتعامل؟'), a: L('You will meet senior members of our team, and be introduced to the specialists who work on your question.', 'ستقابل كبار أعضاء فريقنا، وسنعرّفك بالمتخصصين الذين يعملون على سؤالك.') }]
};

export function howWeWork(ctx) {
  const H = HOW;
  const body = `
${hero(ctx, { ...H.hero, crumbs: crumbs(ctx, L('How we work', 'كيف نعمل')), ctas: [btn(ctx, UI.book, 'book-a-meeting/', 'gold')] })}
<section class="sec sec--ivory"><div class="container container--wide"><ol class="jsteps">${H.steps.map((s, i) => `<li><span class="jstep__n">0${i + 1}</span><span class="jstep__c">${icon(s.icon)}</span><h2 class="h4">${T(ctx, s.t)}</h2><p>${T(ctx, s.d)}</p></li>`).join('')}</ol></div></section>
<section class="sec sec--deep"><div class="container container--wide two-col">
  <div><h2 class="h3 h3--lg">${T(ctx, H.incTitle)}</h2><ul class="ic-list ic-list--wf">${H.inc.map((x) => `<li><span class="ic-list__i">${icon('check')}</span><span>${T(ctx, x)}</span></li>`).join('')}</ul></div>
  <div class="two-col__r"><h2 class="h3 h3--lg">${T(ctx, H.notTitle)}</h2><ul class="ic-list ic-list--ch">${H.not.map((x) => `<li><span class="ic-list__i">${icon('shield')}</span><span>${T(ctx, x)}</span></li>`).join('')}</ul></div>
</div></section>
<section class="sec sec--ivory"><div class="container container--wide split"><div>${eyebrow(ctx, L('Fees', 'الأتعاب'), 'eyebrow--rule')}<h2 class="h2">${T(ctx, H.feeTitle)}</h2><p class="lead">${T(ctx, H.feeBody)}</p></div><div class="faq-wrap">${faq(ctx, H.faqs)}</div></div></section>
${ctaBand(ctx, { eyebrow: L("Let's talk", 'لنتحدث'), title: L('Start with a free 30-minute consultation', 'ابدأ باستشارة مجانية مدتها 30 دقيقة'), body: L('Tell us what you are trying to do. We will tell you honestly how we can help.', 'أخبرنا بما تحاول فعله. وسنقول لك بصدق كيف نستطيع المساعدة.'), img: 'band-man-desert' })}`;
  return shell(ctx, { title: H.meta.title, description: H.meta.description, active: 'about', body });
}

/* ---------------- Team ---------------- */
export function teamPage(ctx) {
  const t = L('Our expert team', 'فريق خبرائنا');
  const body = `
${hero(ctx, { eyebrow: L('Team', 'الفريق'), title: t, lead: L('Experienced professionals with deep Saudi market knowledge and international business expertise.', 'محترفون ذوو خبرة بمعرفة عميقة بالسوق السعودي وخبرة في الأعمال الدولية.'), img: 'office-lobby', crumbs: crumbs(ctx, t) })}
<section class="sec sec--deep"><div class="container container--wide"><ul class="team team--wide">${FIRM.team.map((m) => `<li class="member">${m.photo ? `<img class="member__ph" src="${ctx.asset('team/' + m.photo)}" alt="${esc(ctx.t(m.n))}" width="96" height="96" loading="lazy">` : `<span class="member__av" aria-hidden="true">${m.i}</span>`}<h2 class="h4">${T(ctx, m.n)}</h2><p class="member__r">${T(ctx, m.r)}</p><p class="member__b">${T(ctx, m.b)}</p><p class="member__tags">${m.tags.map((x) => `<span>${T(ctx, x)}</span>`).join('')}</p></li>`).join('')}</ul>
<p class="proof__note proof__note--c">${T(ctx, FIRM.licenceBody)} · <span dir="ltr">#${FIRM.licence}</span></p></div></section>
${vision(ctx)}
${ctaBand(ctx, { eyebrow: L("Let's talk", 'لنتحدث'), title: L('Meet the team in a free consultation', 'تعرّف على الفريق في استشارة مجانية'), img: 'cta-rocks-dark' })}`;
  return shell(ctx, { title: L('Our Team | Growth Blueprint', 'فريقنا | غروث بلوبرينت'), description: L('Five practitioners across strategy, law, branding, real estate and communications.', 'خمسة ممارسين في الاستراتيجية والقانون والعلامات التجارية والعقار والاتصال.'), active: 'about', body, jsonld: FIRM.team.map((m) => ({ '@context': 'https://schema.org', '@type': 'Person', name: m.n.en, jobTitle: m.r.en, description: m.b.en, worksFor: { '@type': 'Organization', name: 'Growth Blueprint' } })) });
}

/* ---------------- Investor FAQ ---------------- */
export const FAQS = [
  { q: L('Can a foreign company own 100% of a business in Saudi Arabia?', 'هل يمكن لشركة أجنبية تملّك 100% من نشاط في السعودية؟'), a: L('In many sectors, yes. Some activities carry conditions or need extra approvals, so the answer depends on your sector. We help you check it early.', 'في كثير من القطاعات نعم. وبعض الأنشطة لها شروط أو تحتاج موافقات إضافية، لذا تعتمد الإجابة على قطاعك. نساعدك على التحقق منها مبكرًا.') },
  { q: L('Do I need a local partner?', 'هل أحتاج شريكًا محليًا؟'), a: L('Not always. A partner can bring knowledge, relationships and speed, and some businesses choose one for those reasons. We help you weigh it.', 'ليس دائمًا. قد يقدّم الشريك المعرفة والعلاقات والسرعة، وبعض الأعمال تختاره لهذه الأسباب. نساعدك على الموازنة.') },
  { q: L('How long does it take to set up?', 'كم يستغرق التأسيس؟'), a: L('It depends on your sector, your structure and how ready your documents are. We would rather give you a realistic estimate for your case than a headline number.', 'يعتمد على قطاعك وهيكلك ومدى جاهزية مستنداتك. نفضّل أن نعطيك تقديرًا واقعيًا لحالتك على أن نعطيك رقمًا دعائيًا.') },
  { q: L('Do you handle the legal filings?', 'هل تتولون الإجراءات القانونية؟'), a: L('Our network includes legal advisers who can. We coordinate them so you deal with one team.', 'تضم شبكتنا مستشارين قانونيين يتولونها. وننسق معهم لتتعامل مع فريق واحد.') },
  { q: L('Can you guarantee a result?', 'هل تضمنون نتيجة؟'), a: L('No. We give honest advice and careful preparation. Outcomes depend on many things outside anyone’s control.', 'لا. نقدّم مشورة صادقة وتحضيرًا دقيقًا. أما النتائج فتعتمد على عوامل كثيرة خارج سيطرة أي أحد.') },
  { q: L('Is Vision 2030 relevant to my business?', 'هل تهم رؤية 2030 أعمالي؟'), a: L('Possibly. Vision 2030 priorities are opening sectors such as tourism, healthcare, manufacturing, logistics and technology. We show you where your idea fits and where it does not.', 'ربما. فأولويات رؤية 2030 تفتح قطاعات مثل السياحة والصحة والصناعة والخدمات اللوجستية والتقنية. نوضح لك أين تتوافق فكرتك وأين لا تتوافق.') },
  { q: L('Do I need to speak Arabic?', 'هل أحتاج إلى التحدث بالعربية؟'), a: L('No, but it helps to have people who do. Our team and network work in both Arabic and English.', 'لا، لكن من المفيد أن يكون معك من يتحدثها. فريقنا وشبكتنا يعملان بالعربية والإنجليزية.') },
  { q: L('Can I pay online for an advisory session?', 'هل يمكنني دفع ثمن جلسة استشارية عبر الإنترنت؟'), a: L('Yes. You can book a single 60-minute session or a bundle of three, choose a time and pay by card. The price, including VAT, is shown before you pay.', 'نعم. يمكنك حجز جلسة واحدة مدتها 60 دقيقة أو حزمة من ثلاث، وتحديد الموعد والدفع بالبطاقة. ويظهر السعر شاملًا الضريبة قبل الدفع.') },
  { q: L('What if I need to change the time?', 'ماذا لو احتجت إلى تغيير الموعد؟'), a: L('You can reschedule free of charge up to 24 hours before the session, from your confirmation page.', 'يمكنك إعادة الجدولة مجانًا حتى 24 ساعة قبل الجلسة، من صفحة التأكيد.') },
  { q: L('Where are you based?', 'أين مقركم؟'), a: L('Our office is in Jeddah (Optima Tower, Al-Shatie District). We meet clients online and in person.', 'مكتبنا في جدة (برج أوبتيما، حي الشاطئ). نقابل العملاء عبر الإنترنت وحضوريًا.') },
  { q: L('What do you do with the information I share?', 'ماذا تفعلون بالمعلومات التي أشاركها؟'), a: L('We use it to answer you and to deliver the work, and we explain our practices in the Privacy Notice.', 'نستخدمها للرد عليك وتنفيذ العمل، ونشرح ممارساتنا في إشعار الخصوصية.') }
];
export function faqPage(ctx) {
  const t = L('Investor FAQ', 'أسئلة المستثمرين الشائعة');
  const body = `
${hero(ctx, { eyebrow: L('FAQ', 'الأسئلة الشائعة'), title: t, lead: L('Straight answers to the questions international investors ask us most.', 'إجابات مباشرة عن أكثر الأسئلة التي يطرحها علينا المستثمرون الدوليون.'), img: 'hero-man-light', crumbs: crumbs(ctx, t) })}
<section class="sec sec--ivory"><div class="container container--md">${faq(ctx, FAQS)}<p class="proof__note proof__note--c">${T(ctx, L('General information. Rules change; confirm current requirements with the relevant authority or a qualified adviser.', 'معلومات عامة. الأنظمة تتغير؛ تأكد من المتطلبات الحالية لدى الجهة المختصة أو مستشار مؤهل.'))}</p></div></section>
${ctaBand(ctx, { eyebrow: L('Still have a question?', 'ما زال لديك سؤال؟'), title: L('Ask us in a free consultation', 'اسألنا في استشارة مجانية'), img: 'cta-cliffs-light' })}`;
  return shell(ctx, { title: L('Investor FAQ | Growth Blueprint', 'أسئلة المستثمرين | غروث بلوبرينت'), description: L('Straight answers on ownership, partners, setup and more.', 'إجابات مباشرة عن الملكية والشركاء والتأسيس وغيرها.'), active: 'about', body, jsonld: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: ctx.t(f.q), acceptedAnswer: { '@type': 'Answer', text: ctx.t(f.a) } })) }] });
}

/* ---------------- Work with us ---------------- */
export function workWithUs(ctx) {
  const t = L('Work with us', 'اعمل معنا');
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent('Work with Growth Blueprint')}`;
  const body = `
${hero(ctx, { eyebrow: L('Partners & specialists', 'الشركاء والمتخصصون'), title: t, lead: L('We work with a network of lawyers, accountants and sector specialists. If you serve international investors in Saudi Arabia, we would like to hear from you.', 'نعمل مع شبكة من المحامين والمحاسبين والمتخصصين في القطاعات. إن كنت تخدم مستثمرين دوليين في السعودية فيسعدنا أن نسمع منك.'), img: 'meeting-window', crumbs: crumbs(ctx, t) })}
<section class="sec sec--ivory"><div class="container container--md"><h2 class="h2">${T(ctx, L('Who we look for', 'من نبحث عنه'))}</h2>
<ul class="ic-list ic-list--wf">${[L('Legal, tax and accounting firms', 'مكاتب القانون والضرائب والمحاسبة'), L('Sector specialists and former operators', 'متخصصون في القطاعات ومشغّلون سابقون'), L('Recruitment, relocation and property partners', 'شركاء التوظيف والانتقال والعقار'), L('Event, media and roadshow organisers', 'منظمو الفعاليات والإعلام وجولات الأعمال')].map((x) => `<li><span class="ic-list__i">${icon('check')}</span><span>${T(ctx, x)}</span></li>`).join('')}</ul>
<p class="body-p">${T(ctx, L('Send a short note about your firm and the investors you serve. We reply personally.', 'أرسل نبذة قصيرة عن شركتك والمستثمرين الذين تخدمهم. وسنرد عليك شخصيًا.'))}</p>
<p><a class="btn btn--gold" href="${mail}"><span>${T(ctx, L('Email us', 'راسلنا'))}</span></a></p></div></section>`;
  return shell(ctx, { title: L('Work With Us | Growth Blueprint', 'اعمل معنا | غروث بلوبرينت'), description: L('Partners and specialists who serve international investors in Saudi Arabia.', 'شركاء ومتخصصون يخدمون المستثمرين الدوليين في السعودية.'), active: 'about', body });
}
