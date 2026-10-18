import { L } from './ui.mjs';

export const STAGES = [
  {
    id: 'enter', label: L('Enter', 'الدخول'), heading: L('Build your foundation', 'ابنِ أساسك'),
    body: L('Decide whether to come, how to come, and get set up properly the first time.', 'قرّر هل تأتي وكيف تأتي، وأسّس أعمالك بشكل سليم من المرة الأولى.'),
    ideal: L('Businesses weighing Saudi Arabia, testing an opportunity, or opening their first local presence.', 'شركات تدرس السعودية أو تختبر فرصة أو تفتتح أول حضور محلي لها.')
  },
  {
    id: 'operate', label: L('Operate', 'التشغيل'), heading: L('Turn plans into progress', 'حوّل الخطط إلى تقدّم'),
    body: L('Find the right partners and people, and set up the way you work so it runs smoothly and stays compliant.', 'اعثر على الشركاء والكفاءات المناسبين، وابنِ طريقة عملك لتسير بسلاسة وتبقى ملتزمة.'),
    ideal: L('Businesses that have a presence and now need to build the team, the partnerships and the day-to-day machinery.', 'شركات لها حضور وتحتاج الآن إلى بناء الفريق والشراكات وآلية العمل اليومية.')
  },
  {
    id: 'grow', label: L('Grow', 'النمو'), heading: L('Scale for a bigger tomorrow', 'توسّع لغدٍ أكبر'),
    body: L('Win more customers, strengthen your brand, and use technology to do more with the team you have.', 'اكسب عملاء أكثر، وقوِّ علامتك، واستخدم التقنية لتنجز أكثر بالفريق نفسه.'),
    ideal: L('Businesses that are already trading and want to expand, deepen their market position or speed up.', 'شركات تعمل بالفعل وتريد التوسع أو تعميق مكانتها في السوق أو تسريع نموها.')
  }
];

export const RESPONSIBILITIES = [
  { icon: 'doc', t: L('Share the documents and information we ask for, when we ask', 'تزويدنا بالمستندات والمعلومات التي نطلبها في موعدها') },
  { icon: 'check', t: L('Review and approve our drafts promptly', 'مراجعة مسوداتنا واعتمادها بسرعة') },
  { icon: 'users', t: L('Join the key meetings, and bring decision-makers where you can', 'حضور الاجتماعات الرئيسية، وإحضار أصحاب القرار قدر الإمكان') },
  { icon: 'clipboard', t: L('Be open about your goals, your budget and your worries', 'الصراحة بشأن أهدافك وميزانيتك ومخاوفك') }
];

export const SERVICES = [
  {
    slug: 'market-strategy-entry', stage: 'enter', icon: 'chart', card: 'svc-strategy', hero: 'hero-riyadh-bridge', heroPos: 'right center',
    title: L('Market Strategy & Entry', 'استراتيجية السوق والدخول'),
    short: L('An honest look at the market and a clear plan for how to enter it.', 'نظرة صريحة إلى السوق وخطة واضحة لكيفية دخوله.'),
    lead: L('Before you spend money on a Saudi entry, find out whether the idea stands up. We look at the market honestly with you, compare the ways in, and leave you with a plan your board can say yes or no to.', 'قبل أن تنفق على دخول السوق السعودي، تأكد أن الفكرة تصمد. ننظر معك إلى السوق بصراحة، ونقارن بين طرق الدخول، ونترك لك خطة يستطيع مجلس إدارتك أن يقول لها نعم أو لا.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('Know before you commit', 'اعرف قبل أن تلتزم'), img: 'fort-tower',
      body: L('Most entry mistakes are made in the first month, on assumptions nobody tested. We look at demand, competition, regulation and cost alongside you, set out the realistic routes in, and tell you which one we would choose and why. Sometimes the honest answer is “not yet”, and that is a good result too.', 'تقع أغلب أخطاء الدخول في الشهر الأول، بسبب افتراضات لم يختبرها أحد. ندرس معك الطلب والمنافسة والأنظمة والتكلفة، ونعرض عليك الطرق الواقعية للدخول، ونقول لك أيها كنا سنختار ولماذا. وأحيانًا تكون الإجابة الصادقة «ليس بعد»، وهذه أيضًا نتيجة جيدة.') },
    whoFor: [
      L('You are weighing Saudi Arabia for the first time and want a clear-eyed view.', 'تدرس السعودية للمرة الأولى وتريد رؤية واضحة لا تجامل.'),
      L('You already sell in the region and are asking whether the Kingdom is the next step.', 'تبيع بالفعل في المنطقة وتتساءل إن كانت المملكة هي الخطوة التالية.'),
      L('You are an investor who wants to understand a sector before committing capital.', 'مستثمر يريد فهم قطاع ما قبل أن يضخ رأس المال.'),
      L('You need a decision paper your board will take seriously.', 'تحتاج ورقة قرار يأخذها مجلس إدارتك بجدية.')
    ],
    challenges: [
      L('You cannot tell how much of the demand is real.', 'لا تستطيع الجزم بحجم الطلب الحقيقي.'),
      L('You do not know who you would really be competing against, or at what price.', 'لا تعرف من ستنافس فعلًا، وبأي سعر.'),
      L('Subsidiary, joint venture or partner: everyone has an opinion and none of them agree.', 'شركة تابعة أم مشروع مشترك أم شريك: لكل شخص رأي ولا يتفق اثنان.'),
      L('The ambition is clear, but the plan is not.', 'الطموح واضح، لكن الخطة ليست كذلك.'),
      L('You suspect there are rules for your sector that nobody has told you about yet.', 'تشك في وجود أنظمة تخص قطاعك لم يخبرك بها أحد بعد.')
    ],
    scopeLead: L('Practical work, in plain language, from the first question to a decision you can defend.', 'عمل عملي بلغة واضحة، من السؤال الأول إلى قرار تستطيع الدفاع عنه.'),
    scope: [
      L('Market size, demand and growth: what is really there', 'حجم السوق والطلب والنمو: ما الموجود فعلًا'),
      L('Who you would compete with, and how they win', 'من ستنافس، وكيف يفوزون'),
      L('Which customers to go after first, and why they would choose you', 'أي العملاء تستهدف أولًا، ولماذا سيختارونك'),
      L('Your entry options side by side, with our recommendation', 'خيارات دخولك جنبًا إلى جنب مع توصيتنا'),
      L('The rules and licences that will affect you, flagged early', 'الأنظمة والتراخيص التي ستؤثر فيك، منبَّهًا إليها مبكرًا'),
      L('A phased launch roadmap with a first-year budget outline', 'خارطة طريق إطلاق مرحلية مع إطار ميزانية السنة الأولى')
    ],
    deliverables: [
      L('Market opportunity assessment', 'تقييم فرصة السوق'), L('Competitor and pricing benchmark', 'مقارنة المنافسين والأسعار'),
      L('Entry options paper', 'ورقة خيارات الدخول'), L('Phased launch roadmap', 'خارطة طريق إطلاق مرحلية'), L('A short summary for your board', 'ملخص قصير لمجلس إدارتك')
    ],
    process: [
      { t: L('Understand', 'نفهم'), d: L('We start with your goals and your doubts, and agree the questions the decision depends on.', 'نبدأ بأهدافك وشكوكك، ونتفق على الأسئلة التي يعتمد عليها القرار.') },
      { t: L('Assess', 'نقيّم'), d: L('We study the market, the competition and the rules that apply to your sector.', 'ندرس السوق والمنافسة والأنظمة التي تنطبق على قطاعك.') },
      { t: L('Compare', 'نقارن'), d: L('We set the entry options side by side against your goals, your appetite for risk and your timeline.', 'نضع خيارات الدخول جنبًا إلى جنب مقابل أهدافك وقدرتك على تحمل المخاطر وجدولك الزمني.') },
      { t: L('Recommend', 'نوصي'), d: L('We tell you what we would do, show you why, and turn it into a practical roadmap.', 'نقول لك ما كنا سنفعله، ونبيّن لماذا، ونحوّله إلى خارطة طريق عملية.') }
    ],
    faqs: [
      { q: L('How long does it take?', 'كم يستغرق ذلك؟'), a: L('Usually four to eight weeks, depending on the sector and how deep you want to go. We agree the scope and the timeline with you at the start, so there are no surprises.', 'عادةً من أربعة إلى ثمانية أسابيع بحسب القطاع وعمق ما تريده. نتفق معك على النطاق والجدول الزمني في البداية، فلا مفاجآت.') },
      { q: L('Do you only work with foreign companies?', 'هل تعملون مع الشركات الأجنبية فقط؟'), a: L('No. We also help regional and Saudi businesses that are entering a new sector or a new part of the Kingdom.', 'لا. نساعد كذلك الشركات الإقليمية والسعودية التي تدخل قطاعًا جديدًا أو منطقة جديدة في المملكة.') },
      { q: L('What if the answer is not to enter?', 'وماذا لو كانت الإجابة ألا ندخل؟'), a: L('Then that is what we will tell you. A clear “not yet”, or “not like this”, can save you a great deal of money, and it is a perfectly good outcome.', 'فهذا ما سنقوله لك. فـ«ليس بعد» أو «ليس بهذه الطريقة» الواضحة قد توفر عليك مالًا كثيرًا، وهي نتيجة جيدة تمامًا.') }
    ],
    related: ['formation-establishment', 'partnerships-commercial-development', 'governance-finance-compliance']
  },
  {
    slug: 'formation-establishment', stage: 'enter', icon: 'building', card: 'svc-formation', hero: 'hero-skyline-wide', heroPos: 'right center',
    title: L('Formation & Establishment', 'التأسيس والتأسيس القانوني'),
    short: L('Setting up your Saudi entity, licences and registrations, step by step.', 'تأسيس كيانك السعودي وتراخيصك وتسجيلاتك، خطوة بخطوة.'),
    lead: L('Setting up a business in a new country is mostly paperwork, patience and knowing who to ask. We coordinate the whole thing so you can get on with running the business.', 'تأسيس شركة في بلد جديد هو في معظمه أوراق وصبر ومعرفة بمن تسأل. ننسق العملية كلها لتتفرغ أنت لإدارة أعمالك.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('A proper start in Saudi Arabia', 'بداية سليمة في السعودية'), img: 'curved-building',
      body: L('We help you choose the right structure, prepare the documents, deal with the relevant authorities and keep the process moving. You will always know where things stand, what is waiting on whom, and what comes next. We coordinate the work alongside your own lawyers and accountants; we do not replace them.', 'نساعدك على اختيار الهيكل المناسب، وإعداد المستندات، والتعامل مع الجهات المعنية، وإبقاء العملية تتحرك. ستعرف دائمًا أين وصلت الأمور، وما الذي ينتظر من، وما التالي. ننسق العمل مع محاميك ومحاسبيك، ولا نحل محلهم.') },
    whoFor: [
      L('You are an international business entering the Saudi market.', 'أنت شركة دولية تدخل السوق السعودي.'),
      L('You are an established company opening a local entity or subsidiary.', 'أنت شركة قائمة تفتتح كيانًا محليًا أو شركة تابعة.'),
      L('You want a compliant start that does not lose months to avoidable delays.', 'تريد بداية ملتزمة لا تضيع أشهرها في تأخيرات يمكن تجنبها.'),
      L('You want one team to coordinate everything from incorporation to opening day.', 'تريد فريقًا واحدًا ينسق كل شيء من التأسيس إلى يوم الافتتاح.')
    ],
    challenges: [
      L('The licensing and regulatory requirements feel like a maze.', 'متطلبات الترخيص والأنظمة تبدو كمتاهة.'),
      L('You are not sure which legal structure suits your goals.', 'لست متأكدًا من الهيكل القانوني الأنسب لأهدافك.'),
      L('Several government bodies are involved and nobody seems to talk to each other.', 'تشارك عدة جهات حكومية ويبدو أنها لا تتواصل مع بعضها.'),
      L('Documents and approvals take longer than anyone told you.', 'المستندات والموافقات تستغرق أطول مما قيل لك.'),
      L('Your sector has extra approvals on top of the general ones.', 'قطاعك له موافقات إضافية فوق الموافقات العامة.')
    ],
    scopeLead: L('We handle the coordination from first decision to opening day, and we are honest about what depends on you and on the authorities.', 'نتولى التنسيق من القرار الأول إلى يوم الافتتاح، ونكون صرحاء في ما يعتمد عليك وما يعتمد على الجهات.'),
    scope: [
      L('Comparing entity structures and recommending one', 'مقارنة هياكل الكيان والتوصية بأحدها'),
      L('Commercial registration and licensing support', 'دعم السجل التجاري والترخيص'),
      L('Ongoing advice until you are ready to operate', 'مشورة مستمرة حتى تصبح جاهزًا للتشغيل'),
      L('Preparing and submitting incorporation documents', 'إعداد مستندات التأسيس وتقديمها'),
      L('Sector-specific approvals and requirements', 'الموافقات والمتطلبات الخاصة بقطاعك'),
      L('Working with service providers and other stakeholders', 'العمل مع مقدمي الخدمات وأصحاب المصلحة الآخرين'),
      L('Liaison with the relevant government authorities', 'التواصل مع الجهات الحكومية المعنية'),
      L('Registrations you need once you are established', 'التسجيلات اللازمة بعد التأسيس'),
      L('Practical guidance on your ongoing obligations', 'إرشاد عملي حول التزاماتك المستمرة')
    ],
    deliverables: [
      L('A recommended structure and setup plan', 'هيكل موصى به وخطة تأسيس'), L('Incorporation and registration filings', 'ملفات التأسيس والتسجيل'),
      L('Commercial registration and the licences you need', 'السجل التجاري والتراخيص التي تحتاجها'), L('Supporting documents and approval correspondence', 'المستندات الداعمة ومراسلات الموافقات'), L('A checklist for staying compliant after launch', 'قائمة تحقق للبقاء ملتزمًا بعد الإطلاق')
    ],
    process: [
      { t: L('Plan', 'نخطط'), d: L('We learn what you want to do, compare the options, and agree a setup plan with realistic dates.', 'نتعرف على ما تريد فعله، ونقارن الخيارات، ونتفق على خطة تأسيس بمواعيد واقعية.') },
      { t: L('Prepare', 'نجهّز'), d: L('We prepare the documents and line up the authorities, so nothing waits on a missing page.', 'نجهز المستندات وننسق مع الجهات، فلا ينتظر شيء ورقة ناقصة.') },
      { t: L('Get approved', 'نحصل على الموافقات'), d: L('We follow the licensing and registration steps, including any your sector adds.', 'نتابع خطوات الترخيص والتسجيل، بما فيها ما يضيفه قطاعك.') },
      { t: L('Get ready to operate', 'نستعد للتشغيل'), d: L('We walk you through the registrations that come after, and what to do in your first weeks.', 'نرشدك عبر التسجيلات التي تلي ذلك، وما تفعله في أسابيعك الأولى.') }
    ],
    faqs: [
      { q: L('What legal structures can a foreign business use?', 'ما الهياكل القانونية المتاحة للشركة الأجنبية؟'), a: L('Typically a wholly owned subsidiary, a branch, a joint venture, or a regional headquarters arrangement. The right one depends on your sector, your goals and how much control you want. We set the options side by side with you and explain the trade-offs.', 'عادةً شركة تابعة مملوكة بالكامل أو فرع أو مشروع مشترك أو ترتيب مقر إقليمي. والأنسب يعتمد على قطاعك وأهدافك ومقدار التحكم الذي تريده. نضع الخيارات أمامك جنبًا إلى جنب ونشرح مزايا كل منها وكلفته.') },
      { q: L('How long will it take?', 'كم سيستغرق الأمر؟'), a: L('It varies with the structure, the sector and how complete your documents are. We give you an expected timeline in your setup plan and update it honestly as approvals move.', 'يختلف بحسب الهيكل والقطاع واكتمال مستنداتك. نعطيك جدولًا متوقعًا في خطة التأسيس ونحدّثه بصدق مع تقدم الموافقات.') },
      { q: L('Will you do everything for us?', 'هل ستتولون كل شيء عنا؟'), a: L('We coordinate and manage the process end to end. Some steps need your authorised signatories or your information, and we tell you what we need and when, well in advance.', 'ننسق العملية وندير مراحلها كلها. وبعض الخطوات تحتاج مفوّضيك بالتوقيع أو معلوماتك، ونخبرك بما نحتاجه ومتى، قبل وقت كافٍ.') }
    ],
    related: ['governance-finance-compliance', 'hr-talent-executive-mobility', 'operations-business-support']
  },
  {
    slug: 'partnerships-commercial-development', stage: 'operate', icon: 'users', card: 'svc-partnerships', hero: 'hero-riyadh-bridge', heroPos: 'right center',
    title: L('Partnerships & Commercial Development', 'الشراكات والتطوير التجاري'),
    short: L('Finding the right partners, and building relationships that last.', 'إيجاد الشركاء المناسبين وبناء علاقات تدوم.'),
    lead: L('In Saudi Arabia, the right partner can save you a year. The wrong one can cost you two. We help you find, check and structure the partnerships that fit your plans.', 'في السعودية، قد يوفر عليك الشريك المناسب سنة، وقد يكلفك الشريك الخطأ سنتين. نساعدك على إيجاد الشراكات التي تناسب خططك والتحقق منها وهيكلتها.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('The right partner changes the pace', 'الشريك المناسب يغيّر الوتيرة'), img: 'palms-arch',
      body: L('We help you work out what you actually need from a partner, build a shortlist, check people out properly, and negotiate terms that protect you. We make introductions and coordinate meetings. We do not promise access to named organisations, and we never act as your legal agent.', 'نساعدك على تحديد ما تحتاجه فعلًا من الشريك، وبناء قائمة مختصرة، والتحقق من الأشخاص بجدية، والتفاوض على شروط تحميك. نرتب التعارف وننسق الاجتماعات. ولا نعد بالوصول إلى جهات بعينها، ولا نعمل وكيلًا قانونيًا عنك.') },
    whoFor: [
      L('You are looking for a distributor, agent or joint-venture partner.', 'تبحث عن موزع أو وكيل أو شريك مشروع مشترك.'),
      L('You want to reach the right buyers and organisations, and do not know how.', 'تريد الوصول إلى المشترين والجهات المناسبة ولا تعرف كيف.'),
      L('You are structuring a supply, licensing or franchise arrangement.', 'تهيكل ترتيب توريد أو ترخيص أو امتياز تجاري.'),
      L('You are about to negotiate with a potential partner and want to be prepared.', 'على وشك التفاوض مع شريك محتمل وتريد أن تكون مستعدًا.')
    ],
    challenges: [
      L('You have no way of knowing who is credible and well connected.', 'لا تملك طريقة لمعرفة من هو موثوق وصاحب علاقات.'),
      L('It is hard to judge a partner’s real capability and reputation.', 'يصعب الحكم على قدرة الشريك الحقيقية وسمعته.'),
      L('The terms need to balance control, risk and incentives, and that is delicate.', 'الشروط تحتاج موازنة بين التحكم والمخاطر والحوافز، وهذا دقيق.'),
      L('Business customs differ, and misunderstandings are easy.', 'تختلف الأعراف التجارية، وسوء الفهم سهل.')
    ],
    scopeLead: L('From a long list to a signed agreement, with a clear head at each decision.', 'من القائمة الطويلة إلى الاتفاق الموقّع، بذهن صافٍ عند كل قرار.'),
    scope: [
      L('Deciding what a good partner looks like for you', 'تحديد ملامح الشريك الجيد بالنسبة لك'),
      L('Due-diligence support and capability checks', 'دعم العناية الواجبة والتحقق من القدرات'),
      L('Introductions and meeting coordination', 'ترتيب التعارف وتنسيق الاجتماعات'),
      L('Commercial terms and structure options', 'الشروط التجارية وخيارات الهيكلة'),
      L('Preparing for negotiation, and supporting you through it', 'الإعداد للتفاوض ومرافقتك خلاله'),
      L('A simple way to govern the partnership once it is running', 'طريقة بسيطة لحوكمة الشراكة بعد انطلاقها')
    ],
    deliverables: [
      L('Partner criteria and a scoring framework', 'معايير الشركاء وإطار للتقييم'), L('A shortlist with capability assessments', 'قائمة مختصرة بتقييمات القدرات'),
      L('A meeting and engagement plan', 'خطة اجتماعات وتواصل'), L('Term-sheet options and a negotiation brief', 'خيارات مذكرة الشروط وموجز للتفاوض'), L('A partner governance framework', 'إطار لحوكمة الشراكة')
    ],
    process: [
      { t: L('Define', 'نحدد'), d: L('We agree what a good partner looks like for your strategy, before we look at anyone.', 'نتفق على ملامح الشريك الجيد لاستراتيجيتك، قبل أن ننظر إلى أحد.') },
      { t: L('Search', 'نبحث'), d: L('We identify candidates and screen them against your criteria.', 'نحدد المرشحين ونفحصهم وفق معاييرك.') },
      { t: L('Engage', 'نتواصل'), d: L('We arrange introductions and structured conversations, and compare what we learn.', 'نرتب التعارف وحوارات منظمة، ونقارن ما نتعلمه.') },
      { t: L('Structure', 'نهيكل'), d: L('We support the terms, the negotiation and an agreed way of working together.', 'ندعم الشروط والتفاوض وطريقة متفقًا عليها للعمل معًا.') }
    ],
    faqs: [
      { q: L('Can you guarantee introductions to specific companies?', 'هل تضمنون التعريف بشركات محددة؟'), a: L('No, and we would be wary of anyone who does. We find and approach partners that fit your criteria, and we support the conversations that follow.', 'لا، وسنحذر ممن يفعل ذلك. نجد الشركاء المناسبين لمعاييرك ونتواصل معهم، وندعم الحوارات التي تلي ذلك.') },
      { q: L('Can you act as our representative in the Kingdom?', 'هل يمكنكم تمثيلنا في المملكة؟'), a: L('We support you through the process, but we do not act as your legal agent or sign anything on your behalf.', 'ندعمك خلال العملية، لكننا لا نعمل وكيلًا قانونيًا عنك ولا نوقّع شيئًا نيابةً عنك.') },
      { q: L('How do you judge whether a partner is right?', 'كيف تحكمون على مناسبة الشريك؟'), a: L('We look at capability, track record, reputation, financial standing and fit with your goals, and we tell you plainly about any risks we see.', 'ننظر إلى القدرة والسجل والسمعة والمركز المالي والتوافق مع أهدافك، ونخبرك بوضوح بأي مخاطر نراها.') }
    ],
    related: ['market-strategy-entry', 'brand-marketing-digital-growth', 'governance-finance-compliance']
  },
  {
    slug: 'hr-talent-executive-mobility', stage: 'operate', icon: 'person', card: 'svc-hr', hero: 'hero-man-skyline', heroPos: 'right center',
    title: L('HR, Talent & Executive Mobility', 'الموارد البشرية والكفاءات وتنقّل التنفيذيين'),
    short: L('Building your Saudi team, and helping your leaders settle in.', 'بناء فريقك السعودي ومساعدة قادتك على الاستقرار.'),
    lead: L('Your business in Saudi Arabia will only be as good as the people in it. We help you design the team, hire well, meet localisation expectations, and bring your leaders over without the usual stress.', 'ستكون أعمالك في السعودية بقدر جودة الأشخاص فيها. نساعدك على تصميم الفريق والتوظيف الجيد وتلبية توقعات التوطين وجلب قادتك دون التوتر المعتاد.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('People first', 'الأشخاص أولًا'), img: 'meeting-window',
      body: L('We help you decide which roles to fill first, plan localisation sensibly, coordinate the search for key people, and look after the practical side of moving senior executives and their families. We work with qualified recruitment partners where specialist reach is needed.', 'نساعدك على تحديد الأدوار التي تُشغل أولًا، وتخطيط التوطين بعقلانية، وتنسيق البحث عن الأشخاص الرئيسيين، والعناية بالجانب العملي لانتقال كبار التنفيذيين وأسرهم. ونعمل مع شركاء توظيف مؤهلين حيث تلزم شبكة متخصصة.') },
    whoFor: [
      L('You are building your first Saudi team.', 'تبني فريقك السعودي الأول.'),
      L('You need to plan for Saudisation and are not sure what it means for you.', 'تحتاج إلى التخطيط للتوطين ولست متأكدًا مما يعنيه لك.'),
      L('You are relocating senior people to the Kingdom.', 'تنقل كبار الأشخاص إلى المملكة.'),
      L('You are designing the organisation you will run in Saudi Arabia.', 'تصمم المؤسسة التي ستديرها في السعودية.')
    ],
    challenges: [
      L('You are not sure what localisation expects of a business like yours.', 'لست متأكدًا مما يتوقعه التوطين من أعمال مثل أعمالك.'),
      L('Good people are in demand and hard to attract and keep.', 'الكفاءات الجيدة مطلوبة ويصعب استقطابها والاحتفاظ بها.'),
      L('Roles, grades and pay need to feel right locally, not just on paper.', 'الأدوار والدرجات والرواتب يجب أن تبدو مناسبة محليًا، لا على الورق فقط.'),
      L('Visas, residency and family relocation have a lot of moving parts.', 'التأشيرات والإقامة وانتقال الأسرة فيها أجزاء كثيرة متحركة.')
    ],
    scopeLead: L('Practical help with planning, hiring and moving.', 'مساعدة عملية في التخطيط والتوظيف والانتقال.'),
    scope: [
      L('Organisation design and workforce planning', 'تصميم الهيكل التنظيمي وتخطيط القوى العاملة'),
      L('A localisation approach and role mapping', 'منهج للتوطين وتوصيف الأدوار'),
      L('Coordinating the search for executives and specialists', 'تنسيق البحث عن التنفيذيين والمتخصصين'),
      L('Pay and benefits benchmarking', 'مقارنة الرواتب والمزايا'),
      L('Visa, residency and relocation coordination', 'تنسيق التأشيرات والإقامة والانتقال'),
      L('Onboarding and settling-in support', 'دعم الاستقبال والاستقرار')
    ],
    deliverables: [
      L('An organisation and workforce plan', 'خطة للهيكل التنظيمي والقوى العاملة'), L('A localisation roadmap', 'خارطة طريق للتوطين'),
      L('Role profiles and pay benchmarks', 'توصيفات الأدوار ومقارنات الرواتب'), L('A plan for moving your executives', 'خطة لنقل تنفيذييك'), L('An onboarding outline', 'إطار للاستقبال')
    ],
    process: [
      { t: L('Plan', 'نخطط'), d: L('We work out the organisation you need and which roles to fill first.', 'نحدد المؤسسة التي تحتاجها والأدوار التي تُشغل أولًا.') },
      { t: L('Find', 'نبحث'), d: L('We coordinate the search for, and assessment of, your key people.', 'ننسق البحث عن أشخاصك الرئيسيين وتقييمهم.') },
      { t: L('Move', 'ننقل'), d: L('We help with visas, residency and the practical side of settling in.', 'نساعد في التأشيرات والإقامة والجانب العملي للاستقرار.') },
      { t: L('Settle', 'نرسّخ'), d: L('We help new people join well and fit into the way you work.', 'نساعد الأشخاص الجدد على الانضمام بشكل جيد والتوافق مع طريقة عملكم.') }
    ],
    faqs: [
      { q: L('Do you do the recruiting yourselves?', 'هل تتولون التوظيف بأنفسكم؟'), a: L('We coordinate the search and the assessment, and we bring in qualified recruitment partners where you need specialist reach.', 'ننسق البحث والتقييم، ونستعين بشركاء توظيف مؤهلين حيث تحتاج إلى شبكة متخصصة.') },
      { q: L('Can you explain what Saudisation means for us?', 'هل يمكنكم شرح ما يعنيه التوطين لنا؟'), a: L('Yes. We outline what applies to your sector and size and help you plan a practical approach. We always confirm the current details with the relevant authority.', 'نعم. نوضح ما ينطبق على قطاعك وحجمك ونساعدك على وضع نهج عملي. ونؤكد التفاصيل الحالية دائمًا مع الجهة المختصة.') },
      { q: L('Do you help families who are relocating?', 'هل تساعدون الأسر المنتقلة؟'), a: L('We coordinate the practical steps: residency, information about schools, and help with settling in.', 'ننسق الخطوات العملية: الإقامة ومعلومات المدارس والمساعدة على الاستقرار.') }
    ],
    related: ['formation-establishment', 'operations-business-support', 'governance-finance-compliance']
  },
  {
    slug: 'operations-business-support', stage: 'operate', icon: 'gear', card: 'svc-operations', hero: 'hero-skyline-dusk', heroPos: 'right center',
    title: L('Operations & Business Support', 'العمليات ودعم الأعمال'),
    short: L('Getting your day-to-day running smoothly, and keeping it that way.', 'ضبط عملك اليومي ليسير بسلاسة، وإبقاؤه كذلك.'),
    lead: L('The excitement of arriving fades quickly if the basics do not work. Premises, suppliers, processes, reporting: we help you set them up properly so your business runs smoothly from the first week.', 'تتلاشى حماسة الوصول سريعًا إن لم تعمل الأساسيات. المقر والموردون والإجراءات والتقارير: نساعدك على تهيئتها بشكل سليم ليسير عملك بسلاسة منذ الأسبوع الأول.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('From set-up to steady state', 'من التأسيس إلى الاستقرار التشغيلي'), img: 'lounge-arch',
      body: L('We help you find premises, line up suppliers, design simple processes and put reporting in place, then refine the way you work as volumes grow. We design, set up and support. The day-to-day running stays with your team or the provider you choose.', 'نساعدك على إيجاد المقر وتأمين الموردين وتصميم إجراءات بسيطة ووضع التقارير في مكانها، ثم نحسّن طريقة عملك مع نمو الأحجام. نصمم ونؤسس وندعم. وتبقى الإدارة اليومية لفريقك أو لمقدم الخدمة الذي تختاره.') },
    whoFor: [
      L('You are opening your first Saudi office, site or facility.', 'تفتتح أول مكتب أو موقع أو منشأة لك في السعودية.'),
      L('You are building local supply chains and supplier relationships.', 'تبني سلاسل إمداد وعلاقات موردين محلية.'),
      L('You want the same way of working across regions.', 'تريد طريقة عمل موحدة عبر المناطق.'),
      L('You are getting ready for more volume or higher service levels.', 'تستعد لحجم أكبر أو مستويات خدمة أعلى.')
    ],
    challenges: [
      L('Finding suitable premises, suppliers and service providers takes time.', 'إيجاد المقر والموردين ومقدمي الخدمات المناسبين يستغرق وقتًا.'),
      L('Processes need to meet local requirements, not just your head office’s.', 'الإجراءات يجب أن تلبي المتطلبات المحلية، لا متطلبات مقرك الرئيسي وحدها.'),
      L('Reporting and control are easiest to build at the start, and hardest to add later.', 'التقارير والرقابة أسهل بناءً في البداية وأصعب إضافةً لاحقًا.'),
      L('Growth can quietly erode service quality.', 'قد يضعف النمو جودة الخدمة بهدوء.')
    ],
    scopeLead: L('Down-to-earth support that gets things running and keeps them improving.', 'دعم واقعي يشغّل الأمور ويواصل تحسينها.'),
    scope: [
      L('Designing the operating model and processes', 'تصميم النموذج التشغيلي والإجراءات'),
      L('Finding premises and facilities', 'إيجاد المقرات والمرافق'),
      L('Identifying suppliers and vendors', 'تحديد الموردين ومقدمي الخدمات'),
      L('Service levels and performance reporting', 'مستويات الخدمة وتقارير الأداء'),
      L('Choosing systems and tools', 'اختيار الأنظمة والأدوات'),
      L('A simple improvement roadmap', 'خارطة طريق بسيطة للتحسين')
    ],
    deliverables: [
      L('An operating-model blueprint', 'مخطط للنموذج التشغيلي'), L('A process and responsibility map', 'خريطة للإجراءات والمسؤوليات'),
      L('A supplier shortlist', 'قائمة مختصرة بالموردين'), L('A performance dashboard outline', 'إطار للوحة مؤشرات الأداء'), L('An improvement roadmap', 'خارطة طريق للتحسين')
    ],
    process: [
      { t: L('Design', 'نصمم'), d: L('We shape an operating model around your goals, not a template.', 'نشكّل نموذجًا تشغيليًا حول أهدافك، لا قالبًا جاهزًا.') },
      { t: L('Set up', 'نؤسس'), d: L('We help with premises, suppliers and processes.', 'نساعد في المقر والموردين والإجراءات.') },
      { t: L('Run', 'نشغّل'), d: L('We help your team work to agreed standards, with clear reporting.', 'نساعد فريقك على العمل وفق معايير متفق عليها وتقارير واضحة.') },
      { t: L('Improve', 'نحسّن'), d: L('We review performance and refine as you grow.', 'نراجع الأداء ونحسّنه مع نموك.') }
    ],
    faqs: [
      { q: L('Do you run operations for us?', 'هل تديرون العمليات نيابةً عنا؟'), a: L('No. We design, set up and support. Running the business day to day stays with your team or the provider you choose.', 'لا. نصمم ونؤسس وندعم. وتبقى إدارة الأعمال اليومية لفريقك أو لمقدم الخدمة الذي تختاره.') },
      { q: L('Can you help if we are starting small?', 'هل تساعدون إن كانت بدايتنا صغيرة؟'), a: L('Of course. Many clients begin lean and scale in stages once demand is proven. That is often the wisest way to start.', 'بالتأكيد. يبدأ كثير من عملائنا بشكل رشيق ثم يتوسعون على مراحل بعد تأكد الطلب. وهذه غالبًا أحكم طريقة للبدء.') },
      { q: L('How do you choose suppliers?', 'كيف تختارون الموردين؟'), a: L('Against criteria we agree with you first: capability, compliance, references and cost.', 'وفق معايير نتفق عليها معك أولًا: القدرة والامتثال والمراجع والتكلفة.') }
    ],
    related: ['hr-talent-executive-mobility', 'technology-automation', 'governance-finance-compliance']
  },
  {
    slug: 'governance-finance-compliance', stage: 'operate', icon: 'doc', card: 'svc-governance', hero: 'hero-skyline-wide', heroPos: 'right center',
    title: L('Governance, Finance & Compliance Coordination', 'تنسيق الحوكمة والمالية والامتثال'),
    short: L('Keeping governance, finance and compliance in order, without the headaches.', 'إبقاء الحوكمة والمالية والامتثال منظمة، دون صداع.'),
    lead: L('Nobody opens a business to spend their time on filing calendars. We help you set up governance, finance and compliance so they run quietly in the background, alongside the licensed advisers you rely on.', 'لا أحد يفتح شركة ليقضي وقته في تقويمات التقديم. نساعدك على ترتيب الحوكمة والمالية والامتثال لتعمل بهدوء في الخلفية، إلى جانب المستشارين المرخّصين الذين تعتمد عليهم.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('A clear view of your obligations', 'رؤية واضحة لالتزاماتك'), img: 'colonnade-tower',
      body: L('We coordinate with your legal, tax and accounting advisers and the relevant authorities, and help you see what you owe, to whom, and by when. To be clear: we are not a law, tax or audit firm. We coordinate and structure the work; your licensed advisers give the professional advice.', 'ننسق مع مستشاريك القانونيين والضريبيين والمحاسبيين ومع الجهات المختصة، ونساعدك على رؤية ما عليك ولمن ومتى. ولنكن واضحين: لسنا مكتب محاماة ولا ضرائب ولا مراجعة. ننسق العمل وننظمه، ويقدم مستشاروك المرخّصون المشورة المهنية.') },
    whoFor: [
      L('You have just set up a Saudi entity and are building its controls.', 'أسست كيانًا سعوديًا للتو وتبني ضوابطه.'),
      L('Your finance and legal teams are coordinating across several advisers.', 'فريقاك المالي والقانوني ينسقان بين عدة مستشارين.'),
      L('Your board wants clarity on its governance responsibilities.', 'يريد مجلس إدارتك وضوحًا في مسؤولياته في الحوكمة.'),
      L('You need to align local reporting with group standards.', 'تحتاج إلى مواءمة التقارير المحلية مع معايير المجموعة.')
    ],
    challenges: [
      L('Filing, reporting and renewal dates are easy to lose track of.', 'مواعيد التقديم والتقارير والتجديد يسهل أن تضيع.'),
      L('Group policies need to fit local requirements, and they rarely do automatically.', 'سياسات المجموعة يجب أن تناسب المتطلبات المحلية، وقلّما تناسبها تلقائيًا.'),
      L('Several advisers and authorities are involved, and someone has to hold it all together.', 'تشارك عدة مستشارين وجهات، ويجب أن يمسك أحد بالخيوط كلها.'),
      L('A new entity needs governance that is proportionate, not heavy.', 'الكيان الجديد يحتاج حوكمة متناسبة لا ثقيلة.')
    ],
    scopeLead: L('Coordination and structure, working alongside your professional advisers.', 'تنسيق وهيكلة بالتعاون مع مستشاريك المهنيين.'),
    scope: [
      L('A governance framework and delegation of authority', 'إطار حوكمة وتفويض للصلاحيات'),
      L('A compliance calendar and register of obligations', 'تقويم للامتثال وسجل بالالتزامات'),
      L('Coordinating finance and reporting set-up', 'تنسيق إعداد المالية والتقارير'),
      L('Aligning policies with group standards', 'مواءمة السياسات مع معايير المجموعة'),
      L('Working with your legal, tax and audit advisers', 'العمل مع مستشاريك القانونيين والضريبيين والمراجعين'),
      L('A risk register and outline of controls', 'سجل مخاطر وإطار للضوابط')
    ],
    deliverables: [
      L('A governance framework outline', 'مخطط لإطار الحوكمة'), L('A compliance and filing calendar', 'تقويم للامتثال والتقديم'),
      L('A register of obligations', 'سجل بالالتزامات'), L('A policy alignment summary', 'ملخص لمواءمة السياسات'), L('A plan for coordinating your advisers', 'خطة لتنسيق مستشاريك')
    ],
    process: [
      { t: L('Map', 'نرسم'), d: L('We map your obligations, your advisers and who decides what.', 'نرسم التزاماتك ومستشاريك ومن يقرر ماذا.') },
      { t: L('Design', 'نصمم'), d: L('We outline a proportionate framework and a calendar you can actually follow.', 'نضع إطارًا متناسبًا وتقويمًا تستطيع اتباعه فعلًا.') },
      { t: L('Coordinate', 'ننسق'), d: L('We bring the inputs from advisers and authorities together.', 'نجمع مدخلات المستشارين والجهات معًا.') },
      { t: L('Embed', 'نرسّخ'), d: L('We help your team run it day to day.', 'نساعد فريقك على تطبيقه يوميًا.') }
    ],
    faqs: [
      { q: L('Are you a law, tax or audit firm?', 'هل أنتم مكتب محاماة أو ضرائب أو مراجعة؟'), a: L('No. We coordinate and structure the work. For professional advice you rely on your own licensed legal, tax and audit advisers.', 'لا. ننسق العمل وننظمه. وللحصول على المشورة المهنية تعتمد على مستشاريك المرخّصين في القانون والضرائب والمراجعة.') },
      { q: L('Can you introduce us to advisers?', 'هل يمكنكم التعريف بمستشارين؟'), a: L('Yes, where it helps, we can introduce qualified firms. You decide whom to appoint.', 'نعم، حيث يفيد ذلك، يمكننا التعريف بمكاتب مؤهلة. وأنت من يقرر من تعيّنه.') },
      { q: L('Can you help with board reporting?', 'هل تساعدون في تقارير مجلس الإدارة؟'), a: L('We can help you structure the governance and compliance information your board needs to see.', 'يمكننا مساعدتك على تنظيم معلومات الحوكمة والامتثال التي يحتاج مجلسك إلى الاطلاع عليها.') }
    ],
    related: ['formation-establishment', 'operations-business-support', 'market-strategy-entry']
  },
  {
    slug: 'brand-marketing-digital-growth', stage: 'grow', icon: 'megaphone', card: 'svc-brand', hero: 'hero-corniche', heroPos: 'right center',
    title: L('Brand, Marketing & Digital Growth', 'العلامة التجارية والتسويق والنمو الرقمي'),
    short: L('Making your brand relevant to Saudi customers, and turning attention into demand.', 'جعل علامتك مؤثرة لدى العميل السعودي، وتحويل الاهتمام إلى طلب.'),
    lead: L('A brand that works in London or Singapore does not automatically work in Riyadh or Jeddah. We help you speak to Saudi customers in a way that feels natural, and build the digital presence that turns interest into sales.', 'العلامة التي تنجح في لندن أو سنغافورة لا تنجح تلقائيًا في الرياض أو جدة. نساعدك على مخاطبة العميل السعودي بشكل طبيعي، وبناء الحضور الرقمي الذي يحوّل الاهتمام إلى مبيعات.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('Be relevant, and be remembered', 'كن ذا صلة، وابقَ في الذاكرة'), img: 'ins-wall',
      body: L('We help you decide what to keep global and what to adapt locally, from your message and your pricing to your language and your channels. Then we build a marketing plan you can measure. We focus on strategy and planning, and we coordinate specialist agencies for production and media where you need them.', 'نساعدك على تحديد ما يبقى عالميًا وما يُكيَّف محليًا، من رسالتك وتسعيرك إلى لغتك وقنواتك. ثم نبني خطة تسويق تستطيع قياسها. نركّز على الاستراتيجية والتخطيط، وننسق مع وكالات متخصصة للإنتاج والوسائط حيث تحتاج إليها.') },
    whoFor: [
      L('You are an international brand localising for Saudi consumers.', 'أنت علامة دولية تكيّف حضورها للمستهلك السعودي.'),
      L('You are launching a new product or service in the Kingdom.', 'تطلق منتجًا أو خدمة جديدة في المملكة.'),
      L('You are building an Arabic and English digital presence.', 'تبني حضورًا رقميًا بالعربية والإنجليزية.'),
      L('You want your marketing spend to produce results you can measure.', 'تريد أن يحقق إنفاقك التسويقي نتائج تستطيع قياسها.')
    ],
    challenges: [
      L('Your message needs to fit local culture and language, not just be translated.', 'رسالتك يجب أن تناسب الثقافة واللغة المحلية، لا أن تُترجم فقط.'),
      L('It is hard to choose the right channels and creators.', 'يصعب اختيار القنوات وصناع المحتوى المناسبين.'),
      L('You are pricing and positioning against competitors who are already established.', 'تسعّر وتتموضع أمام منافسين راسخين بالفعل.'),
      L('You cannot yet tell whether early marketing spend is paying off.', 'لا تستطيع بعد أن تعرف إن كان الإنفاق التسويقي المبكر يؤتي ثماره.')
    ],
    scopeLead: L('Strategy first, then focused work you can measure.', 'الاستراتيجية أولًا، ثم عمل مركّز تستطيع قياسه.'),
    scope: [
      L('Brand positioning and message adaptation', 'تموضع العلامة وتكييف الرسالة'),
      L('A review of pricing and your offer', 'مراجعة التسعير وعرضك'),
      L('Channel strategy and campaign planning', 'استراتيجية القنوات وتخطيط الحملات'),
      L('A content strategy in Arabic and English', 'استراتيجية محتوى بالعربية والإنجليزية'),
      L('Guidance on your digital presence, search and e-commerce', 'إرشاد حول حضورك الرقمي والبحث والتجارة الإلكترونية'),
      L('A measurement framework, and reporting you can read', 'إطار للقياس وتقارير تستطيع قراءتها')
    ],
    deliverables: [
      L('A positioning and messaging framework', 'إطار للتموضع والرسائل'), L('Pricing and offer recommendations', 'توصيات للتسعير والعرض'),
      L('A channel and campaign plan', 'خطة للقنوات والحملات'), L('A content calendar outline', 'مخطط لتقويم المحتوى'), L('A measurement dashboard outline', 'إطار للوحة القياس')
    ],
    process: [
      { t: L('Listen', 'نستمع'), d: L('We learn your brand, your audience and your competitors.', 'نتعرف على علامتك وجمهورك ومنافسيك.') },
      { t: L('Position', 'نموضع'), d: L('We adapt your positioning and pricing for Saudi customers.', 'نكيّف تموضعك وتسعيرك للعميل السعودي.') },
      { t: L('Plan', 'نخطط'), d: L('We plan the channels, content and campaigns.', 'نخطط القنوات والمحتوى والحملات.') },
      { t: L('Measure', 'نقيس'), d: L('We set up reporting and keep improving with real data.', 'نهيئ التقارير ونواصل التحسين ببيانات حقيقية.') }
    ],
    faqs: [
      { q: L('Do you run the campaigns?', 'هل تنفذون الحملات؟'), a: L('We focus on strategy and planning. For production and media buying we coordinate specialist agencies, so you get the right people for each job.', 'نركّز على الاستراتيجية والتخطيط. وللإنتاج وشراء الوسائط ننسق مع وكالات متخصصة، لتحصل على الأشخاص المناسبين لكل مهمة.') },
      { q: L('Can you adapt our existing brand?', 'هل يمكنكم تكييف علامتنا الحالية؟'), a: L('Yes. We advise on what should stay global and what should change locally, including language and tone.', 'نعم. نقدم المشورة حول ما يبقى عالميًا وما يتغير محليًا، بما فيه اللغة والنبرة.') },
      { q: L('How will we know it is working?', 'كيف سنعرف أنه يعمل؟'), a: L('We agree a few measures with you at the start, linked to awareness, demand and sales, and we report on them in plain language.', 'نتفق معك على بضعة مؤشرات في البداية، مرتبطة بالوعي والطلب والمبيعات، ونقدم تقاريرها بلغة واضحة.') }
    ],
    related: ['market-strategy-entry', 'partnerships-commercial-development', 'technology-automation']
  },
  {
    slug: 'technology-automation', stage: 'grow', icon: 'chip', card: 'svc-tech', hero: 'ck-hero-night', heroPos: 'right center',
    title: L('Technology & Automation', 'التقنية والأتمتة'),
    short: L('Choosing the right technology, and letting it take the repetitive work.', 'اختيار التقنية المناسبة، وترك العمل المتكرر لها.'),
    lead: L('Technology should make your Saudi operation simpler, not more complicated. We help you work out what you actually need, choose it without the sales pitch, and put it to work.', 'ينبغي أن تجعل التقنية عملياتك في السعودية أبسط لا أكثر تعقيدًا. نساعدك على تحديد ما تحتاجه فعلًا، واختياره بعيدًا عن لغة البيع، وتشغيله.'),
    overview: { eyebrow: L('Service overview', 'نظرة على الخدمة'), heading: L('Technology that serves the plan', 'تقنية تخدم الخطة'), img: 'palms-arch',
      body: L('We help you assess your needs, compare solutions without bias, plan the implementation and find the repetitive work worth automating, with data, security and local requirements in mind from the start. Our advice is vendor-neutral: we do not resell software or take commission from technology providers.', 'نساعدك على تقييم احتياجاتك ومقارنة الحلول دون تحيز وتخطيط التنفيذ وإيجاد الأعمال المتكررة التي تستحق الأتمتة، مع مراعاة البيانات والأمن والمتطلبات المحلية منذ البداية. ومشورتنا محايدة تجاه المورّدين: لا نعيد بيع البرمجيات ولا نتقاضى عمولة من مزودي التقنية.') },
    whoFor: [
      L('You are choosing the systems for a new Saudi entity.', 'تختار الأنظمة لكيان سعودي جديد.'),
      L('Your teams spend too much time on manual, repetitive tasks.', 'تقضي فرقك وقتًا كثيرًا في مهام يدوية متكررة.'),
      L('You are planning a digital roadmap and want it to be realistic.', 'تخطط لخارطة طريق رقمية وتريدها واقعية.'),
      L('You need local systems and group systems to work together.', 'تحتاج إلى أن تعمل الأنظمة المحلية وأنظمة المجموعة معًا.')
    ],
    challenges: [
      L('There are too many platforms and not enough honest guidance.', 'هناك منصات كثيرة وإرشاد صادق قليل.'),
      L('Data hosting and security expectations need to be met from day one.', 'يجب تلبية توقعات استضافة البيانات والأمن منذ اليوم الأول.'),
      L('Systems have to connect across entities and countries.', 'يجب أن تتصل الأنظمة عبر الكيانات والدول.'),
      L('Automation projects can cost a lot and deliver little.', 'قد تكلّف مشاريع الأتمتة كثيرًا وتحقق قليلًا.')
    ],
    scopeLead: L('Impartial advice, from working out the need to making sure people use the result.', 'مشورة محايدة، من تحديد الحاجة إلى التأكد من استخدام الناس للنتيجة.'),
    scope: [
      L('A needs assessment and technology roadmap', 'تقييم الاحتياجات وخارطة طريق تقنية'),
      L('Comparing solutions without bias', 'مقارنة الحلول دون تحيز'),
      L('Finding the automation opportunities worth pursuing', 'إيجاد فرص الأتمتة التي تستحق المتابعة'),
      L('A checklist for data, security and local requirements', 'قائمة تحقق للبيانات والأمن والمتطلبات المحلية'),
      L('Implementation planning and change support', 'تخطيط التنفيذ ودعم التغيير'),
      L('Tracking the benefits and checking adoption', 'تتبع المنافع والتحقق من الاعتماد')
    ],
    deliverables: [
      L('A technology roadmap', 'خارطة طريق تقنية'), L('A solution shortlist and evaluation', 'قائمة حلول مختصرة وتقييمها'),
      L('An automation opportunity register', 'سجل بفرص الأتمتة'), L('An implementation plan', 'خطة تنفيذ'), L('A benefits tracking framework', 'إطار لتتبع المنافع')
    ],
    process: [
      { t: L('Assess', 'نقيّم'), d: L('We map your needs, your current systems and your constraints.', 'نرسم احتياجاتك وأنظمتك الحالية وقيودك.') },
      { t: L('Choose', 'نختار'), d: L('We compare options against criteria we agree with you.', 'نقارن الخيارات وفق معايير نتفق عليها معك.') },
      { t: L('Implement', 'ننفذ'), d: L('We plan the rollout and coordinate it with your providers.', 'نخطط للتطبيق وننسقه مع مزوديك.') },
      { t: L('Adopt', 'نرسّخ الاستخدام'), d: L('We check the benefits arrive and that people use what was built.', 'نتحقق من وصول المنافع ومن استخدام الناس لما بُني.') }
    ],
    faqs: [
      { q: L('Do you sell software?', 'هل تبيعون البرمجيات؟'), a: L('No. Our advice is vendor-neutral, and we do not earn commission from any technology provider.', 'لا. مشورتنا محايدة تجاه المورّدين، ولا نتقاضى عمولة من أي مزود تقنية.') },
      { q: L('Can you help with data-hosting questions?', 'هل تساعدون في أسئلة استضافة البيانات؟'), a: L('We help you frame the questions and the requirements. You then confirm the specifics with your own legal and security advisers.', 'نساعدك على صياغة الأسئلة والمتطلبات. ثم تؤكد التفاصيل مع مستشاريك القانونيين والأمنيين.') },
      { q: L('Where should automation start?', 'من أين تبدأ الأتمتة؟'), a: L('Usually with high-volume, rule-based work where the benefit is easy to measure. Small wins first builds confidence for the bigger ones.', 'عادةً بالأعمال كثيفة الحجم القائمة على قواعد حيث تسهل قياس المنفعة. وتبني المكاسب الصغيرة الثقة للمكاسب الأكبر.') }
    ],
    related: ['operations-business-support', 'brand-marketing-digital-growth', 'governance-finance-compliance']
  }
];

export const serviceBySlug = (s) => SERVICES.find((x) => x.slug === s);
