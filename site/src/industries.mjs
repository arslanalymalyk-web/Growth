import { L } from './ui.mjs';

const GENERIC_CHALLENGE_ICONS = ['chart', 'gear', 'coins', 'users'];

export const INDUSTRIES = [
  {
    slug: 'fmcg', group: 'core', icon: 'cart', card: 'ind-fmcg', hero: 'p-fmcg', over: 'p-fmcg-overview',
    title: L('FMCG & Consumer Brands', 'السلع الاستهلاكية سريعة الحركة'),
    short: L('FMCG', 'السلع الاستهلاكية'),
    tagline: L('Supporting consumer brands, retailers and FMCG players to navigate a changing market, meet evolving consumer expectations and unlock sustainable growth in Saudi Arabia.', 'ندعم العلامات الاستهلاكية وتجار التجزئة وشركات السلع سريعة الحركة للتعامل مع سوق متغير وتلبية توقعات المستهلك المتطورة وتحقيق نمو مستدام في المملكة.'),
    overviewTitle: L('A dynamic market with growing opportunity', 'سوق ديناميكي وفرص متنامية'),
    overview: L("Saudi Arabia's FMCG and consumer sector is evolving rapidly, shaped by a young and affluent population, changing lifestyles and rising expectations for quality, value and experience. We work with consumer-focused businesses to develop practical growth strategies, strengthen market presence and build capabilities for long-term success in a competitive and fast-moving landscape.", 'يتطور قطاع السلع الاستهلاكية سريعة الحركة في المملكة بسرعة، مدفوعًا بشريحة شابة ميسورة وتغيّر أنماط الحياة وارتفاع التوقعات تجاه الجودة والقيمة والتجربة. نعمل مع الشركات المتجهة للمستهلك على بناء استراتيجيات نمو عملية وتعزيز الحضور في السوق وتطوير القدرات للنجاح طويل الأمد في بيئة تنافسية سريعة التغير.'),
    challengesTitle: L('Navigating a more complex and demanding landscape', 'التعامل مع مشهد أكثر تعقيدًا وتطلبًا'),
    challenges: [
      [L('Evolving consumer expectations', 'توقعات مستهلك متطورة'), L('Meeting demands for quality, value, health, sustainability and personalised experiences.', 'تلبية الطلب على الجودة والقيمة والصحة والاستدامة والتجارب المخصصة.'), 'cart'],
      [L('Increasing competition', 'منافسة متزايدة'), L('Adapting to intensified competition from global, regional and local players.', 'التكيف مع منافسة متصاعدة من لاعبين عالميين وإقليميين ومحليين.'), 'chart'],
      [L('Channel and omnichannel complexity', 'تعقيد القنوات وتعدد المنافذ'), L('Managing the growing complexity of traditional trade, modern trade and e-commerce.', 'إدارة التعقيد المتزايد في التجارة التقليدية والحديثة والتجارة الإلكترونية.'), 'network'],
      [L('Changing regulatory and market dynamics', 'تغيّر الأنظمة وديناميكيات السوق'), L('Keeping pace with evolving regulations, localisation requirements and shifting market dynamics.', 'مواكبة الأنظمة المتطورة ومتطلبات التوطين وتحولات السوق.'), 'leaf']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'brand-marketing-digital-growth', 'operations-business-support']
  },
  {
    slug: 'real-estate', group: 'core', icon: 'building', card: 'ind-realestate', hero: 'p-district-skyline', over: 'hero-riyadh-sunset',
    title: L('Real Estate', 'العقارات'),
    short: L('Real Estate', 'العقارات'),
    tagline: L('Advisory for developers, investors and operators capturing opportunity in the Kingdom’s fast-evolving property landscape.', 'استشارات للمطورين والمستثمرين والمشغّلين لاقتناص الفرص في المشهد العقاري المتسارع في المملكة.'),
    overviewTitle: L('Large-scale transformation, local complexity', 'تحول واسع النطاق وتعقيد محلي'),
    overview: L('Giga-projects, new urban districts and growing demand for residential, commercial and mixed-use space are reshaping the property market. We help organisations assess opportunities, structure partnerships and build the capabilities to develop and operate successfully.', 'تعيد المشاريع العملاقة والأحياء الحضرية الجديدة وتنامي الطلب على المساحات السكنية والتجارية والمتعددة الاستخدامات تشكيل السوق العقاري. نساعد المنظمات على تقييم الفرص وهيكلة الشراكات وبناء القدرات للتطوير والتشغيل بنجاح.'),
    challengesTitle: L('Key challenges in the Saudi real estate sector', 'أبرز التحديات في القطاع العقاري السعودي'),
    challenges: [
      [L('Opportunity selection', 'اختيار الفرص'), L('Identifying the districts, asset classes and partners that fit your investment thesis.', 'تحديد الأحياء وفئات الأصول والشركاء المناسبين لفرضيتك الاستثمارية.'), 'target'],
      [L('Regulation and licensing', 'الأنظمة والترخيص'), L('Understanding evolving property, ownership and development regulation.', 'فهم الأنظمة المتطورة للتملك والتطوير العقاري.'), 'doc'],
      [L('Delivery and partners', 'التنفيذ والشركاء'), L('Selecting contractors, operators and local partners to deliver on time and to standard.', 'اختيار المقاولين والمشغّلين والشركاء المحليين للتسليم في الوقت وبالمعايير المطلوبة.'), 'handshake'],
      [L('Operating performance', 'الأداء التشغيلي'), L('Building asset-management and operating models that protect long-term value.', 'بناء نماذج إدارة الأصول والتشغيل التي تحمي القيمة طويلة الأمد.'), 'chart']
    ],
    services: ['market-strategy-entry', 'formation-establishment', 'partnerships-commercial-development', 'governance-finance-compliance']
  },
  {
    slug: 'hospitality', group: 'core', icon: 'bell', card: 'ind-hospitality', hero: 'p-hospitality-lobby', over: 'lounge-arch',
    title: L('Hospitality', 'الضيافة'),
    short: L('Hospitality', 'الضيافة'),
    tagline: L("Supporting Saudi Arabia's hospitality ambitions with strategic advisory, practical solutions and enduring capabilities for a world-class visitor economy.", 'ندعم طموحات المملكة في الضيافة باستشارات استراتيجية وحلول عملية وقدرات راسخة لاقتصاد زوّار عالمي المستوى.'),
    overviewTitle: L('A distinctive hospitality future for Saudi Arabia', 'مستقبل ضيافة مميز للمملكة'),
    overview: L("Hospitality is central to diversifying the economy, enabling tourism growth and showcasing the Kingdom's unique heritage and culture. We work with stakeholders to create distinctive guest experiences, operational excellence and sustainable growth across the hospitality value chain.", 'تحتل الضيافة موقعًا محوريًا في تنويع الاقتصاد ودعم نمو السياحة وإبراز التراث والثقافة الفريدة للمملكة. نعمل مع أصحاب المصلحة لصناعة تجارب ضيوف مميزة وتميّز تشغيلي ونمو مستدام عبر سلسلة قيمة الضيافة.'),
    challengesTitle: L('Navigating a complex and evolving landscape', 'التعامل مع مشهد معقد ومتطور'),
    challenges: [
      [L('Changing guest expectations', 'تغيّر توقعات الضيوف'), L('Meeting the needs of a more diverse, international and digitally native guest base.', 'تلبية احتياجات شريحة ضيوف أكثر تنوعًا وعالمية ورقمية.'), 'users'],
      [L('Talent and capability development', 'تطوير الكفاءات والقدرات'), L('Attracting, developing and retaining skilled hospitality talent.', 'استقطاب كفاءات الضيافة وتطويرها والاحتفاظ بها.'), 'person'],
      [L('Operational complexity', 'التعقيد التشغيلي'), L('Managing multi-site operations, rapid development and quality at scale.', 'إدارة عمليات متعددة المواقع وتطور سريع وجودة على نطاق واسع.'), 'gear'],
      [L('Sustainability and responsible growth', 'الاستدامة والنمو المسؤول'), L('Balancing commercial objectives with environmental and cultural responsibility.', 'الموازنة بين الأهداف التجارية والمسؤولية البيئية والثقافية.'), 'leaf']
    ],
    services: ['market-strategy-entry', 'hr-talent-executive-mobility', 'operations-business-support', 'brand-marketing-digital-growth']
  },
  {
    slug: 'manufacturing', group: 'core', icon: 'factory', card: 'ind-manufacturing', hero: 'p-manufacturing-floor', over: 'ind-tech',
    title: L('Industry & Manufacturing', 'الصناعة والتصنيع'),
    short: L('Manufacturing', 'التصنيع'),
    tagline: L('Advisory for manufacturers and industrial investors building local capability and scaling production in line with national industrial ambitions.', 'استشارات للمصنّعين والمستثمرين الصناعيين لبناء القدرات المحلية وتوسيع الإنتاج بما يتماشى مع الطموحات الصناعية الوطنية.'),
    overviewTitle: L('Building industrial capability at scale', 'بناء القدرات الصناعية على نطاق واسع'),
    overview: L("Saudi Arabia's industrial strategy is expanding local manufacturing across advanced and strategic sectors. We help investors and operators evaluate sites and incentives, establish plants, build supply chains and develop the workforce they need.", 'تعمل الاستراتيجية الصناعية السعودية على توسيع التصنيع المحلي في القطاعات المتقدمة والاستراتيجية. نساعد المستثمرين والمشغّلين على تقييم المواقع والحوافز وتأسيس المصانع وبناء سلاسل الإمداد وتنمية القوى العاملة التي يحتاجونها.'),
    challengesTitle: L('Key challenges in the manufacturing sector', 'أبرز التحديات في قطاع التصنيع'),
    challenges: [
      [L('Site and incentive selection', 'اختيار الموقع والحوافز'), L('Choosing locations and navigating the incentive landscape.', 'اختيار المواقع والتعامل مع منظومة الحوافز.'), 'pin'],
      [L('Supply-chain localisation', 'توطين سلاسل الإمداد'), L('Building reliable local suppliers and logistics routes.', 'بناء موردين محليين وممرات لوجستية موثوقة.'), 'network'],
      [L('Workforce and skills', 'القوى العاملة والمهارات'), L('Recruiting and training technical talent and meeting localisation targets.', 'استقطاب الكفاءات الفنية وتدريبها وتحقيق مستهدفات التوطين.'), 'users'],
      [L('Technology and automation', 'التقنية والأتمتة'), L('Adopting automation and digital tools to compete on productivity.', 'تبني الأتمتة والأدوات الرقمية للمنافسة في الإنتاجية.'), 'chip']
    ],
    services: ['market-strategy-entry', 'operations-business-support', 'technology-automation', 'hr-talent-executive-mobility']
  },
  {
    slug: 'technology-digital', group: 'target', icon: 'chip', card: 'ind-tech', hero: 'p-engineering-workspace', over: 'svc-tech',
    title: L('Technology & Digital Businesses', 'التقنية والأعمال الرقمية'),
    short: L('Technology & Digital', 'التقنية والرقمية'),
    tagline: L('Advisory for technology and digital businesses entering or scaling in a market investing heavily in digital transformation.', 'استشارات لشركات التقنية والأعمال الرقمية التي تدخل سوقًا يستثمر بكثافة في التحول الرقمي أو تتوسع فيه.'),
    overviewTitle: L('A market investing in digital transformation', 'سوق يستثمر في التحول الرقمي'),
    overview: L('Government programmes, large enterprises and a young population are driving demand for cloud, data, AI and digital services. We help technology businesses understand buyers, partner effectively and establish a credible local presence.', 'تدفع البرامج الحكومية والمؤسسات الكبرى والسكان الشباب الطلب على الحوسبة السحابية والبيانات والذكاء الاصطناعي والخدمات الرقمية. نساعد شركات التقنية على فهم المشترين والشراكة بفاعلية وبناء حضور محلي موثوق.'),
    challengesTitle: L('Key challenges for technology businesses', 'أبرز التحديات أمام شركات التقنية'),
    challenges: [
      [L('Buyer access and procurement', 'الوصول إلى المشترين والمشتريات'), L('Understanding how enterprise and government buyers evaluate and procure.', 'فهم كيفية تقييم المشترين في المؤسسات والجهات الحكومية وإجراءات الشراء.'), 'target'],
      [L('Data and security requirements', 'متطلبات البيانات والأمن'), L('Meeting local expectations on hosting, privacy and cybersecurity.', 'تلبية التوقعات المحلية في الاستضافة والخصوصية والأمن السيبراني.'), 'lock'],
      [L('Local presence and partners', 'الحضور المحلي والشركاء'), L('Choosing between direct presence, integrators and resellers.', 'الاختيار بين الحضور المباشر والمتكاملين والموزعين.'), 'handshake'],
      [L('Talent', 'الكفاءات'), L('Hiring specialist talent in a competitive market.', 'توظيف كفاءات متخصصة في سوق تنافسي.'), 'person']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'formation-establishment', 'hr-talent-executive-mobility']
  },
  {
    slug: 'construction-engineering', group: 'target', icon: 'crane', card: 'ind-construction', hero: 'p-construction', over: 'hero-skyline-dusk',
    title: L('Construction & Engineering', 'الإنشاءات والهندسة'),
    short: L('Construction & Engineering', 'الإنشاءات والهندسة'),
    tagline: L("Advisory for a more resilient, competitive and sustainable construction and engineering sector in Saudi Arabia, in step with the Kingdom's ambitious development agenda.", 'استشارات لقطاع إنشاءات وهندسة أكثر مرونة وتنافسية واستدامة في المملكة، بما يواكب أجندتها التنموية الطموحة.'),
    overviewTitle: L('A foundational sector for national transformation', 'قطاع أساسي للتحول الوطني'),
    overview: L('Construction and engineering underpin the infrastructure, cities and industrial ecosystems of tomorrow. We support contractors, consultants and investors navigating complexity, strengthening capabilities and capturing opportunities arising from large-scale programmes.', 'يقوم قطاع الإنشاءات والهندسة بدعم البنية التحتية والمدن والمنظومات الصناعية في المستقبل. ندعم المقاولين والاستشاريين والمستثمرين في التعامل مع التعقيد وتعزيز القدرات واقتناص الفرص الناشئة من البرامج الكبرى.'),
    challengesTitle: L('Sector challenges', 'تحديات القطاع'),
    challenges: [
      [L('Rising project complexity', 'تزايد تعقيد المشاريع'), L('Larger, more ambitious and multi-stakeholder programmes.', 'برامج أكبر وأكثر طموحًا وتعدد أصحاب المصلحة.'), 'chart'],
      [L('Cost and supply-chain pressure', 'ضغوط التكلفة وسلاسل الإمداد'), L('Material price volatility and the shift towards global supply chains.', 'تقلب أسعار المواد والتحول نحو سلاسل إمداد عالمية.'), 'coins'],
      [L('Talent and capability gaps', 'فجوات الكفاءات والقدرات'), L('Growing demand for specialised skills and local capability.', 'تنامي الطلب على المهارات المتخصصة والقدرات المحلية.'), 'users'],
      [L('Regulatory and compliance requirements', 'المتطلبات التنظيمية والامتثال'), L('Evolving standards and greater project governance oversight.', 'معايير متطورة ورقابة أكبر على حوكمة المشاريع.'), 'warning']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'hr-talent-executive-mobility', 'governance-finance-compliance']
  },
  {
    slug: 'healthcare-life-sciences', group: 'target', icon: 'steth', card: 'ind-healthcare', hero: 'p-healthcare', over: 'ind-healthcare',
    title: L('Healthcare & Life Sciences', 'الرعاية الصحية وعلوم الحياة'),
    short: L('Healthcare & Life Sciences', 'الرعاية الصحية وعلوم الحياة'),
    tagline: L('Advancing a healthier, more resilient Saudi Arabia. We support public and private sector organisations across the healthcare and life sciences ecosystem.', 'نسهم في مملكة أكثر صحة ومرونة. ندعم المنظمات في القطاعين العام والخاص عبر منظومة الرعاية الصحية وعلوم الحياة.'),
    overviewTitle: L('Healthcare transformation at scale', 'تحول الرعاية الصحية على نطاق واسع'),
    overview: L('Healthcare transformation is reshaping how care is funded, delivered and measured. We help providers, suppliers and investors understand the opportunity, partner effectively and build sustainable, patient-centred capabilities.', 'يعيد تحول الرعاية الصحية تشكيل طريقة تمويل الرعاية وتقديمها وقياسها. نساعد مقدمي الخدمة والموردين والمستثمرين على فهم الفرصة والشراكة بفاعلية وبناء قدرات مستدامة محورها المريض.'),
    challengesTitle: L('Key challenges in the sector', 'أبرز تحديات القطاع'),
    challenges: [
      [L('Rising demand and expectations', 'ارتفاع الطلب والتوقعات'), L('A growing and increasingly health-conscious population with higher expectations for access, quality and personalised care.', 'سكان يتزايدون ووعيهم الصحي يرتفع مع توقعات أعلى للوصول والجودة والرعاية المخصصة.'), 'heart'],
      [L('System transformation', 'تحول المنظومة'), L('Ongoing sector reform towards value-based, integrated and digitally enabled models.', 'إصلاح مستمر للقطاع نحو نماذج قائمة على القيمة ومتكاملة وممكّنة رقميًا.'), 'gear'],
      [L('Cost and sustainability', 'التكلفة والاستدامة'), L('Managing cost pressures while ensuring financial and operational sustainability.', 'إدارة ضغوط التكلفة مع ضمان الاستدامة المالية والتشغيلية.'), 'coins'],
      [L('Workforce and capability', 'القوى العاملة والقدرات'), L('Attracting, developing and retaining talent and capabilities for a rapidly evolving sector.', 'استقطاب الكفاءات وتطويرها والاحتفاظ بها لقطاع سريع التطور.'), 'users']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'operations-business-support', 'technology-automation']
  },
  {
    slug: 'logistics-supply-chain', group: 'target', icon: 'truck', card: 'ind-logistics', hero: 'p-port-logistics', over: 'ind-logistics',
    title: L('Logistics & Supply Chain', 'الخدمات اللوجستية وسلاسل الإمداد'),
    short: L('Logistics & Supply Chain', 'اللوجستيات وسلاسل الإمداد'),
    tagline: L('Advisory for operators, shippers and investors building efficient, connected logistics capability as the Kingdom becomes a global logistics hub.', 'استشارات للمشغّلين والشاحنين والمستثمرين لبناء قدرات لوجستية فعّالة ومترابطة مع تحول المملكة إلى مركز لوجستي عالمي.'),
    overviewTitle: L('Connecting the Kingdom to the world', 'ربط المملكة بالعالم'),
    overview: L('Ports, rail, free zones and logistics parks are creating new routes and new demand. We help companies understand the network, choose locations and partners, and design supply chains that are efficient and resilient.', 'تخلق الموانئ والسكك الحديدية والمناطق الحرة والمدن اللوجستية مسارات وطلبًا جديدين. نساعد الشركات على فهم الشبكة واختيار المواقع والشركاء وتصميم سلاسل إمداد فعّالة ومرنة.'),
    challengesTitle: L('Key challenges in logistics and supply chain', 'أبرز التحديات في اللوجستيات وسلاسل الإمداد'),
    challenges: [
      [L('Network and location choices', 'اختيار الشبكة والمواقع'), L('Selecting hubs, free zones and warehouse locations.', 'اختيار المراكز والمناطق الحرة ومواقع المستودعات.'), 'pin'],
      [L('Customs and compliance', 'الجمارك والامتثال'), L('Understanding import, export and regulatory processes.', 'فهم إجراءات الاستيراد والتصدير والأنظمة.'), 'doc'],
      [L('Cost and service levels', 'التكلفة ومستويات الخدمة'), L('Balancing cost, speed and reliability across routes.', 'الموازنة بين التكلفة والسرعة والموثوقية عبر المسارات.'), 'chart'],
      [L('Technology and visibility', 'التقنية والرؤية الشاملة'), L('Building tracking, planning and automation capability.', 'بناء قدرات التتبع والتخطيط والأتمتة.'), 'chip']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'operations-business-support', 'technology-automation']
  },
  {
    slug: 'retail-ecommerce', group: 'target', icon: 'bag', card: 'ind-retail', hero: 'p-retail', over: 'ck2',
    title: L('Retail & E-commerce', 'التجزئة والتجارة الإلكترونية'),
    short: L('Retail & E-commerce', 'التجزئة والتجارة الإلكترونية'),
    tagline: L("Supporting Saudi Arabia's retail and e-commerce sector to grow, innovate and create exceptional customer experiences.", 'ندعم قطاع التجزئة والتجارة الإلكترونية في المملكة للنمو والابتكار وصناعة تجارب عملاء استثنائية.'),
    overviewTitle: L("A dynamic sector shaping Saudi Arabia's consumer future", 'قطاع ديناميكي يصوغ مستقبل المستهلك في المملكة'),
    overview: L("Retail and e-commerce are key enablers of Saudi Arabia's diversified economy, evolving rapidly with digital innovation and a vibrant, brand-conscious consumer base. We work with established retailers, e-commerce platforms and consumer brands to develop practical strategies that unlock growth and build sustainable capabilities.", 'يعد قطاع التجزئة والتجارة الإلكترونية ركيزة للاقتصاد المتنوع في المملكة، ويتطور بسرعة مع الابتكار الرقمي وقاعدة مستهلكين نشطة ومهتمة بالعلامات. نعمل مع تجار التجزئة ومنصات التجارة الإلكترونية والعلامات الاستهلاكية على استراتيجيات عملية تفتح آفاق النمو وتبني قدرات مستدامة.'),
    challengesTitle: L('Navigating a fast-changing retail landscape', 'التعامل مع مشهد تجزئة سريع التغير'),
    challenges: [
      [L('Evolving consumer expectations', 'توقعات مستهلك متطورة'), L('Meeting demand for personalised, seamless and omni-channel experiences.', 'تلبية الطلب على تجارب مخصصة وسلسة متعددة القنوات.'), 'users'],
      [L('Intensifying competition', 'منافسة متصاعدة'), L('Differentiating in a crowded market with local and global players.', 'التمايز في سوق مزدحم بلاعبين محليين وعالميين.'), 'chart'],
      [L('Technology and digital transformation', 'التقنية والتحول الرقمي'), L('Keeping pace with rapid technological change and innovative business models.', 'مواكبة التغير التقني السريع ونماذج الأعمال المبتكرة.'), 'chip'],
      [L('Operational complexity', 'التعقيد التشغيلي'), L('Managing supply chains, inventory and fulfilment efficiently.', 'إدارة سلاسل الإمداد والمخزون والتنفيذ بكفاءة.'), 'gear']
    ],
    services: ['market-strategy-entry', 'brand-marketing-digital-growth', 'technology-automation', 'operations-business-support']
  },
  {
    slug: 'professional-business-services', group: 'target', icon: 'briefcase', card: 'ind-professional', hero: 'p-professional', over: 'meeting-window',
    title: L('Professional & Business Services', 'الخدمات المهنية وخدمات الأعمال'),
    short: L('Professional & Business Services', 'الخدمات المهنية والأعمال'),
    tagline: L('Advisory for a more competitive, innovative and resilient professional services sector in Saudi Arabia.', 'استشارات لقطاع خدمات مهنية أكثر تنافسية وابتكارًا ومرونة في المملكة.'),
    overviewTitle: L('A growing sector with a critical role', 'قطاع متنامٍ بدور حاسم'),
    overview: L("Legal, accounting, architecture and other professional services firms play a critical role in enabling Saudi Arabia's economic transformation. We help firms enter and grow, build local teams and differentiate with trusted, specialised capabilities.", 'تؤدي شركات الخدمات القانونية والمحاسبية والمعمارية وغيرها دورًا حاسمًا في تمكين التحول الاقتصادي للمملكة. نساعد الشركات على الدخول والنمو وبناء فرق محلية والتميّز بقدرات متخصصة موثوقة.'),
    challengesTitle: L('Key challenges for the sector', 'أبرز تحديات القطاع'),
    challenges: [
      [L('Evolving client expectations', 'توقعات عملاء متطورة'), L('Rising demand for higher integrated and technology-enabled solutions.', 'ارتفاع الطلب على حلول متكاملة ومدعومة بالتقنية.'), 'users'],
      [L('Increasing competition', 'منافسة متزايدة'), L('Greater domestic and international competition across service lines.', 'منافسة أكبر محليًا ودوليًا عبر خطوط الخدمة.'), 'chart'],
      [L('Talent and capabilities', 'الكفاءات والقدرات'), L('Attracting, developing and retaining talent for rapidly changing demand.', 'استقطاب الكفاءات وتطويرها والاحتفاظ بها في ظل طلب سريع التغير.'), 'person'],
      [L('Regulatory and market change', 'التغير التنظيمي وتغير السوق'), L('Navigating evolving regulation, licensing and professional standards.', 'التعامل مع أنظمة وتراخيص ومعايير مهنية متطورة.'), 'doc']
    ],
    services: ['market-strategy-entry', 'formation-establishment', 'hr-talent-executive-mobility', 'governance-finance-compliance']
  },
  {
    slug: 'tourism-leisure', group: 'target', icon: 'palm', card: 'ind-tourism', hero: 'alula-tombs', over: 'ind-tourism',
    title: L('Tourism & Leisure', 'السياحة والترفيه'),
    short: L('Tourism & Leisure', 'السياحة والترفيه'),
    tagline: L("Advisory for destination, attraction and leisure operators capturing the opportunity in Saudi Arabia's rapidly growing visitor economy.", 'استشارات للوجهات والمعالم ومشغّلي الترفيه لاقتناص الفرصة في اقتصاد الزوّار سريع النمو في المملكة.'),
    overviewTitle: L('A visitor economy taking shape', 'اقتصاد زوّار يتشكل'),
    overview: L('New destinations, heritage sites, events and leisure experiences are expanding what Saudi Arabia offers visitors. We help operators and investors assess demand, structure partnerships, and build the operating capability to deliver memorable experiences.', 'تتسع تجارب الزوّار في المملكة مع وجهات جديدة ومواقع تراثية وفعاليات وتجارب ترفيهية. نساعد المشغّلين والمستثمرين على تقييم الطلب وهيكلة الشراكات وبناء القدرة التشغيلية لتقديم تجارب لا تُنسى.'),
    challengesTitle: L('Key challenges in tourism and leisure', 'أبرز التحديات في السياحة والترفيه'),
    challenges: [
      [L('Demand and seasonality', 'الطلب والموسمية'), L('Forecasting visitor demand and managing seasonal patterns.', 'التنبؤ بطلب الزوّار وإدارة الأنماط الموسمية.'), 'chart'],
      [L('Experience design', 'تصميم التجربة'), L('Creating authentic, high-quality visitor experiences.', 'صناعة تجارب زوّار أصيلة وعالية الجودة.'), 'bulb'],
      [L('Partners and licensing', 'الشركاء والتراخيص'), L('Working with destination authorities, operators and suppliers.', 'العمل مع جهات الوجهات والمشغّلين والموردين.'), 'handshake'],
      [L('Sustainability', 'الاستدامة'), L('Protecting heritage and environment while growing visitor numbers.', 'حماية التراث والبيئة مع زيادة أعداد الزوّار.'), 'leaf']
    ],
    services: ['market-strategy-entry', 'partnerships-commercial-development', 'operations-business-support', 'brand-marketing-digital-growth']
  }
];

export const industryBySlug = (s) => INDUSTRIES.find((x) => x.slug === s);
export { GENERIC_CHALLENGE_ICONS };
