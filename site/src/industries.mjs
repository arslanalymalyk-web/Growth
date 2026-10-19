import { L } from './ui.mjs';

export const INDUSTRIES = [
  {
    slug: 'real-estate', group: 'core', icon: 'building', card: 'ind-realestate', hero: 'p-district-skyline', over: 'hero-riyadh-sunset',
    title: L('Real Estate', 'العقارات'),
    short: L('Real Estate', 'العقارات'),
    tagline: L('For developers, investors and operators who want to build, buy or run property in a market that is growing fast.', 'للمطورين والمستثمرين والمشغّلين الذين يريدون البناء أو الشراء أو إدارة العقار في سوق ينمو بسرعة.'),
    overviewTitle: L('Big projects, local detail', 'مشاريع كبرى وتفاصيل محلية'),
    overview: L('New districts, large programmes and growing demand for homes, offices and shops are changing the property map of the Kingdom. The opportunity is real, but so is the detail: who owns the land, which approvals come in which order, and who is actually able to build. We help you understand the market, the approvals landscape and the right local specialists, so you can judge a project before you commit.', 'تغيّر الأحياء الجديدة والبرامج الكبرى والطلب المتنامي على المساكن والمكاتب والمتاجر خريطة العقار في المملكة. الفرصة حقيقية، وكذلك التفاصيل: من يملك الأرض، وأي الموافقات تأتي بأي ترتيب، ومن يستطيع البناء فعلًا. نساعدك على فهم السوق ومشهد الموافقات والمتخصصين المحليين المناسبين، لتحكم على المشروع قبل أن تلتزم.'),
    challengesTitle: L('What tends to trip investors up', 'ما يعثّر المستثمرين عادةً'),
    challenges: [
      [L('Choosing the right opportunity', 'اختيار الفرصة المناسبة'), L('Which district, which type of asset, and which partners fit your investment case.', 'أي حي وأي نوع من الأصول وأي شركاء يناسبون قضيتك الاستثمارية.'), 'target'],
      [L('Understanding the rules', 'فهم الأنظمة'), L('Ownership, registration and development rules have been changing. What was true last year may not be now.', 'تتغير أنظمة التملك والتسجيل والتطوير. وما كان صحيحًا العام الماضي قد لا يكون كذلك اليوم.'), 'doc'],
      [L('Delivery and the people who deliver', 'التنفيذ ومن ينفذ'), L('Good contractors and consultants are in demand. Capacity is often the real constraint.', 'المقاولون والاستشاريون الجيدون مطلوبون، والطاقة الاستيعابية هي القيد الحقيقي غالبًا.'), 'handshake'],
      [L('Making it perform after it is built', 'جعله مجديًا بعد البناء'), L('Asset management and operations decide long-term value, and they are often an afterthought.', 'إدارة الأصول والتشغيل يحددان القيمة طويلة الأمد، وغالبًا ما يُهملان.'), 'chart']
    ],
    services: ['market-intelligence', 'market-entry-guidance', 'strategic-introductions']
  },

  {
    slug: 'manufacturing', group: 'core', icon: 'factory', card: 'ind-manufacturing', hero: 'p-manufacturing-floor', over: 'ind-tech',
    title: L('Industry & Manufacturing', 'الصناعة والتصنيع'),
    short: L('Manufacturing', 'التصنيع'),
    tagline: L('For manufacturers and industrial investors building plants, supply chains and skills in the Kingdom.', 'للمصنّعين والمستثمرين الصناعيين الذين يبنون المصانع وسلاسل الإمداد والمهارات في المملكة.'),
    overviewTitle: L('A country that wants to make more', 'بلد يريد أن يصنع أكثر'),
    overview: L('Saudi Arabia is investing heavily in local manufacturing, and it has put policy, financing and land behind the goal. That is good news if you are planning a plant, but a plant is only as good as its site, its supply chain and its people. We help you understand where to build, what support may be available, and which approvals to plan for.', 'تستثمر السعودية بقوة في التصنيع المحلي، وقد وضعت خلف الهدف سياسات وتمويلًا وأراضي. وهذا خبر جيد إن كنت تخطط لمصنع، لكن المصنع بقدر موقعه وسلسلة إمداده وأشخاصه. نساعدك على فهم أين تبني وما الدعم المتاح وأي الموافقات ينبغي التخطيط لها.'),
    challengesTitle: L('Where plants tend to lose time', 'أين تفقد المصانع وقتها عادةً'),
    challenges: [
      [L('Site and incentives', 'الموقع والحوافز'), L('The right location, and an honest picture of the support you can and cannot count on.', 'الموقع المناسب، وصورة صادقة عن الدعم الذي تستطيع الاعتماد عليه وما لا تستطيع.'), 'pin'],
      [L('A supply chain that works locally', 'سلسلة إمداد تعمل محليًا'), L('Reliable suppliers and logistics, close enough to keep your costs sensible.', 'موردون ولوجستيات موثوقة وقريبة بما يكفي لإبقاء تكاليفك معقولة.'), 'network'],
      [L('Skilled people', 'الكفاءات الماهرة'), L('Recruiting and training technicians, while meeting localisation expectations.', 'توظيف الفنيين وتدريبهم مع تلبية توقعات التوطين.'), 'users'],
      [L('Technology and automation', 'التقنية والأتمتة'), L('Productivity decides who competes. The right level of automation is a decision, not a default.', 'الإنتاجية تحدد من ينافس. والمستوى المناسب من الأتمتة قرار لا افتراض.'), 'chip']
    ],
    services: ['market-intelligence', 'market-entry-guidance', 'cultural-business-advisory']
  },

  {
    slug: 'healthcare-life-sciences', group: 'core', icon: 'steth', card: 'ind-healthcare', hero: 'p-healthcare', over: 'ind-healthcare',
    title: L('Healthcare & Life Sciences', 'الرعاية الصحية وعلوم الحياة'),
    short: L('Healthcare & Life Sciences', 'الرعاية الصحية وعلوم الحياة'),
    tagline: L('For providers, suppliers and investors working with a healthcare system that is being reshaped.', 'لمقدمي الخدمة والموردين والمستثمرين الذين يعملون مع منظومة صحية يُعاد تشكيلها.'),
    overviewTitle: L('A sector in transformation', 'قطاع في طور التحول'),
    overview: L('How care is funded, delivered and measured is changing. There is more room for private providers, more attention on prevention, and more digital health. Healthcare is also one of the most regulated sectors there is, and rightly so. We help you understand who the main bodies are, how approvals generally work, and where partnerships fit.', 'تتغير طريقة تمويل الرعاية وتقديمها وقياسها. هناك مساحة أكبر لمقدمي الخدمة من القطاع الخاص، واهتمام أكبر بالوقاية، وصحة رقمية أكثر. والرعاية الصحية أيضًا من أكثر القطاعات تنظيمًا، وهذا في محله. نساعدك على فهم الجهات الرئيسية وكيف تسير الموافقات عمومًا وأين تناسب الشراكات.'),
    challengesTitle: L('What providers and suppliers face', 'ما يواجهه مقدمو الخدمة والموردون'),
    challenges: [
      [L('Rising demand', 'طلب متزايد'), L('A growing, more health-conscious population expects better access and more personal care.', 'سكان يتزايدون ووعيهم الصحي يرتفع يتوقعون وصولًا أفضل ورعاية أكثر شخصية.'), 'heart'],
      [L('A system in change', 'منظومة تتغير'), L('Reform is moving towards integrated, value-based and digital models of care.', 'يتجه الإصلاح نحو نماذج رعاية متكاملة وقائمة على القيمة ورقمية.'), 'gear'],
      [L('Cost and sustainability', 'التكلفة والاستدامة'), L('Managing cost pressure while keeping the service financially sound.', 'إدارة ضغط التكلفة مع إبقاء الخدمة سليمة ماليًا.'), 'coins'],
      [L('People and skills', 'الأشخاص والمهارات'), L('Attracting and keeping clinicians and specialists in a sector that is growing fast.', 'استقطاب الأطباء والمتخصصين والاحتفاظ بهم في قطاع ينمو بسرعة.'), 'users']
    ],
    services: ['market-intelligence', 'strategic-introductions', 'market-entry-guidance']
  },

  {
    slug: 'fmcg', group: 'target', icon: 'cart', card: 'ind-fmcg', hero: 'p-fmcg', over: 'p-fmcg-overview',
    title: L('FMCG & Consumer Brands', 'السلع الاستهلاكية سريعة الحركة'),
    short: L('FMCG', 'السلع الاستهلاكية'),
    tagline: L('Helping consumer brands, retailers and distributors get onto Saudi shelves, stay there, and grow.', 'نساعد العلامات الاستهلاكية وتجار التجزئة والموزعين على الوصول إلى الرفوف السعودية والبقاء فيها والنمو.'),
    overviewTitle: L('A market that rewards the brands who get it right', 'سوق يكافئ العلامات التي تُحسن التصرف'),
    overview: L('Saudi shoppers are young, connected and used to choice. They notice quality, value and a good story, and they switch quickly when a brand lets them down. For brands, that means a real opportunity and a high bar. We help you read the market, meet distributors and retail partners, and understand how Saudi buyers decide.', 'المتسوق السعودي شاب ومتصل ومعتاد على الاختيار. يلاحظ الجودة والقيمة والقصة الجيدة، وينتقل سريعًا حين تخذله علامة. وهذا يعني فرصة حقيقية ومعيارًا عاليًا. نساعدك على قراءة السوق ولقاء الموزعين وشركاء التجزئة وفهم كيف يقرر المشتري السعودي.'),
    challengesTitle: L('Where consumer brands usually get stuck', 'أين تتعثر العلامات الاستهلاكية عادةً'),
    challenges: [
      [L('Shoppers expect more', 'المتسوقون يتوقعون أكثر'), L('Quality, value, health and a story they believe in. Getting just one of them wrong is enough to lose a repeat purchase.', 'جودة وقيمة وصحة وقصة يصدقونها. وإخفاقك في واحدة منها يكفي لتخسر الشراء المتكرر.'), 'cart'],
      [L('Everyone is competing', 'الجميع ينافس'), L('Global giants, regional brands and fast local challengers all want the same shelf.', 'عمالقة عالميون وعلامات إقليمية ومنافسون محليون سريعون، كلهم يريد الرف نفسه.'), 'chart'],
      [L('Many channels to juggle', 'قنوات كثيرة للتعامل معها'), L('Modern trade, neighbourhood shops and online all work differently, and they all want your attention.', 'التجارة الحديثة والبقالات والمتاجر الإلكترونية تعمل بطرق مختلفة، وكلها تريد انتباهك.'), 'network'],
      [L('Rules keep moving', 'الأنظمة تتحرك باستمرار'), L('Labelling, registration and localisation requirements change, and an old answer can quickly become the wrong one.', 'تتغير متطلبات البطاقات والتسجيل والتوطين، وقد يصبح الجواب القديم خاطئًا بسرعة.'), 'leaf']
    ],
    services: ['market-intelligence', 'strategic-introductions', 'cultural-business-advisory', 'market-entry-guidance']
  },

  {
    slug: 'hospitality', group: 'target', icon: 'bell', card: 'ind-hospitality', hero: 'p-hospitality-lobby', over: 'lounge-arch',
    title: L('Hospitality', 'الضيافة'),
    short: L('Hospitality', 'الضيافة'),
    tagline: L('Helping hotel, restaurant and experience operators open well and run well in a visitor economy that is being built right now.', 'نساعد مشغّلي الفنادق والمطاعم والتجارب على الافتتاح الجيد والتشغيل الجيد في اقتصاد زوّار يُبنى الآن.'),
    overviewTitle: L('A new visitor economy, built from the ground up', 'اقتصاد زوّار جديد يُبنى من الأساس'),
    overview: L('Saudi Arabia is welcoming more visitors, building new destinations and rethinking what a stay can feel like. For operators, that is exciting, and demanding. You have to staff and license venues, plan for peaks and quiet months, and match the standards guests expect. We help you read the market, meet the right partners and understand what guests and regulators expect.', 'تستقبل السعودية زوّارًا أكثر وتبني وجهات جديدة وتعيد التفكير في معنى الإقامة. وهذا مثير للمشغّلين، وشاق أيضًا. عليك توظيف المنشآت وترخيصها، والتخطيط للذروة والأشهر الهادئة، ومواكبة المعايير التي يتوقعها الضيوف. نساعدك على قراءة السوق ولقاء الشركاء المناسبين وفهم ما يتوقعه النزلاء والجهات التنظيمية.'),
    challengesTitle: L('What operators find hardest', 'ما يجده المشغّلون الأصعب'),
    challenges: [
      [L('Guests expect a lot', 'الضيوف يتوقعون الكثير'), L('They compare you with the best they have seen anywhere, and they share it when you miss.', 'يقارنونك بأفضل ما رأوه في أي مكان، ويشاركون ذلك حين تُخطئ.'), 'users'],
      [L('Finding and keeping good people', 'إيجاد الكفاءات الجيدة والاحتفاظ بها'), L('Skilled hospitality teams take time to build, and everyone is hiring.', 'بناء فرق الضيافة الماهرة يستغرق وقتًا، والجميع يوظّف.'), 'person'],
      [L('Running several sites well', 'إدارة عدة مواقع بإتقان'), L('Quality at scale needs systems, and a way of doing things that does not depend on one person.', 'الجودة على نطاق واسع تحتاج أنظمة وطريقة عمل لا تعتمد على شخص واحد.'), 'gear'],
      [L('Growing responsibly', 'النمو بمسؤولية'), L('Balancing growth with heritage, environment and the community around you.', 'الموازنة بين النمو والتراث والبيئة والمجتمع من حولك.'), 'leaf']
    ],
    services: ['market-intelligence', 'cultural-business-advisory', 'market-entry-guidance']
  },

  {
    slug: 'technology-digital', group: 'target', icon: 'chip', card: 'ind-tech', hero: 'p-engineering-workspace', over: 'svc-tech',
    title: L('Technology & Digital Businesses', 'التقنية والأعمال الرقمية'),
    short: L('Technology & Digital', 'التقنية والرقمية'),
    tagline: L('For software, platform and digital services companies selling to a market that is investing in digital.', 'لشركات البرمجيات والمنصات والخدمات الرقمية التي تبيع في سوق يستثمر في التحول الرقمي.'),
    overviewTitle: L('A market buying digital at scale', 'سوق يشتري الرقمنة بكثافة'),
    overview: L('Government programmes, large enterprises and a young population are all pushing demand for cloud, data and digital services. But selling here is not like selling elsewhere. Deals can be slow, buyers will ask early about where data lives, and local presence matters. We help you understand how your buyers decide and meet the right partners.', 'تدفع البرامج الحكومية والمؤسسات الكبرى والسكان الشباب الطلب على الحوسبة السحابية والبيانات والخدمات الرقمية. لكن البيع هنا ليس كالبيع في مكان آخر. قد تكون الصفقات بطيئة، وسيسألك المشترون مبكرًا عن مكان البيانات، وللحضور المحلي أهمية. نساعدك على فهم كيف يقرر مشتروك ولقاء الشركاء المناسبين.'),
    challengesTitle: L('What technology companies run into', 'ما تواجهه شركات التقنية'),
    challenges: [
      [L('Reaching the right buyers', 'الوصول إلى المشترين المناسبين'), L('Enterprise and government buyers have their own ways of evaluating and procuring.', 'للمشترين من المؤسسات والجهات الحكومية طرقهم الخاصة في التقييم والشراء.'), 'target'],
      [L('Data and security questions', 'أسئلة البيانات والأمن'), L('Expect questions on hosting, privacy and cybersecurity early in the conversation.', 'توقع أسئلة عن الاستضافة والخصوصية والأمن السيبراني مبكرًا في الحوار.'), 'lock'],
      [L('Presence and partners', 'الحضور والشركاء'), L('Direct team, integrator or reseller: each choice changes your costs and your control.', 'فريق مباشر أم متكامل أم موزع: كل خيار يغيّر تكاليفك وتحكمك.'), 'handshake'],
      [L('Hiring', 'التوظيف'), L('Technical talent is in demand everywhere. Plan your first hires early.', 'الكفاءات التقنية مطلوبة في كل مكان. خطط لأول تعييناتك مبكرًا.'), 'person']
    ],
    services: ['market-intelligence', 'strategic-introductions', 'market-entry-guidance', 'cultural-business-advisory']
  },

  {
    slug: 'logistics-supply-chain', group: 'target', icon: 'truck', card: 'ind-logistics', hero: 'p-port-logistics', over: 'ind-logistics',
    title: L('Logistics & Supply Chain', 'الخدمات اللوجستية وسلاسل الإمداد'),
    short: L('Logistics & Supply Chain', 'اللوجستيات وسلاسل الإمداد'),
    tagline: L('For operators, shippers and investors who want to move goods through the Kingdom, and use it as a hub.', 'للمشغّلين والشاحنين والمستثمرين الذين يريدون نقل البضائع عبر المملكة واتخاذها مركزًا.'),
    overviewTitle: L('At the crossroads of three continents', 'عند ملتقى ثلاث قارات'),
    overview: L('Ports, rail, airports, logistics parks and free zones are all being expanded to make the Kingdom a regional hub. For anyone who moves goods, the question is where to build and with whom. We help you compare locations and partners honestly and understand the licensing that applies.', 'تتوسع الموانئ والسكك الحديدية والمطارات والمدن اللوجستية والمناطق الحرة لتجعل المملكة مركزًا إقليميًا. وللمشتغل بنقل البضائع، السؤال هو أين تبني ومع من. نساعدك على مقارنة المواقع والشركاء بصدق وفهم التراخيص التي تنطبق.'),
    challengesTitle: L('What logistics businesses weigh up', 'ما تزنه الأعمال اللوجستية'),
    challenges: [
      [L('Where to locate', 'أين تتمركز'), L('Hubs, free zones and warehouse sites each suit different flows. Choose by your customers, not by rent.', 'لكل من المراكز والمناطق الحرة ومواقع المستودعات تدفقات تناسبه. اختر بحسب عملائك لا بحسب الإيجار.'), 'pin'],
      [L('Customs and compliance', 'الجمارك والامتثال'), L('Import, export and licensing rules are detailed, and mistakes cost days.', 'أنظمة الاستيراد والتصدير والترخيص مفصلة، والأخطاء تكلّف أيامًا.'), 'doc'],
      [L('Cost, speed and reliability', 'التكلفة والسرعة والموثوقية'), L('You rarely get all three. Knowing which two matter most to your customers helps.', 'نادرًا ما تحصل على الثلاثة معًا. ومعرفة أي اثنين أهم لعملائك تفيد.'), 'chart'],
      [L('Visibility and technology', 'الرؤية والتقنية'), L('Customers want to see where their goods are, and you need to plan before they ask.', 'يريد العملاء رؤية أين بضائعهم، وعليك أن تخطط قبل أن يسألوا.'), 'chip']
    ],
    services: ['market-intelligence', 'strategic-introductions', 'market-entry-guidance']
  },

  {
    slug: 'retail-ecommerce', group: 'target', icon: 'bag', card: 'ind-retail', hero: 'p-retail', over: 'ck2',
    title: L('Retail & E-commerce', 'التجزئة والتجارة الإلكترونية'),
    short: L('Retail & E-commerce', 'التجزئة والتجارة الإلكترونية'),
    tagline: L('For retailers, online sellers and consumer brands who want to win Saudi shoppers, in store and online.', 'لتجار التجزئة والبائعين عبر الإنترنت والعلامات الاستهلاكية الذين يريدون كسب المتسوق السعودي في المتجر وعبر الإنترنت.'),
    overviewTitle: L('Shoppers who know what they want', 'متسوقون يعرفون ما يريدون'),
    overview: L('Saudi shoppers are digital, mobile and brand-aware, and they expect fast delivery, easy returns and an experience in Arabic that feels written for them. That raises the bar, and rewards the sellers who clear it. We help you read the market, meet the right partners and understand what Saudi shoppers expect, so your first year tests demand before it spends heavily.', 'المتسوق السعودي رقمي ومتنقل وواعٍ بالعلامات، ويتوقع توصيلًا سريعًا وإرجاعًا سهلًا وتجربة بالعربية تبدو مكتوبة له. وهذا يرفع المعيار ويكافئ البائعين الذين يتجاوزونه. نساعدك على قراءة السوق ولقاء الشركاء المناسبين وفهم ما يتوقعه المتسوق السعودي، لتختبر سنتك الأولى الطلب قبل أن تنفق بكثافة.'),
    challengesTitle: L('What retailers keep running into', 'ما يتكرر أمام تجار التجزئة'),
    challenges: [
      [L('Rising expectations', 'توقعات تتصاعد'), L('Personal, seamless and consistent whether the customer is in a mall or on a phone.', 'تجربة شخصية وسلسة ومتسقة سواء كان العميل في مركز تجاري أو على هاتف.'), 'users'],
      [L('Crowded competition', 'منافسة مزدحمة'), L('Local and global players, and customers one tap from a rival.', 'لاعبون محليون وعالميون، وعملاء على بعد نقرة من منافس.'), 'chart'],
      [L('Technology moving fast', 'تقنية تتحرك بسرعة'), L('Platforms, payments and tools keep changing. Choose what serves you, not what is fashionable.', 'تتغير المنصات والمدفوعات والأدوات باستمرار. اختر ما يخدمك لا ما هو رائج.'), 'chip'],
      [L('Operations behind the scenes', 'العمليات خلف الكواليس'), L('Stock, fulfilment and returns decide whether the front end can keep its promises.', 'المخزون والتنفيذ والإرجاع تحدد إن كانت الواجهة تفي بوعودها.'), 'gear']
    ],
    services: ['market-intelligence', 'cultural-business-advisory', 'market-entry-guidance']
  }
];


/* ===== Industries we plan around: 13 sectors, in the order shown on the Industries page ===== */
const C = (t, d, ic) => [t, d, ic];
const more = [
  { slug: 'professional-business-services', group: 'plan', icon: 'briefcase', card: 'ind-professional', hero: 'p-professional', over: 'p-business-meeting',
    title: L('Business consulting', 'الاستشارات وخدمات الأعمال'), short: L('Business consulting', 'الاستشارات وخدمات الأعمال'),
    tagline: L('For consultancies and specialist service firms that want to serve clients in the Kingdom.', 'للشركات الاستشارية ومقدمي الخدمات المتخصصة الذين يريدون خدمة العملاء في المملكة.'),
    overviewTitle: L('Selling expertise starts with trust', 'بيع الخبرة يبدأ بالثقة'),
    overview: L('Clients here buy from people they know and from firms that have shown they understand the local context. For a service firm that means being clear about what you offer, who will deliver it, and which credentials or practice requirements apply to your field. We help you shape the offer, understand how buyers choose, and meet the right partners.', 'يشتري العملاء هنا ممن يعرفونهم ومن شركات أثبتت فهمها للسياق المحلي. وبالنسبة لشركة خدمات يعني ذلك أن توضّح ما تقدمه ومن سينفذه وأي المؤهلات أو متطلبات الممارسة تنطبق على مجالك. نساعدك على صياغة العرض وفهم كيف يختار المشترون ولقاء الشركاء المناسبين.'),
    challengesTitle: L('What tends to trip firms up', 'ما يعثّر الشركات عادةً'),
    challenges: [C(L('Defining the service activities', 'تحديد أنشطة الخدمة'), L('The way a service is described can decide which requirements apply. Settle it early.', 'قد يحدد وصف الخدمة المتطلبات المنطبقة. احسمه مبكرًا.'), 'clipboard'), C(L('Professional credentials', 'المؤهلات المهنية'), L('Some fields need recognised qualifications or practice approvals, and those need checking, not assuming.', 'تحتاج بعض المجالات إلى مؤهلات معترف بها أو موافقات ممارسة، ويجب التحقق منها لا افتراضها.'), 'shield'), C(L('Winning the first clients', 'كسب أول العملاء'), L('Introductions and references matter more than brochures. Plan how you will earn trust.', 'التعريف والمراجع أهم من الكتيّبات. خطط لكيفية كسب الثقة.'), 'handshake'), C(L('Team and delivery model', 'الفريق ونموذج التنفيذ'), L('Who is on the ground, who flies in, and who owns the client relationship.', 'من يعمل ميدانيًا ومن يسافر ومن يملك علاقة العميل.'), 'users')],
    services: ['market-intelligence', 'strategic-introductions', 'cultural-business-advisory'] },
  { slug: 'construction-engineering', group: 'plan', icon: 'crane', card: 'ind-construction', hero: 'p-construction', over: 'hero-skyline-wide',
    title: L('Construction & engineering', 'الإنشاءات والهندسة'), short: L('Construction & engineering', 'الإنشاءات والهندسة'),
    tagline: L('For contractors and project-delivery businesses looking at the Kingdom’s building and infrastructure programmes.', 'للمقاولين وشركات تنفيذ المشاريع التي تتطلع إلى برامج البناء والبنية التحتية في المملكة.'),
    overviewTitle: L('Big programmes, specific requirements', 'برامج كبرى ومتطلبات محددة'),
    overview: L('Large building and infrastructure programmes create demand for capable contractors and engineers. They also bring detailed requirements around qualifications, site mobilisation and contracting. We help you understand where your type of project fits, which requirements need confirming, and which local partners could help you deliver.', 'تخلق برامج البناء والبنية التحتية الكبرى طلبًا على المقاولين والمهندسين القادرين، وتجلب متطلبات تفصيلية في المؤهلات وتجهيز المواقع والتعاقد. نساعدك على فهم أين يناسب نوع مشروعك وأي المتطلبات تحتاج إلى تأكيد وأي الشركاء المحليين يمكنهم مساعدتك في التنفيذ.'),
    challengesTitle: L('What tends to trip contractors up', 'ما يعثّر المقاولين عادةً'),
    challenges: [C(L('Project activities and scope', 'أنشطة المشروع ونطاقه'), L('What you will build or engineer shapes the licences and qualifications you need.', 'ما ستبنيه أو تصممه يحدد التراخيص والمؤهلات المطلوبة.'), 'doc'), C(L('Qualifications and credentials', 'المؤهلات والاعتمادات'), L('Sector-specific qualifications often need confirming before you bid.', 'غالبًا ما تحتاج المؤهلات الخاصة بالقطاع إلى تأكيد قبل تقديم العطاء.'), 'shield'), C(L('Workforce and equipment', 'القوى العاملة والمعدات'), L('Mobilising people and equipment is a plan in its own right.', 'تجهيز الأشخاص والمعدات خطة قائمة بذاتها.'), 'gear'), C(L('Finding the right partners', 'إيجاد الشركاء المناسبين'), L('Local subcontractors and suppliers can make or break delivery.', 'قد يحسم المقاولون من الباطن والموردون المحليون نجاح التنفيذ أو فشله.'), 'handshake')],
    services: ['market-intelligence', 'market-entry-guidance', 'strategic-introductions'] },
  { slug: 'energy-sustainability', group: 'plan', icon: 'leaf', card: 'ind-energy', hero: 'p-energy', over: 'p-engineering-workspace',
    title: L('Energy & sustainability', 'الطاقة والاستدامة'), short: L('Energy & sustainability', 'الطاقة والاستدامة'),
    tagline: L('For energy-services firms, renewable-project developers and environmental operators.', 'لشركات خدمات الطاقة ومطوّري مشاريع الطاقة المتجددة ومشغّلي الخدمات البيئية.'),
    overviewTitle: L('A national priority, with technical detail', 'أولوية وطنية بتفاصيل فنية'),
    overview: L('Renewable energy and sustainability sit near the centre of Vision 2030, and that attracts serious interest from international firms. The work itself is technical: delivery models, partners, equipment and sites all need to be clear before a plan holds together. We help you read the market, understand who the main players are and meet the right partners.', 'تقع الطاقة المتجددة والاستدامة قرب قلب رؤية 2030، ما يجذب اهتمامًا جادًا من الشركات الدولية. والعمل نفسه فني: يجب أن تتضح نماذج التنفيذ والشركاء والمعدات والمواقع قبل أن تتماسك الخطة. نساعدك على قراءة السوق وفهم اللاعبين الرئيسيين ولقاء الشركاء المناسبين.'),
    challengesTitle: L('What tends to trip developers up', 'ما يعثّر المطورين عادةً'),
    challenges: [C(L('Delivery model', 'نموذج التنفيذ'), L('Developer, contractor, technology supplier or service provider: each role has different requirements.', 'مطوّر أو مقاول أو مورّد تقنية أو مقدم خدمة: لكل دور متطلبات مختلفة.'), 'route'), C(L('Technical partners', 'الشركاء الفنيون'), L('Local and international partners need to fit the project, not just the pitch.', 'يجب أن يناسب الشركاء المحليون والدوليون المشروع لا العرض وحده.'), 'handshake'), C(L('Sites and operating footprint', 'المواقع وبصمة التشغيل'), L('Land, access and grid or utility connections shape what is possible.', 'تحدد الأرض والوصول وربط الشبكة أو المرافق ما هو ممكن.'), 'globe'), C(L('Long timelines', 'الجداول الطويلة'), L('Projects move over years. Plan the funding and the relationships for the long run.', 'تمتد المشاريع لسنوات. خطط للتمويل والعلاقات على المدى الطويل.'), 'chart')],
    services: ['market-intelligence', 'strategic-introductions', 'market-entry-guidance'] },
  { slug: 'education-training', group: 'plan', icon: 'book', card: 'ind-education', hero: 'p-education', over: 'ind-education',
    title: L('Education & training', 'التعليم والتدريب'), short: L('Education & training', 'التعليم والتدريب'),
    tagline: L('For training providers and learning businesses that want to serve students and employers in the Kingdom.', 'لمقدمي التدريب وشركات التعلم التي تريد خدمة الطلاب وأصحاب العمل في المملكة.'),
    overviewTitle: L('Skills are central to the national plan', 'المهارات محورية في الخطة الوطنية'),
    overview: L('Building skills for a changing economy is a stated priority, which opens room for training and learning providers. The details matter: your programmes, how you deliver them, the credentials of your instructors and the facilities you need. We help you understand the landscape, check which requirements apply to your format, and meet possible partners.', 'بناء المهارات لاقتصاد متغير أولوية معلنة، ما يفتح المجال أمام مقدمي التدريب والتعلم. والتفاصيل مهمة: برامجك وكيفية تقديمها ومؤهلات مدرّبيك والمرافق التي تحتاجها. نساعدك على فهم المشهد والتحقق من المتطلبات المنطبقة على صيغتك ولقاء الشركاء المحتملين.'),
    challengesTitle: L('What tends to trip providers up', 'ما يعثّر مقدمي الخدمة عادةً'),
    challenges: [C(L('Programme design and audience', 'تصميم البرامج والجمهور'), L('Be clear who you serve: students, professionals or employers.', 'حدد بوضوح من تخدمه: طلابًا أو مهنيين أو جهات عمل.'), 'target'), C(L('Delivery format', 'صيغة التقديم'), L('In person, online or blended, each format raises different requirements.', 'حضوريًا أو عن بعد أو مدمجًا، ولكل صيغة متطلباتها.'), 'route'), C(L('Instructor credentials', 'مؤهلات المدرّبين'), L('Who teaches, and what qualifications they hold, often needs confirming.', 'غالبًا ما يحتاج التأكد من من يدرّس وما مؤهلاته إلى تحقق.'), 'shield'), C(L('Facilities and partners', 'المرافق والشركاء'), L('Premises, accreditation partners and employer links all take time to line up.', 'تستغرق ترتيبات المقرات وشركاء الاعتماد والصلات مع أصحاب العمل وقتًا.'), 'building')],
    services: ['market-intelligence', 'strategic-introductions', 'cultural-business-advisory'] },
  { slug: 'food-agriculture', group: 'plan', icon: 'leaf', card: 'ind-food', hero: 'p-food', over: 'p-desert',
    title: L('Food & agriculture', 'الغذاء والزراعة'), short: L('Food & agriculture', 'الغذاء والزراعة'),
    tagline: L('For food producers, agricultural businesses and distributors.', 'لمنتجي الغذاء والأعمال الزراعية والموزعين.'),
    overviewTitle: L('Food security meets a growing market', 'الأمن الغذائي يلتقي بسوق متنامٍ'),
    overview: L('Food security is a national priority and the market for quality food is growing. Success depends on practical things: which products, where they are made or stored, how they are handled and who distributes them. We help you read the market, understand the main requirements for your products and meet distribution and sourcing partners.', 'الأمن الغذائي أولوية وطنية وسوق الغذاء الجيد في نمو. والنجاح يعتمد على أمور عملية: أي المنتجات وأين تُصنع أو تُخزَّن وكيف تُدار وسلاسل من يوزعها. نساعدك على قراءة السوق وفهم أهم المتطلبات لمنتجاتك ولقاء شركاء التوزيع والتوريد.'),
    challengesTitle: L('What tends to trip food businesses up', 'ما يعثّر أعمال الغذاء عادةً'),
    challenges: [C(L('Product categories and handling', 'فئات المنتجات والتعامل معها'), L('Different products bring different storage, labelling and handling needs.', 'تتطلب المنتجات المختلفة تخزينًا وتوسيمًا ومناولة مختلفة.'), 'clipboard'), C(L('Production and facilities', 'الإنتاج والمرافق'), L('Where you produce, process and store shapes your costs and approvals.', 'يحدد مكان الإنتاج والمعالجة والتخزين تكاليفك وموافقاتك.'), 'gear'), C(L('Sourcing and supply chain', 'التوريد وسلسلة الإمداد'), L('Reliable supply is the difference between a pilot and a business.', 'التوريد الموثوق هو الفارق بين تجربة وعمل قائم.'), 'route'), C(L('Reaching customers', 'الوصول إلى العملاء'), L('Distributors, retailers and food-service buyers each need a different approach.', 'يحتاج كل من الموزعين وتجار التجزئة ومشتري خدمات الأغذية إلى نهج مختلف.'), 'handshake')],
    services: ['market-intelligence', 'strategic-introductions', 'market-entry-guidance'] }
];
INDUSTRIES.push(...more);

/** Per-industry planning notes for the Industries page. "Starting points for discussion, not licensing checklists." */
export const PLAN = {
  'technology-digital': { n: 1, label: L('Technology', 'التقنية'), who: L('Software, digital services and technology businesses', 'شركات البرمجيات والخدمات الرقمية والتقنية'), plan: L('Clarify software and service activities, data handling, delivery model and local team needs.', 'وضّح أنشطة البرمجيات والخدمات ومعالجة البيانات ونموذج التقديم واحتياجات الفريق المحلي.'), bring: L('Product and service description; ownership records; proposed customer and delivery model; staffing plan.', 'وصف المنتجات والخدمات؛ سجلات الملكية؛ نموذج العملاء والتقديم المقترح؛ خطة التوظيف.') },
  manufacturing: { n: 2, label: L('Manufacturing & industry', 'التصنيع والصناعة'), who: L('Production and industrial businesses', 'أعمال الإنتاج والصناعة'), plan: L('Map production activities, facility needs, utilities, supply chain and specialist review dependencies.', 'ارسم أنشطة الإنتاج واحتياجات المنشأة والمرافق وسلسلة الإمداد وما يعتمد على مراجعة المتخصصين.'), bring: L('Product categories; production plan; facility assumptions; equipment and workforce requirements.', 'فئات المنتجات؛ خطة الإنتاج؛ افتراضات المنشأة؛ متطلبات المعدات والقوى العاملة.') },
  'professional-business-services': { n: 3, label: L('Business consulting', 'الاستشارات وخدمات الأعمال'), who: L('Consultancies and specialist service firms', 'الشركات الاستشارية ومقدمو الخدمات المتخصصة'), plan: L('Define service activities, professional credentials, contracting model and any specialist practice requirements.', 'حدد أنشطة الخدمة والمؤهلات المهنية ونموذج التعاقد وأي متطلبات ممارسة متخصصة.'), bring: L('Service catalog; qualifications where relevant; ownership information; team and client model.', 'قائمة الخدمات؛ المؤهلات عند الاقتضاء؛ معلومات الملكية؛ نموذج الفريق والعملاء.') },
  'construction-engineering': { n: 4, label: L('Construction & engineering', 'الإنشاءات والهندسة'), who: L('Contractors and project-delivery businesses', 'المقاولون وأعمال تنفيذ المشاريع'), plan: L('Assess project activities, workforce mobilization, site needs and any sector-specific qualifications requiring confirmation.', 'قيّم أنشطة المشروع وتجهيز القوى العاملة واحتياجات المواقع وأي مؤهلات خاصة بالقطاع تحتاج إلى تأكيد.'), bring: L('Project profile; contracting scope; credentials; workforce and equipment assumptions.', 'نبذة المشروع؛ نطاق التعاقد؛ الاعتمادات؛ افتراضات القوى العاملة والمعدات.') },
  'healthcare-life-sciences': { n: 5, label: L('Healthcare', 'الرعاية الصحية'), who: L('Clinical and healthcare-related businesses', 'الأعمال السريرية والمرتبطة بالرعاية الصحية'), plan: L('Separate the business establishment plan from specialist facility, practitioner and activity requirements.', 'افصل خطة تأسيس العمل عن المتطلبات المتخصصة للمنشأة والممارسين والنشاط.'), bring: L('Operating model; facility concept; service categories; practitioner and ownership information.', 'نموذج التشغيل؛ تصور المنشأة؛ فئات الخدمات؛ معلومات الممارسين والملكية.') },
  'logistics-supply-chain': { n: 6, label: L('Logistics', 'الخدمات اللوجستية'), who: L('Transport, warehousing and supply-chain businesses', 'أعمال النقل والتخزين وسلاسل الإمداد'), plan: L('Distinguish transport and storage activities, operating footprint, fleet or warehouse needs and partner dependencies.', 'ميّز بين أنشطة النقل والتخزين وبصمة التشغيل واحتياجات الأسطول أو المستودعات واعتماد الشركاء.'), bring: L('Activity description; footprint and facility plan; fleet assumptions; proposed customer model.', 'وصف النشاط؛ خطة البصمة والمنشآت؛ افتراضات الأسطول؛ نموذج العملاء المقترح.') },
  'retail-ecommerce': { n: 7, label: L('Retail & commercial', 'التجزئة والتجارة'), who: L('Stores, showrooms and online sellers', 'المتاجر وصالات العرض والبائعون عبر الإنترنت'), plan: L('Plan around your product categories, sales channels, premises, supply chain and workforce.', 'خطط حول فئات منتجاتك وقنوات البيع والمقرات وسلسلة الإمداد والقوى العاملة.'), bring: L('Product catalog, store or online sales model, ownership details and proposed operating footprint.', 'كتالوج المنتجات ونموذج البيع في المتجر أو عبر الإنترنت وتفاصيل الملكية وبصمة التشغيل المقترحة.') },
  'energy-sustainability': { n: 8, label: L('Energy & sustainability', 'الطاقة والاستدامة'), who: L('Energy services, renewable projects and environmental operations', 'خدمات الطاقة ومشاريع الطاقة المتجددة والعمليات البيئية'), plan: L('Map your delivery model, technical partners and operating footprint.', 'ارسم نموذج التنفيذ والشركاء الفنيين وبصمة التشغيل.'), bring: L('Project concept; intended services; partner roles; equipment and site assumptions.', 'تصور المشروع؛ الخدمات المقصودة؛ أدوار الشركاء؛ افتراضات المعدات والموقع.') },
  'real-estate': { n: 9, label: L('Real estate & property', 'العقار والأملاك'), who: L('Property services, asset operations and development support', 'الخدمات العقارية وتشغيل الأصول ودعم التطوير'), plan: L('Define the activities, ownership model and team responsibilities.', 'حدد الأنشطة ونموذج الملكية ومسؤوليات الفريق.'), bring: L('Property or service concept; proposed activities; ownership model; operating locations.', 'تصور العقار أو الخدمة؛ الأنشطة المقترحة؛ نموذج الملكية؛ مواقع التشغيل.') },
  hospitality: { n: 10, label: L('Hospitality & tourism', 'الضيافة والسياحة'), who: L('Accommodation, visitor experiences and hospitality services', 'الإقامة وتجارب الزوار وخدمات الضيافة'), plan: L('Plan around your guest offer, premises and operating team.', 'خطط حول عرضك للضيوف ومقرّك وفريق التشغيل.'), bring: L('Guest offer; facility concept; service model; staffing and partner assumptions.', 'عرض الضيوف؛ تصور المنشأة؛ نموذج الخدمة؛ افتراضات التوظيف والشركاء.') },
  'education-training': { n: 11, label: L('Education & training', 'التعليم والتدريب'), who: L('Training providers and learning businesses', 'مقدمو التدريب وأعمال التعلم'), plan: L('Clarify your programs, delivery channels, instructors and facility needs.', 'وضّح برامجك وقنوات التقديم والمدرّبين واحتياجات المنشأة.'), bring: L('Program outline; delivery format; instructor credentials; audience and facility plan.', 'مخطط البرنامج؛ صيغة التقديم؛ مؤهلات المدرّبين؛ الجمهور وخطة المنشأة.') },
  'food-agriculture': { n: 12, label: L('Food & agriculture', 'الغذاء والزراعة'), who: L('Food production, agricultural businesses and distribution', 'إنتاج الغذاء والأعمال الزراعية والتوزيع'), plan: L('Define the products, facilities, supply chain and handling needs.', 'حدد المنتجات والمنشآت وسلسلة الإمداد واحتياجات المناولة.'), bring: L('Product categories; production model; facility concept; sourcing and distribution plan.', 'فئات المنتجات؛ نموذج الإنتاج؛ تصور المنشأة؛ خطة التوريد والتوزيع.') },
  fmcg: { n: 13, label: L('FMCG & consumer brands', 'السلع الاستهلاكية والعلامات'), who: L('Consumer-goods brands, importers and distributors', 'علامات السلع الاستهلاكية والمستوردون والموزعون'), plan: L('Define your product categories, labelling and handling needs, distribution route and pricing approach.', 'حدد فئات منتجاتك واحتياجات التوسيم والمناولة وطريق التوزيع ونهج التسعير.'), bring: L('Product range; target customers; distributor or retailer plans; ownership information.', 'تشكيلة المنتجات؛ العملاء المستهدفون؛ خطط الموزعين أو تجار التجزئة؛ معلومات الملكية.') }
};
for (const i of INDUSTRIES) { const p = PLAN[i.slug]; i.plan = p; i.title = p.label; i.short = p.label; i.group = 'plan'; }
INDUSTRIES.sort((a, b) => PLAN[a.slug].n - PLAN[b.slug].n);

export const industryBySlug = (s) => INDUSTRIES.find((x) => x.slug === s);
