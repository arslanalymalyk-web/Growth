import { L } from './ui.mjs';

export const INDUSTRIES = [
  {
    slug: 'fmcg', group: 'core', icon: 'cart', card: 'ind-fmcg', hero: 'p-fmcg', over: 'p-fmcg-overview',
    title: L('FMCG & Consumer Brands', 'السلع الاستهلاكية سريعة الحركة'),
    short: L('FMCG', 'السلع الاستهلاكية'),
    tagline: L('Helping consumer brands, retailers and distributors get onto Saudi shelves, stay there, and grow.', 'نساعد العلامات الاستهلاكية وتجار التجزئة والموزعين على الوصول إلى الرفوف السعودية والبقاء فيها والنمو.'),
    overviewTitle: L('A market that rewards the brands who get it right', 'سوق يكافئ العلامات التي تُحسن التصرف'),
    overview: L('Saudi shoppers are young, connected and used to choice. They notice quality, value and a good story, and they switch quickly when a brand lets them down. For brands, that means a real opportunity and a high bar. We help you find your place in it: who to sell to first, how to get distribution that works, how to price, and how to stay on the shelf once you are there.', 'المتسوق السعودي شاب ومتصل ومعتاد على الاختيار. يلاحظ الجودة والقيمة والقصة الجيدة، وينتقل سريعًا حين تخذله علامة. وهذا يعني فرصة حقيقية ومعيارًا عاليًا. نساعدك على إيجاد مكانك فيه: لمن تبيع أولًا، وكيف تحصل على توزيع ناجح، وكيف تسعّر، وكيف تبقى على الرف بعد وصولك.'),
    challengesTitle: L('Where consumer brands usually get stuck', 'أين تتعثر العلامات الاستهلاكية عادةً'),
    challenges: [
      [L('Shoppers expect more', 'المتسوقون يتوقعون أكثر'), L('Quality, value, health and a story they believe in. Getting just one of them wrong is enough to lose a repeat purchase.', 'جودة وقيمة وصحة وقصة يصدقونها. وإخفاقك في واحدة منها يكفي لتخسر الشراء المتكرر.'), 'cart'],
      [L('Everyone is competing', 'الجميع ينافس'), L('Global giants, regional brands and fast local challengers all want the same shelf.', 'عمالقة عالميون وعلامات إقليمية ومنافسون محليون سريعون، كلهم يريد الرف نفسه.'), 'chart'],
      [L('Many channels to juggle', 'قنوات كثيرة للتعامل معها'), L('Modern trade, neighbourhood shops and online all work differently, and they all want your attention.', 'التجارة الحديثة والبقالات والمتاجر الإلكترونية تعمل بطرق مختلفة، وكلها تريد انتباهك.'), 'network'],
      [L('Rules keep moving', 'الأنظمة تتحرك باستمرار'), L('Labelling, registration and localisation requirements change, and an old answer can quickly become the wrong one.', 'تتغير متطلبات البطاقات والتسجيل والتوطين، وقد يصبح الجواب القديم خاطئًا بسرعة.'), 'leaf']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'brand-marketing-digital-growth', 'operations-business-support']
  },
  {
    slug: 'real-estate', group: 'core', icon: 'building', card: 'ind-realestate', hero: 'p-district-skyline', over: 'hero-riyadh-sunset',
    title: L('Real Estate', 'العقارات'),
    short: L('Real Estate', 'العقارات'),
    tagline: L('For developers, investors and operators who want to build, buy or run property in a market that is growing fast.', 'للمطورين والمستثمرين والمشغّلين الذين يريدون البناء أو الشراء أو إدارة العقار في سوق ينمو بسرعة.'),
    overviewTitle: L('Big projects, local detail', 'مشاريع كبرى وتفاصيل محلية'),
    overview: L('New districts, large programmes and growing demand for homes, offices and shops are changing the property map of the Kingdom. The opportunity is real, but so is the detail: who owns the land, which approvals come in which order, and who is actually able to build. We help you look past the headlines to a project you can finance, approve and deliver.', 'تغيّر الأحياء الجديدة والبرامج الكبرى والطلب المتنامي على المساكن والمكاتب والمتاجر خريطة العقار في المملكة. الفرصة حقيقية، وكذلك التفاصيل: من يملك الأرض، وأي الموافقات تأتي بأي ترتيب، ومن يستطيع البناء فعلًا. نساعدك على تجاوز العناوين إلى مشروع تستطيع تمويله واعتماده وتنفيذه.'),
    challengesTitle: L('What tends to trip investors up', 'ما يعثّر المستثمرين عادةً'),
    challenges: [
      [L('Choosing the right opportunity', 'اختيار الفرصة المناسبة'), L('Which district, which type of asset, and which partners fit your investment case.', 'أي حي وأي نوع من الأصول وأي شركاء يناسبون قضيتك الاستثمارية.'), 'target'],
      [L('Understanding the rules', 'فهم الأنظمة'), L('Ownership, registration and development rules have been changing. What was true last year may not be now.', 'تتغير أنظمة التملك والتسجيل والتطوير. وما كان صحيحًا العام الماضي قد لا يكون كذلك اليوم.'), 'doc'],
      [L('Delivery and the people who deliver', 'التنفيذ ومن ينفذ'), L('Good contractors and consultants are in demand. Capacity is often the real constraint.', 'المقاولون والاستشاريون الجيدون مطلوبون، والطاقة الاستيعابية هي القيد الحقيقي غالبًا.'), 'handshake'],
      [L('Making it perform after it is built', 'جعله مجديًا بعد البناء'), L('Asset management and operations decide long-term value, and they are often an afterthought.', 'إدارة الأصول والتشغيل يحددان القيمة طويلة الأمد، وغالبًا ما يُهملان.'), 'chart']
    ],
    services: ['market-strategy-entry', 'formation-establishment', 'partnerships-commercial-development', 'governance-finance-compliance']
  },
  {
    slug: 'hospitality', group: 'core', icon: 'bell', card: 'ind-hospitality', hero: 'p-hospitality-lobby', over: 'lounge-arch',
    title: L('Hospitality', 'الضيافة'),
    short: L('Hospitality', 'الضيافة'),
    tagline: L('Helping hotel, restaurant and experience operators open well and run well in a visitor economy that is being built right now.', 'نساعد مشغّلي الفنادق والمطاعم والتجارب على الافتتاح الجيد والتشغيل الجيد في اقتصاد زوّار يُبنى الآن.'),
    overviewTitle: L('A new visitor economy, built from the ground up', 'اقتصاد زوّار جديد يُبنى من الأساس'),
    overview: L('Saudi Arabia is welcoming more visitors, building new destinations and rethinking what a stay can feel like. For operators, that is exciting, and demanding. You have to staff and license venues, plan for peaks and quiet months, and match the standards guests expect. We help you open well, and keep the quality up once the novelty wears off.', 'تستقبل السعودية زوّارًا أكثر وتبني وجهات جديدة وتعيد التفكير في معنى الإقامة. وهذا مثير للمشغّلين، وشاق أيضًا. عليك توظيف المنشآت وترخيصها، والتخطيط للذروة والأشهر الهادئة، ومواكبة المعايير التي يتوقعها الضيوف. نساعدك على الافتتاح الجيد وإبقاء الجودة بعد أن تزول الجِدّة.'),
    challengesTitle: L('What operators find hardest', 'ما يجده المشغّلون الأصعب'),
    challenges: [
      [L('Guests expect a lot', 'الضيوف يتوقعون الكثير'), L('They compare you with the best they have seen anywhere, and they share it when you miss.', 'يقارنونك بأفضل ما رأوه في أي مكان، ويشاركون ذلك حين تُخطئ.'), 'users'],
      [L('Finding and keeping good people', 'إيجاد الكفاءات الجيدة والاحتفاظ بها'), L('Skilled hospitality teams take time to build, and everyone is hiring.', 'بناء فرق الضيافة الماهرة يستغرق وقتًا، والجميع يوظّف.'), 'person'],
      [L('Running several sites well', 'إدارة عدة مواقع بإتقان'), L('Quality at scale needs systems, and a way of doing things that does not depend on one person.', 'الجودة على نطاق واسع تحتاج أنظمة وطريقة عمل لا تعتمد على شخص واحد.'), 'gear'],
      [L('Growing responsibly', 'النمو بمسؤولية'), L('Balancing growth with heritage, environment and the community around you.', 'الموازنة بين النمو والتراث والبيئة والمجتمع من حولك.'), 'leaf']
    ],
    services: ['market-strategy-entry', 'hr-talent-executive-mobility', 'operations-business-support', 'brand-marketing-digital-growth']
  },
  {
    slug: 'manufacturing', group: 'core', icon: 'factory', card: 'ind-manufacturing', hero: 'p-manufacturing-floor', over: 'ind-tech',
    title: L('Industry & Manufacturing', 'الصناعة والتصنيع'),
    short: L('Manufacturing', 'التصنيع'),
    tagline: L('For manufacturers and industrial investors building plants, supply chains and skills in the Kingdom.', 'للمصنّعين والمستثمرين الصناعيين الذين يبنون المصانع وسلاسل الإمداد والمهارات في المملكة.'),
    overviewTitle: L('A country that wants to make more', 'بلد يريد أن يصنع أكثر'),
    overview: L('Saudi Arabia is investing heavily in local manufacturing, and it has put policy, financing and land behind the goal. That is good news if you are planning a plant, but a plant is only as good as its site, its supply chain and its people. We help you work out where to build, what support may be available, and how to avoid the delays that catch most first-time investors.', 'تستثمر السعودية بقوة في التصنيع المحلي، وقد وضعت خلف الهدف سياسات وتمويلًا وأراضي. وهذا خبر جيد إن كنت تخطط لمصنع، لكن المصنع بقدر موقعه وسلسلة إمداده وأشخاصه. نساعدك على تحديد أين تبني، وما الدعم المتاح، وكيف تتجنب التأخيرات التي تفاجئ أغلب المستثمرين لأول مرة.'),
    challengesTitle: L('Where plants tend to lose time', 'أين تفقد المصانع وقتها عادةً'),
    challenges: [
      [L('Site and incentives', 'الموقع والحوافز'), L('The right location, and an honest picture of the support you can and cannot count on.', 'الموقع المناسب، وصورة صادقة عن الدعم الذي تستطيع الاعتماد عليه وما لا تستطيع.'), 'pin'],
      [L('A supply chain that works locally', 'سلسلة إمداد تعمل محليًا'), L('Reliable suppliers and logistics, close enough to keep your costs sensible.', 'موردون ولوجستيات موثوقة وقريبة بما يكفي لإبقاء تكاليفك معقولة.'), 'network'],
      [L('Skilled people', 'الكفاءات الماهرة'), L('Recruiting and training technicians, while meeting localisation expectations.', 'توظيف الفنيين وتدريبهم مع تلبية توقعات التوطين.'), 'users'],
      [L('Technology and automation', 'التقنية والأتمتة'), L('Productivity decides who competes. The right level of automation is a decision, not a default.', 'الإنتاجية تحدد من ينافس. والمستوى المناسب من الأتمتة قرار لا افتراض.'), 'chip']
    ],
    services: ['market-strategy-entry', 'operations-business-support', 'technology-automation', 'hr-talent-executive-mobility']
  },
  {
    slug: 'technology-digital', group: 'target', icon: 'chip', card: 'ind-tech', hero: 'p-engineering-workspace', over: 'svc-tech',
    title: L('Technology & Digital Businesses', 'التقنية والأعمال الرقمية'),
    short: L('Technology & Digital', 'التقنية والرقمية'),
    tagline: L('For software, platform and digital services companies selling to a market that is investing in digital.', 'لشركات البرمجيات والمنصات والخدمات الرقمية التي تبيع في سوق يستثمر في التحول الرقمي.'),
    overviewTitle: L('A market buying digital at scale', 'سوق يشتري الرقمنة بكثافة'),
    overview: L('Government programmes, large enterprises and a young population are all pushing demand for cloud, data and digital services. But selling here is not like selling elsewhere. Deals can be slow, buyers will ask early about where data lives, and local presence matters. We help you understand how your buyers decide, find the right partner, and set up so that you are ready when they ask.', 'تدفع البرامج الحكومية والمؤسسات الكبرى والسكان الشباب الطلب على الحوسبة السحابية والبيانات والخدمات الرقمية. لكن البيع هنا ليس كالبيع في مكان آخر. قد تكون الصفقات بطيئة، وسيسألك المشترون مبكرًا عن مكان البيانات، وللحضور المحلي أهمية. نساعدك على فهم كيف يقرر مشتروك، وإيجاد الشريك المناسب، والاستعداد حين يسألون.'),
    challengesTitle: L('What technology companies run into', 'ما تواجهه شركات التقنية'),
    challenges: [
      [L('Reaching the right buyers', 'الوصول إلى المشترين المناسبين'), L('Enterprise and government buyers have their own ways of evaluating and procuring.', 'للمشترين من المؤسسات والجهات الحكومية طرقهم الخاصة في التقييم والشراء.'), 'target'],
      [L('Data and security questions', 'أسئلة البيانات والأمن'), L('Expect questions on hosting, privacy and cybersecurity early in the conversation.', 'توقع أسئلة عن الاستضافة والخصوصية والأمن السيبراني مبكرًا في الحوار.'), 'lock'],
      [L('Presence and partners', 'الحضور والشركاء'), L('Direct team, integrator or reseller: each choice changes your costs and your control.', 'فريق مباشر أم متكامل أم موزع: كل خيار يغيّر تكاليفك وتحكمك.'), 'handshake'],
      [L('Hiring', 'التوظيف'), L('Technical talent is in demand everywhere. Plan your first hires early.', 'الكفاءات التقنية مطلوبة في كل مكان. خطط لأول تعييناتك مبكرًا.'), 'person']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'formation-establishment', 'hr-talent-executive-mobility']
  },
  {
    slug: 'construction-engineering', group: 'target', icon: 'crane', card: 'ind-construction', hero: 'p-construction', over: 'hero-skyline-dusk',
    title: L('Construction & Engineering', 'الإنشاءات والهندسة'),
    short: L('Construction & Engineering', 'الإنشاءات والهندسة'),
    tagline: L('For contractors, consultants and investors who want to win work and deliver well on the Kingdom’s largest projects.', 'للمقاولين والاستشاريين والمستثمرين الذين يريدون الفوز بالأعمال وتنفيذها بإتقان في أكبر مشاريع المملكة.'),
    overviewTitle: L('Building the Kingdom’s future', 'بناء مستقبل المملكة'),
    overview: L('Construction and engineering sit under almost everything the Kingdom is building: cities, infrastructure, industry. The pipeline is large and the standards are rising. If you want to be part of it, you need to know how projects are procured, who you can partner with, and how to manage cash across long payment cycles. We help you build a position, not just chase the next tender.', 'تقف الإنشاءات والهندسة تحت كل ما تبنيه المملكة تقريبًا: المدن والبنية التحتية والصناعة. المسار كبير والمعايير ترتفع. وإن أردت أن تكون جزءًا منه فعليك أن تعرف كيف تُطرح المشاريع، ومن تشاركه، وكيف تدير السيولة عبر دورات دفع طويلة. نساعدك على بناء موقع، لا على ملاحقة المناقصة التالية فقط.'),
    challengesTitle: L('What the sector finds hardest', 'ما يجده القطاع الأصعب'),
    challenges: [
      [L('More complex projects', 'مشاريع أكثر تعقيدًا'), L('Larger, more ambitious, with more parties around the table.', 'أكبر وأكثر طموحًا، وبأطراف أكثر حول الطاولة.'), 'chart'],
      [L('Cost and supply pressure', 'ضغوط التكلفة والإمداد'), L('Material prices move, and global supply chains do not always cooperate.', 'تتحرك أسعار المواد، ولا تتعاون سلاسل الإمداد العالمية دائمًا.'), 'coins'],
      [L('Skills and capability', 'المهارات والقدرات'), L('Demand for specialist skills is rising faster than supply.', 'يرتفع الطلب على المهارات المتخصصة أسرع من المعروض.'), 'users'],
      [L('Standards and governance', 'المعايير والحوكمة'), L('Higher expectations on compliance, safety and how projects are governed.', 'توقعات أعلى بشأن الامتثال والسلامة وكيفية حوكمة المشاريع.'), 'warning']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'hr-talent-executive-mobility', 'governance-finance-compliance']
  },
  {
    slug: 'healthcare-life-sciences', group: 'target', icon: 'steth', card: 'ind-healthcare', hero: 'p-healthcare', over: 'ind-healthcare',
    title: L('Healthcare & Life Sciences', 'الرعاية الصحية وعلوم الحياة'),
    short: L('Healthcare & Life Sciences', 'الرعاية الصحية وعلوم الحياة'),
    tagline: L('For providers, suppliers and investors working with a healthcare system that is being reshaped.', 'لمقدمي الخدمة والموردين والمستثمرين الذين يعملون مع منظومة صحية يُعاد تشكيلها.'),
    overviewTitle: L('A sector in transformation', 'قطاع في طور التحول'),
    overview: L('How care is funded, delivered and measured is changing. There is more room for private providers, more attention on prevention, and more digital health. Healthcare is also one of the most regulated sectors there is, and rightly so. We help you understand who the main bodies are, how approvals generally work, where partnerships fit, and how long things realistically take.', 'تتغير طريقة تمويل الرعاية وتقديمها وقياسها. هناك مساحة أكبر لمقدمي الخدمة من القطاع الخاص، واهتمام أكبر بالوقاية، وصحة رقمية أكثر. والرعاية الصحية أيضًا من أكثر القطاعات تنظيمًا، وهذا في محله. نساعدك على فهم من هي الجهات الرئيسية، وكيف تعمل الموافقات عمومًا، وأين تندرج الشراكات، وكم تستغرق الأمور واقعيًا.'),
    challengesTitle: L('What providers and suppliers face', 'ما يواجهه مقدمو الخدمة والموردون'),
    challenges: [
      [L('Rising demand', 'طلب متزايد'), L('A growing, more health-conscious population expects better access and more personal care.', 'سكان يتزايدون ووعيهم الصحي يرتفع يتوقعون وصولًا أفضل ورعاية أكثر شخصية.'), 'heart'],
      [L('A system in change', 'منظومة تتغير'), L('Reform is moving towards integrated, value-based and digital models of care.', 'يتجه الإصلاح نحو نماذج رعاية متكاملة وقائمة على القيمة ورقمية.'), 'gear'],
      [L('Cost and sustainability', 'التكلفة والاستدامة'), L('Managing cost pressure while keeping the service financially sound.', 'إدارة ضغط التكلفة مع إبقاء الخدمة سليمة ماليًا.'), 'coins'],
      [L('People and skills', 'الأشخاص والمهارات'), L('Attracting and keeping clinicians and specialists in a sector that is growing fast.', 'استقطاب الأطباء والمتخصصين والاحتفاظ بهم في قطاع ينمو بسرعة.'), 'users']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'operations-business-support', 'technology-automation']
  },
  {
    slug: 'logistics-supply-chain', group: 'target', icon: 'truck', card: 'ind-logistics', hero: 'p-port-logistics', over: 'ind-logistics',
    title: L('Logistics & Supply Chain', 'الخدمات اللوجستية وسلاسل الإمداد'),
    short: L('Logistics & Supply Chain', 'اللوجستيات وسلاسل الإمداد'),
    tagline: L('For operators, shippers and investors who want to move goods through the Kingdom, and use it as a hub.', 'للمشغّلين والشاحنين والمستثمرين الذين يريدون نقل البضائع عبر المملكة واتخاذها مركزًا.'),
    overviewTitle: L('At the crossroads of three continents', 'عند ملتقى ثلاث قارات'),
    overview: L('Ports, rail, airports, logistics parks and free zones are all being expanded to make the Kingdom a regional hub. For anyone who moves goods, the question is where to build and with whom. We help you compare locations and partners honestly, understand customs and licensing, and test a route before you commit to it.', 'تتوسع الموانئ والسكك الحديدية والمطارات والمدن اللوجستية والمناطق الحرة لتجعل المملكة مركزًا إقليميًا. وللمشتغل بنقل البضائع، السؤال هو أين تبني ومع من. نساعدك على مقارنة المواقع والشركاء بصدق، وفهم الجمارك والترخيص، واختبار مسار قبل أن تلتزم به.'),
    challengesTitle: L('What logistics businesses weigh up', 'ما تزنه الأعمال اللوجستية'),
    challenges: [
      [L('Where to locate', 'أين تتمركز'), L('Hubs, free zones and warehouse sites each suit different flows. Choose by your customers, not by rent.', 'لكل من المراكز والمناطق الحرة ومواقع المستودعات تدفقات تناسبه. اختر بحسب عملائك لا بحسب الإيجار.'), 'pin'],
      [L('Customs and compliance', 'الجمارك والامتثال'), L('Import, export and licensing rules are detailed, and mistakes cost days.', 'أنظمة الاستيراد والتصدير والترخيص مفصلة، والأخطاء تكلّف أيامًا.'), 'doc'],
      [L('Cost, speed and reliability', 'التكلفة والسرعة والموثوقية'), L('You rarely get all three. Knowing which two matter most to your customers helps.', 'نادرًا ما تحصل على الثلاثة معًا. ومعرفة أي اثنين أهم لعملائك تفيد.'), 'chart'],
      [L('Visibility and technology', 'الرؤية والتقنية'), L('Customers want to see where their goods are, and you need to plan before they ask.', 'يريد العملاء رؤية أين بضائعهم، وعليك أن تخطط قبل أن يسألوا.'), 'chip']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'operations-business-support', 'technology-automation']
  },
  {
    slug: 'retail-ecommerce', group: 'target', icon: 'bag', card: 'ind-retail', hero: 'p-retail', over: 'ck2',
    title: L('Retail & E-commerce', 'التجزئة والتجارة الإلكترونية'),
    short: L('Retail & E-commerce', 'التجزئة والتجارة الإلكترونية'),
    tagline: L('For retailers, online sellers and consumer brands who want to win Saudi shoppers, in store and online.', 'لتجار التجزئة والبائعين عبر الإنترنت والعلامات الاستهلاكية الذين يريدون كسب المتسوق السعودي في المتجر وعبر الإنترنت.'),
    overviewTitle: L('Shoppers who know what they want', 'متسوقون يعرفون ما يريدون'),
    overview: L('Saudi shoppers are digital, mobile and brand-aware, and they expect fast delivery, easy returns and an experience in Arabic that feels written for them. That raises the bar, and rewards the sellers who clear it. We help you choose channels, get payments and delivery right, and plan a first year that tests demand before it spends heavily.', 'المتسوق السعودي رقمي ومتنقل وواعٍ بالعلامات، ويتوقع توصيلًا سريعًا وإرجاعًا سهلًا وتجربة بالعربية تبدو مكتوبة له. وهذا يرفع المعيار ويكافئ البائعين الذين يتجاوزونه. نساعدك على اختيار القنوات وإحكام الدفع والتوصيل، وتخطيط سنة أولى تختبر الطلب قبل أن تنفق بكثافة.'),
    challengesTitle: L('What retailers keep running into', 'ما يتكرر أمام تجار التجزئة'),
    challenges: [
      [L('Rising expectations', 'توقعات تتصاعد'), L('Personal, seamless and consistent whether the customer is in a mall or on a phone.', 'تجربة شخصية وسلسة ومتسقة سواء كان العميل في مركز تجاري أو على هاتف.'), 'users'],
      [L('Crowded competition', 'منافسة مزدحمة'), L('Local and global players, and customers one tap from a rival.', 'لاعبون محليون وعالميون، وعملاء على بعد نقرة من منافس.'), 'chart'],
      [L('Technology moving fast', 'تقنية تتحرك بسرعة'), L('Platforms, payments and tools keep changing. Choose what serves you, not what is fashionable.', 'تتغير المنصات والمدفوعات والأدوات باستمرار. اختر ما يخدمك لا ما هو رائج.'), 'chip'],
      [L('Operations behind the scenes', 'العمليات خلف الكواليس'), L('Stock, fulfilment and returns decide whether the front end can keep its promises.', 'المخزون والتنفيذ والإرجاع تحدد إن كانت الواجهة تفي بوعودها.'), 'gear']
    ],
    services: ['market-strategy-entry', 'brand-marketing-digital-growth', 'technology-automation', 'operations-business-support']
  },
  {
    slug: 'professional-business-services', group: 'target', icon: 'briefcase', card: 'ind-professional', hero: 'p-professional', over: 'meeting-window',
    title: L('Professional & Business Services', 'الخدمات المهنية وخدمات الأعمال'),
    short: L('Professional & Business Services', 'الخدمات المهنية والأعمال'),
    tagline: L('For law, accounting, design, consulting and other professional firms building a practice in the Kingdom.', 'لمكاتب القانون والمحاسبة والتصميم والاستشارات وغيرها من الشركات المهنية التي تبني ممارسة في المملكة.'),
    overviewTitle: L('A sector built on trust', 'قطاع يقوم على الثقة'),
    overview: L('In professional services, your reputation and your relationships are the product. The Kingdom’s transformation is creating demand for advice of every kind, and for firms that clients trust. We help you enter or grow in a way that builds credibility first: the right structure, the right people, and the right early clients.', 'في الخدمات المهنية تكون سمعتك وعلاقاتك هي المنتج. ويخلق تحول المملكة طلبًا على المشورة بكل أنواعها، وعلى شركات يثق بها العملاء. نساعدك على الدخول أو النمو بطريقة تبني المصداقية أولًا: الهيكل المناسب والأشخاص المناسبون والعملاء الأوائل المناسبون.'),
    challengesTitle: L('What professional firms are facing', 'ما تواجهه الشركات المهنية'),
    challenges: [
      [L('Clients expect more', 'العملاء يتوقعون أكثر'), L('Joined-up, tech-enabled advice rather than a stack of separate reports.', 'مشورة متكاملة ممكّنة بالتقنية لا كومة من التقارير المنفصلة.'), 'users'],
      [L('More competition', 'منافسة أكبر'), L('Domestic and international firms are competing across almost every service line.', 'تتنافس شركات محلية ودولية في كل خطوط الخدمة تقريبًا.'), 'chart'],
      [L('Talent', 'الكفاءات'), L('Attracting, developing and keeping good people while demand changes.', 'استقطاب الكفاءات الجيدة وتطويرها والاحتفاظ بها بينما يتغير الطلب.'), 'person'],
      [L('Regulation and standards', 'الأنظمة والمعايير'), L('Licensing and professional standards are evolving, and you need to stay ahead of them.', 'يتطور الترخيص والمعايير المهنية، وعليك أن تسبقهما.'), 'doc']
    ],
    services: ['market-strategy-entry', 'formation-establishment', 'hr-talent-executive-mobility', 'governance-finance-compliance']
  },
  {
    slug: 'tourism-leisure', group: 'target', icon: 'palm', card: 'ind-tourism', hero: 'alula-tombs', over: 'ind-tourism',
    title: L('Tourism & Leisure', 'السياحة والترفيه'),
    short: L('Tourism & Leisure', 'السياحة والترفيه'),
    tagline: L('For destination, attraction and leisure operators who want to be part of a fast-growing visitor economy.', 'لمشغّلي الوجهات والمعالم والترفيه الذين يريدون أن يكونوا جزءًا من اقتصاد زوّار سريع النمو.'),
    overviewTitle: L('Experiences people will travel for', 'تجارب يسافر الناس من أجلها'),
    overview: L('New destinations, heritage sites, events and leisure experiences are widening what the Kingdom offers a visitor. The best of them are memorable because they are well run, not just well built. We help operators and investors check demand, structure partnerships and build the operating capability to deliver a great day, again and again.', 'تُوسّع الوجهات الجديدة والمواقع التراثية والفعاليات والتجارب الترفيهية ما تقدمه المملكة للزائر. وأفضلها لا تُنسى لأنها تُدار جيدًا لا لأنها بُنيت جيدًا فقط. نساعد المشغّلين والمستثمرين على التحقق من الطلب وهيكلة الشراكات وبناء القدرة التشغيلية لتقديم يوم رائع مرة بعد مرة.'),
    challengesTitle: L('What operators need to plan for', 'ما يحتاج المشغّلون إلى التخطيط له'),
    challenges: [
      [L('Demand that comes in waves', 'طلب يأتي على موجات'), L('Seasons, events and holidays make the calendar uneven. Plan for the quiet weeks too.', 'تجعل المواسم والفعاليات والعطلات التقويم غير منتظم. خطط للأسابيع الهادئة أيضًا.'), 'chart'],
      [L('Designing the experience', 'تصميم التجربة'), L('What makes a visit feel authentic and worth the journey, and how you keep it that way.', 'ما يجعل الزيارة أصيلة ومستحقة للرحلة، وكيف تحافظ على ذلك.'), 'bulb'],
      [L('Partners and permissions', 'الشركاء والتصاريح'), L('Destination authorities, operators and suppliers all need to line up.', 'يجب أن تتناغم جهات الوجهات والمشغّلون والموردون.'), 'handshake'],
      [L('Protecting what people come to see', 'حماية ما يأتي الناس لرؤيته'), L('Heritage and environment are the attraction. Growth has to respect them.', 'التراث والبيئة هما الجاذبية. ويجب أن يحترمهما النمو.'), 'leaf']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'operations-business-support', 'brand-marketing-digital-growth']
  }
];

export const industryBySlug = (s) => INDUSTRIES.find((x) => x.slug === s);
