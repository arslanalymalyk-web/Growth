// Regulatory explainers. General information only; written in plain language and dated.
// Rules change: each page says so and sends readers to the authority or a qualified adviser.
import { L } from './ui.mjs';

const REL = ['market-entry-guidance', 'market-intelligence', 'strategic-introductions', 'cultural-business-advisory'];
const NOTE = L('General information, written in October 2026. Rules change, so confirm the current requirements with the relevant authority or a qualified adviser before you act.', 'معلومات عامة كُتبت في أكتوبر 2026. الأنظمة تتغير، لذا تأكد من المتطلبات الحالية لدى الجهة المختصة أو مستشار مؤهل قبل أن تتصرف.');

export const REG_ARTICLES = [
  {
    slug: 'foreign-investment-licence-explained', cat: 'regulatory', img: 'ins-rocks', hero: 'hero-skyline-wide', thumb: 'p-insight3', bodyImg: 'sq-palms-fort',
    title: L('The foreign investment licence, in plain English', 'ترخيص الاستثمار الأجنبي بلغة واضحة'),
    excerpt: L('What the licence is, who issues it, and the questions to settle before you apply.', 'ما هو الترخيص، ومن يصدره، والأسئلة التي تحسمها قبل التقديم.'),
    lead: L('A short guide for investors who are hearing the word “licence” for the first time.', 'دليل قصير للمستثمرين الذين يسمعون كلمة «ترخيص» لأول مرة.'),
    intro: [L('Most foreign companies that want to operate in Saudi Arabia begin with an investment licence from the Ministry of Investment (MISA). It is the first formal step, and a clear head before you apply saves time later.', 'تبدأ معظم الشركات الأجنبية التي تريد العمل في السعودية بترخيص استثمار من وزارة الاستثمار. إنها الخطوة الرسمية الأولى، والوضوح قبل التقديم يوفر وقتًا لاحقًا.'), NOTE],
    sections: [
      { icon: 'doc', img: 'sq1', h: L('What the licence does', 'ماذا يفعل الترخيص'), p: [L('It authorises a foreign investor to carry out defined activities in the Kingdom. The activities you list matter: they shape what you can do and what other approvals you may need.', 'يخوّل المستثمر الأجنبي ممارسة أنشطة محددة في المملكة. والأنشطة التي تدرجها مهمة: فهي تحدد ما يمكنك فعله وما قد تحتاجه من موافقات أخرى.')] },
      { icon: 'scale', img: 'sq2', h: L('Sector rules differ', 'تختلف قواعد القطاعات'), p: [L('Some activities are open to full foreign ownership, some have conditions, and some need extra approvals from a sector regulator. Check your own sector early rather than assuming.', 'بعض الأنشطة مفتوحة للملكية الأجنبية الكاملة، وبعضها له شروط، وبعضها يحتاج موافقات إضافية من جهة تنظيمية قطاعية. تحقق من قطاعك مبكرًا ولا تفترض.')] },
      { icon: 'clipboard', img: 'sq3', h: L('Questions to settle before you apply', 'أسئلة تحسمها قبل التقديم'), p: [L('What will the Saudi entity actually do? Who owns it, and through which group companies? Which regulators are involved? Who will sign and who will manage? Having these answers ready makes the process smoother.', 'ماذا ستفعل الجهة السعودية فعلًا؟ من يملكها وعبر أي شركات في المجموعة؟ ما الجهات التنظيمية المعنية؟ من سيوقّع ومن سيدير؟ إعداد هذه الإجابات يجعل العملية أسلس.')] }
    ],
    conclusion: [L('The licence is a gate, not the whole journey. We help you work out your route, then coordinate the legal and accounting specialists who carry out the formal steps.', 'الترخيص بوابة وليس الرحلة كلها. نساعدك على تحديد مسارك، ثم ننسق المتخصصين القانونيين والمحاسبيين الذين ينفذون الخطوات الرسمية.')],
    related: REL
  },
  {
    slug: 'regional-headquarters-programme', cat: 'regulatory', img: 'ins-skyline', hero: 'hero-riyadh-bridge', thumb: 'p-insight1', bodyImg: 'sq-palms-fort',
    title: L('The Regional Headquarters programme: does it affect you?', 'برنامج المقرات الإقليمية: هل يعنيك؟'),
    excerpt: L('Why selling to government entities can change where you need to be based.', 'لماذا قد يغيّر البيع للجهات الحكومية المكان الذي يلزم أن تتخذه مقرًا.'),
    lead: L('A practical look at a rule that matters most to companies hoping to win public-sector work.', 'نظرة عملية إلى قاعدة تهم خصوصًا الشركات التي تأمل في الفوز بأعمال القطاع العام.'),
    intro: [L('The Kingdom has said that, with exceptions, government entities will contract with international companies that have a regional headquarters in Saudi Arabia. For some businesses this changes the entry plan completely; for others it does not matter at all.', 'أعلنت المملكة أن الجهات الحكومية، مع استثناءات، ستتعاقد مع الشركات الدولية التي لها مقر إقليمي في السعودية. وهذا يغيّر خطة الدخول تمامًا لبعض الأعمال، ولا يهم إطلاقًا لغيرها.'), NOTE],
    sections: [
      { icon: 'target', img: 'sq4', h: L('Who it matters to', 'لمن يهم هذا'), p: [L('Mainly to companies that expect a large share of revenue from government contracts. If your customers are private businesses or consumers, it may not apply to you.', 'يهم أساسًا الشركات التي تتوقع حصة كبيرة من إيراداتها من العقود الحكومية. وإن كان عملاؤك شركات خاصة أو مستهلكين فقد لا ينطبق عليك.')] },
      { icon: 'building', img: 'sq5', h: L('What to work out first', 'ما الذي تحدده أولًا'), p: [L('How much of your plan depends on public-sector buyers? What would a regional headquarters need to look like for you: people, functions, premises? And what are the costs and the incentives?', 'ما مقدار اعتماد خطتك على مشترين من القطاع العام؟ وكيف يجب أن يبدو المقر الإقليمي لديك: أشخاص ووظائف ومقرات؟ وما التكاليف والحوافز؟')] },
      { icon: 'check', img: 'sq6', h: L('Check the current detail', 'تحقق من التفاصيل الحالية'), p: [L('Conditions, exceptions and timing have been updated before. Always confirm the current position with the authority before you decide.', 'سبق أن تحدّثت الشروط والاستثناءات والمواعيد. تأكد دائمًا من الموقف الحالي لدى الجهة المختصة قبل أن تقرر.')] }
    ],
    conclusion: [L('Whether to open a regional headquarters is a strategic decision, not a box to tick. We help you test it against your real revenue plan.', 'فتح مقر إقليمي قرار استراتيجي لا خانة تُعلَّم. نساعدك على اختباره أمام خطة إيراداتك الفعلية.')],
    related: REL
  },
  {
    slug: 'saudisation-and-nitaqat-hiring-plan', cat: 'regulatory', img: 'ins-wall', hero: 'hero-man-skyline', thumb: 'p-insight2', bodyImg: 'sq-palms-fort',
    title: L('Saudisation and Nitaqat: what it means for your hiring plan', 'التوطين ونطاقات: ماذا يعني لخطة التوظيف'),
    excerpt: L('How Saudi-national employment targets shape the way you build a team.', 'كيف تشكّل مستهدفات توظيف المواطنين السعوديين طريقة بناء فريقك.'),
    lead: L('Build it into your plan on day one, not after your first inspection.', 'ضعه في خطتك من اليوم الأول، لا بعد أول تفتيش.'),
    intro: [L('Saudi Arabia expects private-sector employers to hire Saudi nationals. The Nitaqat system sorts companies into bands according to the share of Saudis they employ, and the band affects which services and visas a company can use.', 'تتوقع السعودية من أصحاب العمل في القطاع الخاص توظيف مواطنين سعوديين. ويصنّف نظام نطاقات الشركات في نطاقات بحسب نسبة السعوديين لديها، ويؤثر النطاق في الخدمات والتأشيرات المتاحة للشركة.'), NOTE],
    sections: [
      { icon: 'users', img: 'sq7', h: L('Targets depend on your activity and size', 'تختلف المستهدفات بحسب نشاطك وحجمك'), p: [L('Required percentages vary by sector and company size, and they are revised from time to time. Ask for the figures that apply to your activity.', 'تختلف النسب المطلوبة بحسب القطاع وحجم الشركة، وتُراجع من حين إلى آخر. اسأل عن الأرقام التي تنطبق على نشاطك.')] },
      { icon: 'chart', img: 'sq1', h: L('Plan the team, not just the headcount', 'خطط للفريق لا للعدد فقط'), p: [L('Think about which roles suit Saudi hires, how you will recruit and develop them, and who will lead. A good team plan treats this as a strength, not only a requirement.', 'فكّر في الأدوار المناسبة للتوظيف السعودي، وكيف ستستقطبهم وتطوّرهم، ومن سيقودهم. الخطة الجيدة للفريق تعدّ ذلك قوة لا مجرد متطلب.')] },
      { icon: 'handshake', img: 'sq2', h: L('Talk to specialists early', 'تحدث مع المتخصصين مبكرًا'), p: [L('Recruitment and employment-law specialists in our network can help you set realistic numbers and timelines.', 'يمكن للمتخصصين في التوظيف وأنظمة العمل في شبكتنا أن يساعدوك على تحديد أرقام وجداول واقعية.')] }
    ],
    conclusion: [L('The earlier hiring is part of the plan, the fewer surprises later. We can help you frame the questions to ask the specialists.', 'كلما دخل التوظيف الخطة مبكرًا قلّت المفاجآت لاحقًا. ويمكننا أن نساعدك في صياغة الأسئلة التي تطرحها على المتخصصين.')],
    related: REL
  },
  {
    slug: 'zakat-tax-and-vat-basics', cat: 'regulatory', img: 'palms-arch', hero: 'hero-skyline-dusk', thumb: 'p-insight3', bodyImg: 'sq-palms-fort',
    title: L('Zakat, tax and VAT: the basics for a new Saudi entity', 'الزكاة والضريبة وضريبة القيمة المضافة: أساسيات لكيان سعودي جديد'),
    excerpt: L('The three obligations that surprise newcomers, and who deals with them.', 'ثلاثة التزامات تفاجئ القادمين الجدد، ومن يتعامل معها.'),
    lead: L('A first orientation before you speak to your accountant.', 'توجيه أولي قبل أن تتحدث إلى محاسبك.'),
    intro: [L('The Zakat, Tax and Customs Authority (ZATCA) administers zakat, income tax, VAT and customs. For a new entity the first job is simply knowing which of them apply to you.', 'تتولى هيئة الزكاة والضريبة والجمارك إدارة الزكاة وضريبة الدخل وضريبة القيمة المضافة والجمارك. والمهمة الأولى لكيان جديد أن يعرف أيها ينطبق عليه.'), NOTE],
    sections: [
      { icon: 'coins', img: 'sq3', h: L('Zakat and income tax', 'الزكاة وضريبة الدخل'), p: [L('In general, the Saudi and GCC-owned share of a company is subject to zakat, and the foreign-owned share to income tax. Your ownership structure therefore matters.', 'بوجه عام، تخضع حصة الملكية السعودية والخليجية في الشركة للزكاة، وتخضع حصة الملكية الأجنبية لضريبة الدخل. لذلك تهم هيكلة الملكية.')] },
      { icon: 'doc', img: 'sq4', h: L('VAT', 'ضريبة القيمة المضافة'), p: [L('VAT is charged at 15% on most goods and services, and businesses above the registration threshold must register, charge, file and keep proper invoices. E-invoicing rules also apply.', 'تُفرض ضريبة القيمة المضافة بنسبة 15% على معظم السلع والخدمات، وعلى المنشآت التي تتجاوز حد التسجيل أن تسجّل وتحصّل وتقدّم الإقرارات وتحتفظ بفواتير سليمة. وتنطبق أيضًا قواعد الفوترة الإلكترونية.')] },
      { icon: 'shield', img: 'sq5', h: L('Payments abroad', 'المدفوعات إلى الخارج'), p: [L('Payments to non-residents, such as management fees or royalties, can attract withholding tax. Check before you structure intra-group charges.', 'قد تخضع المدفوعات لغير المقيمين، مثل الرسوم الإدارية أو الإتاوات، لضريبة استقطاع. تحقق قبل هيكلة الرسوم بين شركات المجموعة.')] }
    ],
    conclusion: [L('We are advisers, not tax accountants. We help you ask the right questions and connect you with qualified accounting specialists.', 'نحن مستشارون ولسنا محاسبين ضريبيين. نساعدك على طرح الأسئلة الصحيحة ونصلك بمتخصصين محاسبيين مؤهلين.')],
    related: REL
  }
];
