import { L } from './ui.mjs';

export const STAGES = [
  {
    id: 'enter', label: L('Enter', 'الدخول'), heading: L('Build your foundation', 'ابنِ أساسك'),
    body: L('Set a clear market path and establish your presence with confidence.', 'حدّد مسارك في السوق وأسّس حضورك بثقة.'),
    ideal: L('Businesses exploring Saudi Arabia, validating opportunities or setting up a local presence.', 'شركات تستكشف المملكة أو تختبر الفرص أو تؤسس حضورًا محليًا.')
  },
  {
    id: 'operate', label: L('Operate', 'التشغيل'), heading: L('Turn plans into progress', 'حوّل الخطط إلى تقدّم'),
    body: L('Build capability, establish partnerships and run your business effectively and compliantly.', 'ابنِ القدرات وأقم الشراكات وأدر أعمالك بكفاءة والتزام.'),
    ideal: L('Businesses establishing operations, building teams and scaling day-to-day activity in Saudi Arabia.', 'شركات تؤسس عملياتها وتبني فرقها وتوسّع نشاطها اليومي في المملكة.')
  },
  {
    id: 'grow', label: L('Grow', 'النمو'), heading: L('Scale for a bigger tomorrow', 'توسّع لغدٍ أكبر'),
    body: L('Strengthen your market position and unlock long-term value through brand, people and technology.', 'عزّز مكانتك في السوق وحقّق قيمة طويلة الأمد عبر العلامة والكفاءات والتقنية.'),
    ideal: L('Businesses looking to expand, enhance market presence and accelerate growth in Saudi Arabia.', 'شركات تسعى للتوسع وتعزيز حضورها في السوق وتسريع نموها في المملكة.')
  }
];

const RESP = [
  { icon: 'doc', t: L('Provide required information and documentation', 'تزويدنا بالمعلومات والمستندات المطلوبة') },
  { icon: 'check', t: L('Timely review and approval of submissions', 'مراجعة المواد المقدّمة واعتمادها في الوقت المناسب') },
  { icon: 'users', t: L('Engage in key meetings with relevant stakeholders', 'المشاركة في الاجتماعات الرئيسية مع الجهات ذات العلاقة') },
  { icon: 'clipboard', t: L('Share business objectives and operational plans', 'مشاركة أهداف العمل والخطط التشغيلية') }
];
export const RESPONSIBILITIES = RESP;

export const SERVICES = [
  {
    slug: 'market-strategy-entry', stage: 'enter', icon: 'chart', card: 'svc-strategy', hero: 'hero-riyadh-bridge', heroPos: 'right center',
    title: L('Market Strategy & Entry', 'استراتيجية السوق والدخول'),
    short: L('Market insight, opportunity assessment and tailored entry strategies.', 'قراءة للسوق وتقييم للفرص واستراتيجيات دخول مصمَّمة لك.'),
    lead: L('A clear, evidence-based route into the Saudi market, from first assessment to a validated launch plan.', 'مسار واضح قائم على الأدلة للدخول إلى السوق السعودي، من التقييم الأولي إلى خطة إطلاق معتمدة.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('Know the market before you commit', 'اعرف السوق قبل أن تلتزم'), img: 'fort-tower',
      body: L('We help you understand demand, competition and regulation, compare entry models and choose a route that fits your objectives, risk appetite and timeline.', 'نساعدك على فهم الطلب والمنافسة والأنظمة، ومقارنة نماذج الدخول، واختيار المسار الأنسب لأهدافك وقدرتك على تحمل المخاطر وجدولك الزمني.') },
    whoFor: [
      L('International businesses evaluating Saudi Arabia for the first time', 'شركات دولية تقيّم المملكة للمرة الأولى'),
      L('Regional operators considering expansion into the Kingdom', 'شركات إقليمية تدرس التوسع في المملكة'),
      L('Investors validating a sector opportunity before committing capital', 'مستثمرون يتحققون من فرصة قطاعية قبل ضخ رأس المال'),
      L('Leadership teams preparing a board-ready market-entry case', 'فرق قيادية تُعدّ دراسة جدوى للدخول جاهزة لمجلس الإدارة')
    ],
    challenges: [
      L('Limited visibility of real demand and customer behaviour', 'محدودية الرؤية حول الطلب الفعلي وسلوك العملاء'),
      L('Unclear competitive landscape and pricing benchmarks', 'مشهد تنافسي ومعايير تسعير غير واضحة'),
      L('Choosing between a subsidiary, joint venture or partnership', 'الاختيار بين فرع تابع أو مشروع مشترك أو شراكة'),
      L('Translating ambition into a phased, fundable plan', 'ترجمة الطموح إلى خطة مرحلية قابلة للتمويل'),
      L('Understanding sector-specific regulation early enough', 'فهم الأنظمة الخاصة بالقطاع في وقت مبكر')
    ],
    scopeLead: L('Practical, hands-on support from first assessment to a validated launch plan.', 'دعم عملي ومباشر من التقييم الأولي إلى خطة إطلاق معتمدة.'),
    scope: [
      L('Market size, demand and growth analysis', 'تحليل حجم السوق والطلب والنمو'),
      L('Competitive landscape and benchmarking', 'تحليل المشهد التنافسي والمقارنات المرجعية'),
      L('Customer segmentation and value-proposition fit', 'تقسيم العملاء وملاءمة عرض القيمة'),
      L('Entry-model comparison and recommendation', 'مقارنة نماذج الدخول وتقديم التوصية'),
      L('Regulatory and licensing considerations', 'اعتبارات الأنظمة والتراخيص'),
      L('Financial outline and phased launch roadmap', 'الإطار المالي وخارطة طريق الإطلاق المرحلية')
    ],
    deliverables: [
      L('Market opportunity assessment', 'تقييم فرصة السوق'), L('Competitor and pricing benchmark', 'مقارنة المنافسين والأسعار'),
      L('Entry-model options paper', 'ورقة خيارات نماذج الدخول'), L('Phased launch roadmap', 'خارطة طريق إطلاق مرحلية'), L('Board-ready summary', 'ملخص جاهز لمجلس الإدارة')
    ],
    process: [
      { t: L('Understand', 'الفهم'), d: L('We clarify your objectives, constraints and the questions the decision depends on.', 'نوضح أهدافك وقيودك والأسئلة التي يعتمد عليها القرار.') },
      { t: L('Assess', 'التقييم'), d: L('We analyse the market, competitors and regulatory context for your sector.', 'نحلل السوق والمنافسين والسياق التنظيمي لقطاعك.') },
      { t: L('Compare', 'المقارنة'), d: L('We evaluate entry options against your objectives, risk and timeline.', 'نقيّم خيارات الدخول وفق أهدافك ومخاطرك وجدولك الزمني.') },
      { t: L('Recommend', 'التوصية'), d: L('We agree a recommended route and a practical, phased roadmap.', 'نتفق على المسار الموصى به وخارطة طريق عملية مرحلية.') }
    ],
    faqs: [
      { q: L('How long does a market-entry assessment take?', 'كم تستغرق دراسة جدوى الدخول إلى السوق؟'), a: L('Most assessments take between four and eight weeks depending on the sector and the depth of analysis required. We agree the scope and timeline with you at the start.', 'تستغرق معظم الدراسات من أربعة إلى ثمانية أسابيع بحسب القطاع وعمق التحليل المطلوب. نتفق معك على النطاق والجدول الزمني منذ البداية.') },
      { q: L('Do you only advise international companies?', 'هل تقدمون استشاراتكم للشركات الدولية فقط؟'), a: L('No. We also support regional and Saudi businesses planning new sectors or new markets within the Kingdom.', 'لا. ندعم أيضًا الشركات الإقليمية والسعودية التي تخطط لدخول قطاعات جديدة أو أسواق جديدة داخل المملكة.') },
      { q: L('Can you help us decide whether to enter at all?', 'هل يمكنكم مساعدتنا في تقرير الدخول من عدمه؟'), a: L('Yes. A candid recommendation, including not proceeding or deferring, is a valid outcome of the assessment.', 'نعم. التوصية الصريحة، بما فيها عدم المضي قدمًا أو التأجيل، نتيجة مقبولة للدراسة.') }
    ],
    related: ['formation-establishment', 'partnerships-commercial-development', 'governance-finance-compliance']
  },
  {
    slug: 'formation-establishment', stage: 'enter', icon: 'building', card: 'svc-formation', hero: 'hero-skyline-wide', heroPos: 'right center',
    title: L('Formation & Establishment', 'التأسيس والتأسيس القانوني'),
    short: L('End-to-end support for legal setup, licensing and initial structuring.', 'دعم شامل للتأسيس القانوني والترخيص والهيكلة الأولية.'),
    lead: L('A confident start in Saudi Arabia. End-to-end support to establish your business, so you can focus on what comes next.', 'بداية واثقة في المملكة. دعم شامل لتأسيس أعمالك لتتفرغ لما بعد ذلك.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('Build your presence in Saudi Arabia', 'ابنِ حضورك في المملكة'), img: 'curved-building',
      body: L('We support businesses in establishing a strong and compliant presence in Saudi Arabia, managing the end-to-end formation process and coordinating with relevant authorities, so you can start operations with clarity and confidence.', 'ندعم الشركات في تأسيس حضور قوي وملتزم في المملكة، وندير عملية التأسيس بالكامل وننسق مع الجهات ذات العلاقة، لتبدأ عملياتك بوضوح وثقة.') },
    whoFor: [
      L('International businesses entering the Saudi market', 'شركات دولية تدخل السوق السعودي'),
      L('Established companies setting up a local entity or subsidiary', 'شركات قائمة تؤسس كيانًا محليًا أو شركة تابعة'),
      L('Businesses seeking a compliant and efficient market entry', 'شركات تسعى لدخول سوق ملتزم وفعّال'),
      L('Organisations looking for end-to-end support from incorporation to operational readiness', 'منظمات تبحث عن دعم شامل من التأسيس حتى الجاهزية التشغيلية')
    ],
    challenges: [
      L('Navigating complex regulatory and licensing requirements', 'التعامل مع متطلبات تنظيمية وترخيصية معقدة'),
      L('Understanding the most suitable legal structure for your objectives', 'فهم الهيكل القانوني الأنسب لأهدافك'),
      L('Coordinating with multiple government entities', 'التنسيق مع عدة جهات حكومية'),
      L('Managing documentation and approval timelines', 'إدارة المستندات وجداول الموافقات'),
      L('Aligning establishment with sector-specific regulations', 'مواءمة التأسيس مع الأنظمة الخاصة بالقطاع')
    ],
    scopeLead: L('We provide practical, hands-on support throughout the formation and establishment process, tailored to your business needs and sector requirements.', 'نقدم دعمًا عمليًا ومباشرًا طوال عملية التأسيس، مصمَّمًا وفق احتياجات أعمالك ومتطلبات قطاعك.'),
    scope: [
      L('Entity structure assessment and recommendations', 'تقييم هيكل الكيان والتوصيات'),
      L('Commercial registration and licensing support', 'دعم السجل التجاري والترخيص'),
      L('Ongoing advisory until operational readiness', 'استشارات مستمرة حتى الجاهزية التشغيلية'),
      L('Preparation and submission of incorporation documentation', 'إعداد مستندات التأسيس وتقديمها'),
      L('Support with sector-specific approvals and requirements', 'دعم الموافقات والمتطلبات الخاصة بالقطاع'),
      L('Coordination with key stakeholders and service providers', 'التنسيق مع أصحاب المصلحة ومقدمي الخدمات'),
      L('Coordination with relevant government authorities', 'التنسيق مع الجهات الحكومية ذات العلاقة'),
      L('Guidance on post-establishment mandatory registrations', 'إرشاد حول التسجيلات الإلزامية بعد التأسيس'),
      L('Practical guidance on statutory and regulatory obligations', 'إرشاد عملي حول الالتزامات النظامية والتنظيمية')
    ],
    deliverables: [
      L('Recommended legal structure and setup plan', 'الهيكل القانوني الموصى به وخطة التأسيس'), L('Incorporation and registration filings', 'ملفات التأسيس والتسجيل'),
      L('Commercial registration and relevant licences', 'السجل التجاري والتراخيص ذات الصلة'), L('Supporting documentation and approval correspondence', 'المستندات الداعمة ومراسلات الموافقة'), L('Post-establishment compliance guidance', 'إرشادات الامتثال بعد التأسيس')
    ],
    process: [
      { t: L('Plan', 'التخطيط'), d: L('We understand your objectives, assess options and provide a tailored setup plan.', 'نفهم أهدافك ونقيّم الخيارات ونقدم خطة تأسيس مصمَّمة لك.') },
      { t: L('Prepare', 'الإعداد'), d: L('We manage documentation and coordinate with relevant authorities.', 'ندير المستندات وننسق مع الجهات ذات العلاقة.') },
      { t: L('Obtain approvals', 'الحصول على الموافقات'), d: L('We support the licensing and registration process, including sector-specific requirements.', 'ندعم عملية الترخيص والتسجيل بما فيها متطلبات القطاع.') },
      { t: L('Operational readiness', 'الجاهزية التشغيلية'), d: L('We guide you through post-establishment registrations and next steps.', 'نرشدك عبر التسجيلات بعد التأسيس والخطوات التالية.') }
    ],
    faqs: [
      { q: L('What legal structures are available for foreign businesses in Saudi Arabia?', 'ما الهياكل القانونية المتاحة للشركات الأجنبية في المملكة؟'), a: L('Options typically include a wholly owned subsidiary, a branch, a joint venture or a regional headquarters arrangement. The right choice depends on your sector, objectives and ownership preferences, and we compare these with you.', 'تشمل الخيارات عادةً شركة تابعة مملوكة بالكامل أو فرعًا أو مشروعًا مشتركًا أو ترتيب مقر إقليمي. ويعتمد الاختيار الأنسب على قطاعك وأهدافك وتفضيلات الملكية، ونقارن بينها معك.') },
      { q: L('How long does the establishment process take?', 'كم تستغرق عملية التأسيس؟'), a: L('Timelines vary by structure, sector and the completeness of documentation. We set out an expected timeline in your setup plan and update it as approvals progress.', 'تختلف المدد بحسب الهيكل والقطاع واكتمال المستندات. نضع جدولًا زمنيًا متوقعًا في خطة التأسيس ونحدّثه مع تقدم الموافقات.') },
      { q: L('Will you manage the entire process on our behalf?', 'هل ستديرون العملية بالكامل نيابةً عنا؟'), a: L('We coordinate and manage the process end to end, while some steps require your authorised signatories or information. We make clear in advance what we need from you and when.', 'ننسق العملية وندير مراحلها كاملة، مع أن بعض الخطوات تتطلب مفوّضيك بالتوقيع أو معلومات منك. نوضح مسبقًا ما نحتاجه منك ومتى.') }
    ],
    related: ['governance-finance-compliance', 'hr-talent-executive-mobility', 'operations-business-support']
  },
  {
    slug: 'partnerships-commercial-development', stage: 'operate', icon: 'users', card: 'svc-partnerships', hero: 'hero-riyadh-bridge', heroPos: 'right center',
    title: L('Partnerships & Commercial Development', 'الشراكات والتطوير التجاري'),
    short: L('Identify and develop strategic partnerships and commercial opportunities.', 'تحديد الشراكات الاستراتيجية والفرص التجارية وتطويرها.'),
    lead: L('Find, assess and structure the right local partners, and turn introductions into lasting commercial relationships.', 'اعثر على الشركاء المحليين المناسبين وقيّمهم وهيكل الشراكات، وحوّل التعارف إلى علاقات تجارية دائمة.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('The right partner changes the pace of entry', 'الشريك المناسب يغيّر وتيرة الدخول'), img: 'palms-arch',
      body: L('We help you identify credible distributors, joint-venture partners, suppliers and customers, evaluate them against clear criteria and structure arrangements that protect your interests.', 'نساعدك على تحديد موزعين وشركاء مشاريع مشتركة وموردين وعملاء موثوقين، وتقييمهم وفق معايير واضحة، وهيكلة ترتيبات تحمي مصالحك.') },
    whoFor: [
      L('Companies seeking a local distributor, agent or joint-venture partner', 'شركات تبحث عن موزع أو وكيل أو شريك مشروع مشترك محلي'),
      L('Businesses wanting access to key buyers and government-linked entities', 'أعمال تسعى للوصول إلى كبار المشترين والجهات المرتبطة بالحكومة'),
      L('Organisations structuring supply, licensing or franchise arrangements', 'منظمات تهيكل ترتيبات التوريد أو الترخيص أو الامتياز التجاري'),
      L('Teams preparing for negotiations with potential partners', 'فرق تستعد للتفاوض مع شركاء محتملين')
    ],
    challenges: [
      L('Limited visibility of credible, well-connected partners', 'محدودية الوصول إلى شركاء موثوقين ذوي علاقات قوية'),
      L('Assessing capability, reputation and strategic alignment', 'تقييم القدرات والسمعة والمواءمة الاستراتيجية'),
      L('Structuring terms that balance control, risk and incentives', 'هيكلة شروط توازن بين التحكم والمخاطر والحوافز'),
      L('Managing relationships across cultural and commercial norms', 'إدارة العلاقات عبر الأعراف الثقافية والتجارية')
    ],
    scopeLead: L('From long-list to signed agreement, with practical support at each decision point.', 'من القائمة الطويلة إلى الاتفاق الموقّع، بدعم عملي عند كل نقطة قرار.'),
    scope: [
      L('Partner criteria and long-list development', 'تحديد معايير الشركاء وإعداد القائمة الطويلة'),
      L('Due-diligence support and capability assessment', 'دعم العناية الواجبة وتقييم القدرات'),
      L('Introductions and meeting coordination', 'ترتيب التعارف وتنسيق الاجتماعات'),
      L('Commercial terms and structure options', 'خيارات الشروط التجارية والهيكلة'),
      L('Negotiation preparation and support', 'الإعداد للتفاوض ودعمه'),
      L('Partner governance and performance framework', 'إطار حوكمة الشركاء وقياس الأداء')
    ],
    deliverables: [
      L('Partner criteria and scoring framework', 'معايير الشركاء وإطار التقييم'), L('Shortlist with capability assessments', 'قائمة مختصرة مع تقييمات القدرات'),
      L('Engagement and meeting plan', 'خطة التواصل والاجتماعات'), L('Term-sheet options and negotiation brief', 'خيارات مذكرة الشروط وموجز التفاوض'), L('Partner governance framework', 'إطار حوكمة الشراكة')
    ],
    process: [
      { t: L('Define', 'التحديد'), d: L('We agree what a good partner looks like for your strategy.', 'نتفق على ملامح الشريك المناسب لاستراتيجيتك.') },
      { t: L('Search', 'البحث'), d: L('We identify and screen candidates against your criteria.', 'نحدد المرشحين ونفحصهم وفق معاييرك.') },
      { t: L('Engage', 'التواصل'), d: L('We coordinate introductions and structured discussions.', 'ننسق التعارف والنقاشات المنظمة.') },
      { t: L('Structure', 'الهيكلة'), d: L('We support terms, negotiation and an agreed governance model.', 'ندعم الشروط والتفاوض ونموذج حوكمة متفقًا عليه.') }
    ],
    faqs: [
      { q: L('Do you guarantee introductions to specific companies?', 'هل تضمنون التعريف بشركات محددة؟'), a: L('We do not promise access to named organisations. We identify and approach partners that fit your criteria and support the conversations that follow.', 'لا نعد بالوصول إلى جهات بعينها. نحدد الشركاء المناسبين لمعاييرك ونتواصل معهم وندعم الحوارات اللاحقة.') },
      { q: L('Can you act as our local representative?', 'هل يمكنكم تمثيلنا محليًا؟'), a: L('We support you in the process, but we do not act as your legal agent or sign agreements on your behalf.', 'ندعمك في العملية لكننا لا نعمل وكيلًا قانونيًا عنك ولا نوقّع الاتفاقيات نيابةً عنك.') },
      { q: L('How do you evaluate a potential partner?', 'كيف تقيّمون الشريك المحتمل؟'), a: L('We assess capability, track record, reputation, financial standing and strategic alignment, and highlight risks you should consider.', 'نقيّم القدرات والسجل والسمعة والمركز المالي والمواءمة الاستراتيجية، ونبرز المخاطر التي ينبغي أخذها في الحسبان.') }
    ],
    related: ['market-strategy-entry', 'brand-marketing-digital-growth', 'governance-finance-compliance']
  },
  {
    slug: 'hr-talent-executive-mobility', stage: 'operate', icon: 'person', card: 'svc-hr', hero: 'hero-man-skyline', heroPos: 'right center',
    title: L('HR, Talent & Executive Mobility', 'الموارد البشرية والكفاءات وتنقّل التنفيذيين'),
    short: L('Talent acquisition, workforce planning and executive mobility support.', 'استقطاب الكفاءات وتخطيط القوى العاملة ودعم تنقّل التنفيذيين.'),
    lead: L('Build the right team in Saudi Arabia, and help your leaders relocate and settle with confidence.', 'ابنِ الفريق المناسب في المملكة وساعد قادتك على الانتقال والاستقرار بثقة.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('People are the heart of a successful entry', 'الكفاءات هي قلب نجاح الدخول'), img: 'meeting-window',
      body: L('We help you plan your organisation, understand localisation requirements, recruit key talent and support the relocation of senior executives and their families.', 'نساعدك على تخطيط مؤسستك وفهم متطلبات التوطين واستقطاب الكفاءات الرئيسية ودعم انتقال كبار التنفيذيين وأسرهم.') },
    whoFor: [
      L('Companies building their first Saudi team', 'شركات تبني فريقها الأول في المملكة'),
      L('Businesses planning workforce localisation', 'أعمال تخطط لتوطين القوى العاملة'),
      L('Organisations relocating senior executives to the Kingdom', 'منظمات تنقل كبار التنفيذيين إلى المملكة'),
      L('Leadership teams designing a Saudi operating structure', 'فرق قيادية تصمم هيكلًا تشغيليًا للسوق السعودي')
    ],
    challenges: [
      L('Understanding workforce localisation expectations', 'فهم توقعات توطين القوى العاملة'),
      L('Attracting and retaining skilled talent in competitive sectors', 'استقطاب الكفاءات المتميزة والاحتفاظ بها في قطاعات تنافسية'),
      L('Designing roles, grades and reward that fit local norms', 'تصميم الأدوار والدرجات والمكافآت بما يلائم الأعراف المحلية'),
      L('Coordinating visas, residency and family relocation', 'تنسيق التأشيرات والإقامة وانتقال الأسرة')
    ],
    scopeLead: L('Practical support across planning, hiring and relocation.', 'دعم عملي يشمل التخطيط والتوظيف والانتقال.'),
    scope: [
      L('Organisation design and workforce planning', 'تصميم الهيكل التنظيمي وتخطيط القوى العاملة'),
      L('Localisation approach and role mapping', 'منهجية التوطين وتوصيف الأدوار'),
      L('Executive and specialist search coordination', 'تنسيق البحث عن التنفيذيين والمتخصصين'),
      L('Compensation and benefits benchmarking', 'مقارنة الرواتب والمزايا مرجعيًا'),
      L('Visa, residency and relocation coordination', 'تنسيق التأشيرات والإقامة والانتقال'),
      L('Onboarding and integration support', 'دعم الاستقبال والاندماج')
    ],
    deliverables: [
      L('Organisation and workforce plan', 'خطة الهيكل التنظيمي والقوى العاملة'), L('Localisation roadmap', 'خارطة طريق التوطين'),
      L('Role profiles and reward benchmarks', 'توصيفات الأدوار ومقارنات المكافآت'), L('Executive mobility plan', 'خطة تنقّل التنفيذيين'), L('Onboarding programme outline', 'إطار برنامج الاستقبال')
    ],
    process: [
      { t: L('Plan', 'التخطيط'), d: L('We define the organisation you need and the roles to fill first.', 'نحدد المؤسسة التي تحتاجها والأدوار الأولى المطلوب شغلها.') },
      { t: L('Source', 'الاستقطاب'), d: L('We coordinate search and assessment of key talent.', 'ننسق البحث وتقييم الكفاءات الرئيسية.') },
      { t: L('Relocate', 'الانتقال'), d: L('We support visas, residency and settling in.', 'ندعم التأشيرات والإقامة والاستقرار.') },
      { t: L('Integrate', 'الاندماج'), d: L('We help teams onboard and align to your operating model.', 'نساعد الفرق على الانضمام والتوافق مع نموذجك التشغيلي.') }
    ],
    faqs: [
      { q: L('Do you handle recruitment directly?', 'هل تتولون التوظيف مباشرة؟'), a: L('We coordinate search and assessment, working with qualified recruitment partners where specialist reach is needed.', 'ننسق البحث والتقييم، ونعمل مع شركاء توظيف مؤهلين حين تلزم شبكة تخصصية.') },
      { q: L('Can you advise on localisation requirements?', 'هل تقدمون المشورة بشأن متطلبات التوطين؟'), a: L('Yes. We outline what applies to your sector and size and help you plan a practical approach, confirming details with the relevant authorities.', 'نعم. نوضح ما ينطبق على قطاعك وحجم منشأتك ونساعدك في تخطيط نهج عملي، مع التحقق من التفاصيل لدى الجهات المختصة.') },
      { q: L('Do you support families relocating?', 'هل تدعمون انتقال الأسر؟'), a: L('We coordinate practical steps such as residency, schooling information and settling-in support.', 'ننسق الخطوات العملية مثل الإقامة ومعلومات المدارس ودعم الاستقرار.') }
    ],
    related: ['formation-establishment', 'operations-business-support', 'governance-finance-compliance']
  },
  {
    slug: 'operations-business-support', stage: 'operate', icon: 'gear', card: 'svc-operations', hero: 'hero-skyline-dusk', heroPos: 'right center',
    title: L('Operations & Business Support', 'العمليات ودعم الأعمال'),
    short: L('Practical support to establish and optimise your operations.', 'دعم عملي لتأسيس عملياتك وتحسينها.'),
    lead: L('Set up efficient, scalable operations and local capabilities so your business runs smoothly from day one.', 'أسّس عمليات وقدرات محلية فعّالة وقابلة للتوسع ليعمل نشاطك بسلاسة منذ اليوم الأول.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('From set-up to steady state', 'من التأسيس إلى الاستقرار التشغيلي'), img: 'lounge-arch',
      body: L('We help you establish premises, suppliers, processes and reporting, and refine your operating model as volumes grow.', 'نساعدك على تهيئة المقرات والموردين والإجراءات والتقارير، وتحسين نموذجك التشغيلي مع نمو الأحجام.') },
    whoFor: [
      L('Businesses opening their first Saudi office, site or facility', 'أعمال تفتتح أول مكتب أو موقع أو منشأة لها في المملكة'),
      L('Teams building local supply chains and supplier networks', 'فرق تبني سلاسل إمداد وشبكات موردين محلية'),
      L('Organisations standardising processes across regions', 'منظمات توحّد الإجراءات عبر المناطق'),
      L('Operators preparing to scale volumes or service levels', 'مشغّلون يستعدون لزيادة الأحجام أو مستويات الخدمة')
    ],
    challenges: [
      L('Finding suitable premises, suppliers and service providers', 'إيجاد المقرات والموردين ومقدمي الخدمات المناسبين'),
      L('Establishing processes that meet local requirements', 'ترسيخ إجراءات تلبي المتطلبات المحلية'),
      L('Building reporting and control from the outset', 'بناء التقارير وأدوات الرقابة منذ البداية'),
      L('Scaling without losing service quality', 'التوسع دون التفريط في جودة الخدمة')
    ],
    scopeLead: L('Pragmatic support that gets operations running and keeps them improving.', 'دعم عملي يشغّل العمليات ويواصل تحسينها.'),
    scope: [
      L('Operating-model and process design', 'تصميم النموذج التشغيلي والإجراءات'),
      L('Premises and facilities sourcing support', 'دعم تأمين المقرات والمرافق'),
      L('Supplier and vendor identification', 'تحديد الموردين ومقدمي الخدمات'),
      L('Service-level and performance reporting', 'مستويات الخدمة وتقارير الأداء'),
      L('Systems and tooling selection support', 'دعم اختيار الأنظمة والأدوات'),
      L('Continuous-improvement roadmap', 'خارطة طريق التحسين المستمر')
    ],
    deliverables: [
      L('Operating-model blueprint', 'مخطط النموذج التشغيلي'), L('Process and responsibility map', 'خريطة الإجراءات والمسؤوليات'),
      L('Supplier shortlist', 'قائمة مختصرة بالموردين'), L('Performance dashboard outline', 'إطار لوحة مؤشرات الأداء'), L('Improvement roadmap', 'خارطة طريق التحسين')
    ],
    process: [
      { t: L('Design', 'التصميم'), d: L('We design an operating model around your objectives.', 'نصمم نموذجًا تشغيليًا حول أهدافك.') },
      { t: L('Establish', 'التأسيس'), d: L('We support premises, suppliers and processes.', 'ندعم المقرات والموردين والإجراءات.') },
      { t: L('Operate', 'التشغيل'), d: L('We help your team run to agreed standards and reporting.', 'نساعد فريقك على العمل وفق معايير وتقارير متفق عليها.') },
      { t: L('Improve', 'التحسين'), d: L('We review performance and refine as you scale.', 'نراجع الأداء ونحسّنه مع توسعك.') }
    ],
    faqs: [
      { q: L('Do you run operations for us?', 'هل تديرون العمليات نيابةً عنا؟'), a: L('We design, set up and support. Day-to-day management remains with your team or your chosen service provider.', 'نصمم ونؤسس وندعم. وتبقى الإدارة اليومية لدى فريقك أو مقدم الخدمة الذي تختاره.') },
      { q: L('Can you help with a small initial footprint?', 'هل تساعدون في بداية بحجم صغير؟'), a: L('Yes. Many clients begin with a lean set-up and scale in phases as demand is proven.', 'نعم. يبدأ كثير من عملائنا بتأسيس رشيق ثم يتوسعون على مراحل مع تأكّد الطلب.') },
      { q: L('How do you choose suppliers?', 'كيف تختارون الموردين؟'), a: L('Against criteria agreed with you, such as capability, compliance, references and cost.', 'وفق معايير نتفق عليها معك مثل القدرة والامتثال والمراجع والتكلفة.') }
    ],
    related: ['hr-talent-executive-mobility', 'technology-automation', 'governance-finance-compliance']
  },
  {
    slug: 'governance-finance-compliance', stage: 'operate', icon: 'doc', card: 'svc-governance', hero: 'hero-skyline-wide', heroPos: 'right center',
    title: L('Governance, Finance & Compliance Coordination', 'تنسيق الحوكمة والمالية والامتثال'),
    short: L('Support across governance, finance and regulatory coordination.', 'دعم يشمل الحوكمة والمالية والتنسيق التنظيمي.'),
    lead: L('Coordinated support so your governance, finance and compliance foundations are sound as you operate in Saudi Arabia.', 'دعم منسّق ليكون أساس الحوكمة والمالية والامتثال لديك متينًا أثناء عملك في المملكة.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('A clear line of sight on obligations', 'رؤية واضحة للالتزامات'), img: 'colonnade-tower',
      body: L('We coordinate with your legal, tax and accounting advisers and the relevant authorities, helping you understand obligations, calendars and controls, without replacing your regulated professional advisers.', 'ننسق مع مستشاريك القانونيين والضريبيين والمحاسبيين ومع الجهات المختصة لمساعدتك على فهم الالتزامات والتقويمات والضوابط، دون أن نحل محل مستشاريك المرخّصين.') },
    whoFor: [
      L('Newly established Saudi entities building their control environment', 'كيانات سعودية حديثة التأسيس تبني بيئة الضوابط لديها'),
      L('Finance and legal teams coordinating across several advisers', 'فرق مالية وقانونية تنسق بين عدة مستشارين'),
      L('Boards seeking clarity on governance responsibilities', 'مجالس إدارة تسعى لوضوح مسؤوليات الحوكمة'),
      L('Groups aligning local reporting with global standards', 'مجموعات توائم التقارير المحلية مع المعايير العالمية')
    ],
    challenges: [
      L('Keeping track of filing, reporting and renewal calendars', 'متابعة تقويمات التقديم والتقارير والتجديد'),
      L('Aligning group policies with local requirements', 'مواءمة سياسات المجموعة مع المتطلبات المحلية'),
      L('Coordinating several external advisers and authorities', 'تنسيق عدد من المستشارين الخارجيين والجهات'),
      L('Designing proportionate governance for a new entity', 'تصميم حوكمة متناسبة لكيان جديد')
    ],
    scopeLead: L('Coordination and structure, working alongside your professional advisers.', 'تنسيق وهيكلة بالتعاون مع مستشاريك المهنيين.'),
    scope: [
      L('Governance framework and delegation of authority', 'إطار الحوكمة وتفويض الصلاحيات'),
      L('Compliance calendar and obligations register', 'تقويم الامتثال وسجل الالتزامات'),
      L('Finance and reporting set-up coordination', 'تنسيق إعداد المالية والتقارير'),
      L('Policy alignment with group standards', 'مواءمة السياسات مع معايير المجموعة'),
      L('Coordination with legal, tax and audit advisers', 'التنسيق مع مستشاري القانون والضرائب والمراجعة'),
      L('Risk register and control outline', 'سجل المخاطر وإطار الضوابط')
    ],
    deliverables: [
      L('Governance framework outline', 'مخطط إطار الحوكمة'), L('Compliance and filing calendar', 'تقويم الامتثال والتقديم'),
      L('Obligations register', 'سجل الالتزامات'), L('Policy alignment summary', 'ملخص مواءمة السياسات'), L('Adviser coordination plan', 'خطة تنسيق المستشارين')
    ],
    process: [
      { t: L('Map', 'الرسم'), d: L('We map obligations, advisers and decision rights.', 'نرسم الالتزامات والمستشارين وصلاحيات القرار.') },
      { t: L('Design', 'التصميم'), d: L('We outline a proportionate framework and calendar.', 'نضع إطارًا وتقويمًا متناسبين.') },
      { t: L('Coordinate', 'التنسيق'), d: L('We coordinate inputs across advisers and authorities.', 'ننسق المدخلات بين المستشارين والجهات.') },
      { t: L('Embed', 'الترسيخ'), d: L('We help your team run the framework day to day.', 'نساعد فريقك على تطبيق الإطار يوميًا.') }
    ],
    faqs: [
      { q: L('Are you a law, tax or audit firm?', 'هل أنتم مكتب محاماة أو ضرائب أو مراجعة؟'), a: L('No. We coordinate and structure the work, and you rely on your own licensed legal, tax and audit advisers for professional advice.', 'لا. ننسق العمل ونهيكله، وتعتمد على مستشاريك المرخّصين في القانون والضرائب والمراجعة للحصول على المشورة المهنية.') },
      { q: L('Can you introduce us to advisers?', 'هل يمكنكم التعريف بمستشارين؟'), a: L('Yes, where helpful we can introduce qualified firms, and you choose whom to appoint.', 'نعم، حيث يفيد ذلك يمكننا التعريف بمكاتب مؤهلة، وأنت من يقرر من تعيّنه.') },
      { q: L('Do you support board reporting?', 'هل تدعمون تقارير مجلس الإدارة؟'), a: L('We can help structure the information boards need on governance and compliance.', 'يمكننا المساعدة في تنظيم المعلومات التي تحتاجها مجالس الإدارة بشأن الحوكمة والامتثال.') }
    ],
    related: ['formation-establishment', 'operations-business-support', 'market-strategy-entry']
  },
  {
    slug: 'brand-marketing-digital-growth', stage: 'grow', icon: 'megaphone', card: 'svc-brand', hero: 'hero-corniche', heroPos: 'right center',
    title: L('Brand, Marketing & Digital Growth', 'العلامة التجارية والتسويق والنمو الرقمي'),
    short: L('Brand strategy, marketing and digital campaigns to drive awareness and demand.', 'استراتيجية العلامة والتسويق والحملات الرقمية لزيادة الوعي والطلب.'),
    lead: L('Position your brand for Saudi customers and build the digital presence that turns awareness into demand.', 'موضع علامتك لدى العملاء السعوديين وابنِ حضورًا رقميًا يحوّل الوعي إلى طلب.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('Be relevant, be remembered', 'كن ذا صلة وابقَ في الذاكرة'), img: 'ins-wall',
      body: L('We adapt your positioning, messaging and channels to Saudi audiences, and build a measured marketing plan across digital and traditional touchpoints.', 'نكيّف تموضعك ورسائلك وقنواتك مع الجمهور السعودي ونبني خطة تسويقية قابلة للقياس عبر نقاط الاتصال الرقمية والتقليدية.') },
    whoFor: [
      L('International brands localising for Saudi consumers', 'علامات دولية تكيّف حضورها للمستهلك السعودي'),
      L('Businesses launching a new product or service in the Kingdom', 'أعمال تطلق منتجًا أو خدمة جديدة في المملكة'),
      L('Teams building an Arabic and English digital presence', 'فرق تبني حضورًا رقميًا بالعربية والإنجليزية'),
      L('Organisations seeking measurable growth from marketing spend', 'منظمات تسعى لنمو قابل للقياس من الإنفاق التسويقي')
    ],
    challenges: [
      L('Adapting brand and messaging to local culture and language', 'تكييف العلامة والرسائل مع الثقافة واللغة المحلية'),
      L('Choosing the right channels and influencers', 'اختيار القنوات والمؤثرين المناسبين'),
      L('Pricing and positioning against established competitors', 'التسعير والتموضع أمام منافسين راسخين'),
      L('Measuring return from early marketing investment', 'قياس العائد من الاستثمار التسويقي المبكر')
    ],
    scopeLead: L('Strategy first, then focused execution you can measure.', 'الاستراتيجية أولًا، ثم تنفيذ مركّز قابل للقياس.'),
    scope: [
      L('Brand positioning and messaging adaptation', 'تكييف تموضع العلامة والرسائل'),
      L('Pricing and proposition review', 'مراجعة التسعير وعرض القيمة'),
      L('Channel strategy and campaign planning', 'استراتيجية القنوات وتخطيط الحملات'),
      L('Arabic and English content strategy', 'استراتيجية المحتوى بالعربية والإنجليزية'),
      L('Digital presence, search and e-commerce guidance', 'إرشاد الحضور الرقمي والبحث والتجارة الإلكترونية'),
      L('Measurement framework and reporting', 'إطار القياس والتقارير')
    ],
    deliverables: [
      L('Positioning and messaging framework', 'إطار التموضع والرسائل'), L('Pricing and proposition recommendations', 'توصيات التسعير وعرض القيمة'),
      L('Channel and campaign plan', 'خطة القنوات والحملات'), L('Content calendar outline', 'مخطط تقويم المحتوى'), L('Measurement dashboard outline', 'إطار لوحة القياس')
    ],
    process: [
      { t: L('Listen', 'الاستماع'), d: L('We learn your brand, audience and competitors.', 'نتعرف على علامتك وجمهورك ومنافسيك.') },
      { t: L('Position', 'التموضع'), d: L('We adapt positioning and pricing for Saudi customers.', 'نكيّف التموضع والتسعير للعميل السعودي.') },
      { t: L('Plan', 'التخطيط'), d: L('We plan channels, content and campaigns.', 'نخطط القنوات والمحتوى والحملات.') },
      { t: L('Measure', 'القياس'), d: L('We set up reporting and refine with data.', 'نهيئ التقارير ونحسّن بالبيانات.') }
    ],
    faqs: [
      { q: L('Do you run campaigns or only advise?', 'هل تنفذون الحملات أم تقدمون المشورة فقط؟'), a: L('We focus on strategy and planning and coordinate specialist agencies for production and media buying where needed.', 'نركز على الاستراتيجية والتخطيط وننسق مع وكالات متخصصة للإنتاج وشراء الوسائط عند الحاجة.') },
      { q: L('Can you adapt our existing brand?', 'هل يمكنكم تكييف علامتنا الحالية؟'), a: L('Yes. We advise on what to keep global and what to adapt locally, including language and tone.', 'نعم. نقدم المشورة بشأن ما يبقى عالميًا وما يُكيَّف محليًا بما فيه اللغة والنبرة.') },
      { q: L('How do you measure success?', 'كيف تقيسون النجاح؟'), a: L('We agree a small set of measures with you, linked to awareness, demand and conversion.', 'نتفق معك على مجموعة محدودة من المؤشرات مرتبطة بالوعي والطلب والتحويل.') }
    ],
    related: ['market-strategy-entry', 'partnerships-commercial-development', 'technology-automation']
  },
  {
    slug: 'technology-automation', stage: 'grow', icon: 'chip', card: 'svc-tech', hero: 'ck-hero-night', heroPos: 'right center',
    title: L('Technology & Automation', 'التقنية والأتمتة'),
    short: L('Technology advisory and automation to improve efficiency and enable growth.', 'استشارات تقنية وأتمتة لتحسين الكفاءة وتمكين النمو.'),
    lead: L('Choose, implement and scale the technology that makes your Saudi operations faster, simpler and more resilient.', 'اختر التقنية التي تجعل عملياتك في المملكة أسرع وأبسط وأكثر مرونة، ونفّذها ووسّع استخدامها.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('Technology that serves the strategy', 'تقنية تخدم الاستراتيجية'), img: 'palms-arch',
      body: L('We help you assess your technology needs, select practical solutions, plan implementation and automate repeatable work, with attention to data, security and local requirements.', 'نساعدك على تقييم احتياجاتك التقنية واختيار حلول عملية وتخطيط التنفيذ وأتمتة الأعمال المتكررة، مع مراعاة البيانات والأمن والمتطلبات المحلية.') },
    whoFor: [
      L('Businesses setting up systems for a new Saudi entity', 'أعمال تؤسس أنظمة لكيان سعودي جديد'),
      L('Operations teams seeking to automate manual processes', 'فرق عمليات تسعى لأتمتة الإجراءات اليدوية'),
      L('Leaders planning a digital-transformation roadmap', 'قادة يخططون لخارطة طريق التحول الرقمي'),
      L('Organisations integrating local and group systems', 'منظمات تدمج الأنظمة المحلية مع أنظمة المجموعة')
    ],
    challenges: [
      L('Selecting the right platforms from many options', 'اختيار المنصات المناسبة من بين خيارات كثيرة'),
      L('Meeting data-residency and security expectations', 'تلبية توقعات إقامة البيانات والأمن'),
      L('Integrating systems across entities and countries', 'دمج الأنظمة عبر الكيانات والدول'),
      L('Realising value from automation investment', 'تحقيق قيمة من الاستثمار في الأتمتة')
    ],
    scopeLead: L('Vendor-neutral advice, from needs assessment to adoption.', 'مشورة محايدة تجاه المورّدين، من تقييم الاحتياجات إلى الاعتماد.'),
    scope: [
      L('Technology needs assessment and roadmap', 'تقييم الاحتياجات التقنية وخارطة الطريق'),
      L('Vendor-neutral solution selection support', 'دعم اختيار الحلول بحياد'),
      L('Process automation opportunity review', 'مراجعة فرص أتمتة الإجراءات'),
      L('Data, security and local-requirements checklist', 'قائمة تحقق للبيانات والأمن والمتطلبات المحلية'),
      L('Implementation planning and change support', 'تخطيط التنفيذ ودعم التغيير'),
      L('Benefits tracking and adoption review', 'تتبع المنافع ومراجعة الاعتماد')
    ],
    deliverables: [
      L('Technology roadmap', 'خارطة الطريق التقنية'), L('Solution shortlist and evaluation', 'قائمة الحلول المختصرة وتقييمها'),
      L('Automation opportunity register', 'سجل فرص الأتمتة'), L('Implementation plan', 'خطة التنفيذ'), L('Benefits tracking framework', 'إطار تتبع المنافع')
    ],
    process: [
      { t: L('Assess', 'التقييم'), d: L('We map needs, systems and constraints.', 'نرسم الاحتياجات والأنظمة والقيود.') },
      { t: L('Select', 'الاختيار'), d: L('We evaluate options against agreed criteria.', 'نقيّم الخيارات وفق معايير متفق عليها.') },
      { t: L('Implement', 'التنفيذ'), d: L('We plan and coordinate delivery with your providers.', 'نخطط التنفيذ وننسقه مع مزوّديك.') },
      { t: L('Adopt', 'الاعتماد'), d: L('We track benefits and support adoption.', 'نتتبع المنافع وندعم الاعتماد.') }
    ],
    faqs: [
      { q: L('Do you resell software?', 'هل تبيعون البرمجيات؟'), a: L('No. Our advice is vendor-neutral and we do not earn commission from technology providers.', 'لا. مشورتنا محايدة تجاه المورّدين ولا نتقاضى عمولات من مزوّدي التقنية.') },
      { q: L('Can you help with data-residency questions?', 'هل تساعدون في مسائل إقامة البيانات؟'), a: L('We help you frame the questions and requirements, and you confirm specifics with your legal and security advisers.', 'نساعدك على صياغة الأسئلة والمتطلبات، وتؤكد التفاصيل مع مستشاريك القانونيين والأمنيين.') },
      { q: L('Where should we start with automation?', 'من أين نبدأ بالأتمتة؟'), a: L('Usually with high-volume, rules-based processes where the benefit is easy to measure.', 'عادةً من الإجراءات كثيفة الحجم والقائمة على قواعد حيث يسهل قياس المنفعة.') }
    ],
    related: ['operations-business-support', 'brand-marketing-digital-growth', 'governance-finance-compliance']
  }
];

export const serviceBySlug = (s) => SERVICES.find((x) => x.slug === s);
