import { L } from './ui.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const VAT_RATE = 0.15;
export const CURRENCY = 'SAR';
export const LICENCE_VERSION = 'licence-2026-1';

export const PRODUCTS = [
  { slug: 'fmcg-market-entry-brief', sector: 'fmcg', price: 750, pages: 14, card: 'ind-fmcg', file: 'fmcg.pdf',
    title: L('FMCG & Consumer Brands: the Saudi market-entry brief', 'السلع الاستهلاكية: موجز دخول السوق السعودي'),
    tagline: L('How goods actually reach Saudi shelves, and where new brands lose time and money.', 'كيف تصل السلع فعلًا إلى الرفوف السعودية، وأين تخسر العلامات الجديدة وقتها ومالها.'),
    desc: L('A practical guide for brands that want to sell in Saudi supermarkets, convenience stores and online. It explains how the trade is organised, what distributors expect, which approvals to check before you ship, and how to plan the first year without burning cash.', 'دليل عملي للعلامات التي تريد البيع في السوبرماركت والبقالات والمتاجر الإلكترونية السعودية. يشرح كيف تتنظم التجارة، وماذا يتوقع الموزعون، وما الموافقات التي تتحقق منها قبل الشحن، وكيف تخطط للسنة الأولى دون استنزاف السيولة.') },
  { slug: 'real-estate-market-entry-brief', sector: 'real-estate', price: 850, pages: 14, card: 'ind-realestate', file: 'real-estate.pdf',
    title: L('Real Estate: the Saudi market-entry brief', 'العقارات: موجز دخول السوق السعودي'),
    tagline: L('Developers, investors and operators: who does what, and how to find a way in.', 'مطورون ومستثمرون ومشغّلون: من يفعل ماذا، وكيف تجد طريقك.'),
    desc: L('For anyone weighing a property or development play in the Kingdom. It sets out how the market is structured, the parts of regulation you should confirm early, the kinds of partner you will meet, and a sensible order of steps for a first project.', 'لمن يدرس دخول العقار أو التطوير في المملكة. يوضح كيف يتشكل السوق، وأي أجزاء النظام ينبغي أن تتأكد منها مبكرًا، وأنواع الشركاء الذين ستقابلهم، وترتيبًا معقولًا للخطوات لأول مشروع.') },
  { slug: 'hospitality-market-entry-brief', sector: 'hospitality', price: 750, pages: 14, card: 'ind-hospitality', file: 'hospitality.pdf',
    title: L('Hospitality: the Saudi market-entry brief', 'الضيافة: موجز دخول السوق السعودي'),
    tagline: L('Hotels, restaurants and experiences in a market that is building a visitor economy from scratch.', 'فنادق ومطاعم وتجارب في سوق يبني اقتصاد الزوّار من الأساس.'),
    desc: L('A guide for operators, brands and investors. It covers the common operating models, how demand moves through the year, what it takes to staff and license a venue, and the questions to ask a destination developer before you sign.', 'دليل للمشغّلين والعلامات والمستثمرين. يغطي نماذج التشغيل الشائعة، وكيف يتحرك الطلب على مدار العام، وما يلزم لتوظيف وترخيص منشأة، والأسئلة التي تسألها لمطور الوجهة قبل التوقيع.') },
  { slug: 'manufacturing-market-entry-brief', sector: 'manufacturing', price: 850, pages: 14, card: 'ind-manufacturing', file: 'manufacturing.pdf',
    title: L('Industry & Manufacturing: the Saudi market-entry brief', 'الصناعة والتصنيع: موجز دخول السوق السعودي'),
    tagline: L('From site and incentives to supply chain and skilled labour, in a plain order of work.', 'من الموقع والحوافز إلى سلسلة الإمداد والعمالة الماهرة، بترتيب عمل واضح.'),
    desc: L('For manufacturers weighing a plant, an assembly line or a local partnership. It walks through how to choose a location, what incentives and local-content expectations may apply, and how to avoid the delays that catch most first-time investors.', 'للمصنّعين الذين يدرسون مصنعًا أو خط تجميع أو شراكة محلية. يشرح كيف تختار الموقع، وما الحوافز وتوقعات المحتوى المحلي التي قد تنطبق، وكيف تتجنب التأخيرات التي تفاجئ أغلب المستثمرين لأول مرة.') },
  { slug: 'technology-market-entry-brief', sector: 'technology-digital', price: 750, pages: 14, card: 'ind-tech', file: 'technology.pdf',
    title: L('Technology & Digital: the Saudi market-entry brief', 'التقنية والرقمية: موجز دخول السوق السعودي'),
    tagline: L('Selling software and digital services to enterprises and government.', 'بيع البرمجيات والخدمات الرقمية للمؤسسات والجهات الحكومية.'),
    desc: L('What technology companies need to know about Saudi buyers: how enterprise and government purchasing works, the data and security questions that come up early, and the local presence buyers increasingly expect.', 'ما تحتاج شركات التقنية معرفته عن المشترين السعوديين: كيف تعمل مشتريات المؤسسات والحكومة، وأسئلة البيانات والأمن التي تظهر مبكرًا، والحضور المحلي الذي يتوقعه المشترون أكثر فأكثر.') },
  { slug: 'healthcare-market-entry-brief', sector: 'healthcare-life-sciences', price: 950, pages: 14, card: 'ind-healthcare', file: 'healthcare.pdf',
    title: L('Healthcare & Life Sciences: the Saudi market-entry brief', 'الرعاية الصحية وعلوم الحياة: موجز دخول السوق السعودي'),
    tagline: L('Providers, suppliers and investors in a sector that is being reshaped.', 'مقدمو خدمة وموردون ومستثمرون في قطاع يُعاد تشكيله.'),
    desc: L('A guide to a heavily regulated sector. It explains who the main bodies are, how approvals and professional licensing generally work, where private capital and partnerships fit, and how to plan realistic lead times.', 'دليل لقطاع شديد التنظيم. يشرح من هي الجهات الرئيسية، وكيف تعمل الموافقات والترخيص المهني عمومًا، وأين يندرج رأس المال الخاص والشراكات، وكيف تخطط لمدد تنفيذ واقعية.') },
  { slug: 'logistics-market-entry-brief', sector: 'logistics-supply-chain', price: 850, pages: 14, card: 'ind-logistics', file: 'logistics.pdf',
    title: L('Logistics & Supply Chain: the Saudi market-entry brief', 'اللوجستيات وسلاسل الإمداد: موجز دخول السوق السعودي'),
    tagline: L('Ports, hubs, free zones and customs: how to choose where to build.', 'موانئ ومراكز ومناطق حرة وجمارك: كيف تختار أين تبني.'),
    desc: L('For operators, shippers and investors. It lays out the network you will be working in, how to compare locations and partners, the customs and licensing questions to settle early, and how to test a route before you commit.', 'للمشغّلين والشاحنين والمستثمرين. يعرض الشبكة التي ستعمل فيها، وكيف تقارن المواقع والشركاء، وأسئلة الجمارك والترخيص التي تحسمها مبكرًا، وكيف تختبر مسارًا قبل الالتزام.') },
  { slug: 'retail-ecommerce-market-entry-brief', sector: 'retail-ecommerce', price: 750, pages: 14, card: 'ind-retail', file: 'retail.pdf',
    title: L('Retail & E-commerce: the Saudi market-entry brief', 'التجزئة والتجارة الإلكترونية: موجز دخول السوق السعودي'),
    tagline: L('Stores, marketplaces and your own site: what Saudi shoppers expect.', 'متاجر وأسواق إلكترونية وموقعك الخاص: ما يتوقعه المتسوق السعودي.'),
    desc: L('For retailers and online sellers. It covers channels, payments and delivery, the way Saudi customers shop and return, the compliance points that catch overseas sellers out, and a first-year plan that keeps costs under control.', 'لتجار التجزئة والبائعين عبر الإنترنت. يغطي القنوات والدفع والتوصيل، وطريقة تسوّق العميل السعودي وإرجاعه، ونقاط الامتثال التي تفاجئ البائعين من الخارج، وخطة السنة الأولى التي تضبط التكاليف.') }
];
// Real page counts come from the generated PDFs (scripts/make-briefs.mjs writes the manifest).
try {
  const manifest = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'private', 'briefs', 'manifest.json'), 'utf8'));
  PRODUCTS.forEach((p) => { if (manifest[p.file]) p.pages = manifest[p.file].pages; });
} catch { /* manifest not generated yet: keep the default */ }
export const productBySlug = (s) => PRODUCTS.find((p) => p.slug === s);

export const SHOP = {
  meta: { title: L('Sector briefs | Growth Blueprint', 'الموجزات القطاعية | غروث بلوبرينت'), description: L('Plain-language guides to entering Saudi sectors, written by advisers who do this work. Instant, secure PDF download.', 'أدلة بلغة واضحة لدخول القطاعات السعودية، كتبها مستشارون يعملون في هذا المجال. تنزيل PDF فوري وآمن.') },
  hero: { eyebrow: L('Sector briefs', 'الموجزات القطاعية'), title: L('The briefing you wish you had before your first meeting', 'الموجز الذي تتمنى لو قرأته قبل اجتماعك الأول'), lead: L('Short, honest guides to the Saudi sectors we work in. Each one is written to be read in an evening and used for months: how the market works, what to check, where people go wrong, and what to do first.', 'أدلة قصيرة وصريحة للقطاعات السعودية التي نعمل فيها. كل دليل مكتوب ليُقرأ في أمسية ويُستخدم لأشهر: كيف يعمل السوق، وما الذي تتحقق منه، وأين يخطئ الناس، وماذا تفعل أولًا.'), img: 'hero-riyadh-bridge' },
  why: { eyebrow: L('Why a brief', 'لماذا موجز'), title: L('Because a good first read saves a bad first quarter', 'لأن قراءة أولى جيدة توفر ربعًا أولًا سيئًا'),
    items: [
      { icon: 'clipboard', t: L('Practical, not theoretical', 'عملي لا نظري'), d: L('Checklists, questions to ask and a sensible order of steps, not a lecture on the economy.', 'قوائم تحقق وأسئلة تطرحها وترتيب معقول للخطوات، لا محاضرة عن الاقتصاد.') },
      { icon: 'shield', t: L('Honest about what we do not know', 'صريح في ما لا نعرفه'), d: L('Where rules change often, we say so and tell you what to confirm with a licensed adviser.', 'حيث تتغير الأنظمة كثيرًا نقول ذلك ونخبرك بما تؤكده مع مستشار مرخّص.') },
      { icon: 'download', t: L('Yours in a minute', 'بين يديك في دقيقة'), d: L('Pay, then download straight away. A secure link, on any device, and you can come back to it.', 'ادفع ثم نزّل فورًا. رابط آمن على أي جهاز، ويمكنك العودة إليه.') }
    ] },
  filters: L('Filter by sector', 'تصفية حسب القطاع'),
  pages: L('pages', 'صفحة'), pdf: L('PDF', 'PDF'), vatNote: L('Prices exclude 15% VAT, shown at checkout.', 'الأسعار غير شاملة ضريبة القيمة المضافة ١٥٪ وتظهر عند الدفع.'),
  view: L('View the brief', 'اطلع على الموجز'), add: L('Add to basket', 'أضف إلى السلة'), added: L('Added to basket', 'أُضيف إلى السلة'), inBasket: L('In your basket', 'في سلتك'), basket: L('Basket', 'السلة'), buyNow: L('Buy now', 'اشترِ الآن'),
  detail: { inside: L("What's inside", 'ما بداخله'), forWho: L('Who it is for', 'لمن هو'), toc: L('Contents', 'المحتويات'), sample: L('A taste of it', 'مقتطف منه'), details: L('Details', 'التفاصيل'), format: L('Format', 'الصيغة'), edition: L('Edition', 'الإصدار'), language: L('Language', 'اللغة'), updated: L('Written for 2026', 'مكتوب لعام ٢٠٢٦'), lang: L('English, with a one-page Arabic summary', 'بالإنجليزية مع ملخص عربي من صفحة'), licence: L('Single-user licence', 'ترخيص لمستخدم واحد'), delivery: L('Instant secure download', 'تنزيل آمن فوري'),
    secure: L('Your download link is personal, expires after a short time, and can only be used a few times. You can always generate a fresh one from your order page.', 'رابط التنزيل شخصي، وتنتهي صلاحيته بعد وقت قصير، ولا يمكن استخدامه إلا بضع مرات. ويمكنك دائمًا إنشاء رابط جديد من صفحة طلبك.'),
    related: L('Other briefs you may need', 'موجزات أخرى قد تحتاجها'), back: L('All briefs', 'كل الموجزات'), notAdvice: L('Briefs are general guidance written by advisers. They are not legal, tax or investment advice.', 'الموجزات إرشاد عام كتبه مستشارون. وليست مشورة قانونية أو ضريبية أو استثمارية.') },
  basketPage: { title: L('Your basket', 'سلتك'), empty: L('Your basket is empty.', 'سلتك فارغة.'), emptyCta: L('Browse the briefs', 'تصفح الموجزات'), remove: L('Remove', 'إزالة'), subtotal: L('Subtotal', 'المجموع قبل الضريبة'), vat: L('VAT (15%)', 'ضريبة القيمة المضافة (١٥٪)'), total: L('Total', 'الإجمالي'), checkout: L('Go to checkout', 'إلى الدفع'), continue: L('Keep browsing', 'تابع التصفح') },
  checkout: { eyebrow: L('Checkout', 'الدفع'), title: L('Almost there', 'اقتربنا'), lead: L('We only ask for what we need to send you your briefs and a VAT invoice.', 'لا نطلب إلا ما نحتاجه لنرسل لك موجزاتك وفاتورة ضريبية.'), summary: L('Your order', 'طلبك'),
    f: { name: L('Full name', 'الاسم الكامل'), email: L('Email address', 'البريد الإلكتروني'), emailHint: L('Your receipt and download links will be sent here.', 'سيصلك الإيصال وروابط التنزيل هنا.'), company: L('Company (optional)', 'الشركة (اختياري)'), vat: L('VAT registration number (optional)', 'الرقم الضريبي (اختياري)'), country: L('Country', 'الدولة') },
    consent: { licence: L('I accept the single-user licence terms for these briefs.', 'أوافق على شروط الترخيص لمستخدم واحد لهذه الموجزات.'), privacy: L('I agree that you may use my details to process this order and send my receipt and downloads. I have read the', 'أوافق على استخدام بياناتي لمعالجة هذا الطلب وإرسال الإيصال وروابط التنزيل. وقد قرأت'), marketing: L('Optional: send me the monthly Growth Blueprint brief. I can unsubscribe at any time.', 'اختياري: أرسلوا لي موجز غروث بلوبرينت الشهري. ويمكنني إلغاء الاشتراك في أي وقت.') },
    pay: L('Pay securely', 'ادفع بأمان'), paying: L('Processing…', 'جارٍ المعالجة…'),
    demo: L('Payment is simulated in this build. No card is charged.', 'الدفع في هذه النسخة محاكى. ولا يُخصم أي مبلغ من أي بطاقة.'),
    err: { name: L('Please enter your name.', 'يرجى إدخال اسمك.'), email: L('Please enter a valid email address.', 'يرجى إدخال بريد إلكتروني صحيح.'), licence: L('Please accept the licence terms to continue.', 'يرجى قبول شروط الترخيص للمتابعة.'), privacy: L('Please confirm you have read the Privacy Notice.', 'يرجى تأكيد قراءة إشعار الخصوصية.'), server: L('Something went wrong. Nothing was charged. Please try again.', 'حدث خطأ. لم يُخصم أي مبلغ. يرجى المحاولة مرة أخرى.') },
    noServer: L('Checkout is not available on this copy of the site because it is not connected to our server. See the README to run it with the shop enabled.', 'الدفع غير متاح في هذه النسخة من الموقع لأنها غير متصلة بخادمنا. راجع ملف README لتشغيله مع تفعيل المتجر.'),
    licenceTitle: L('Licence in plain words', 'الترخيص بكلمات واضحة'), licenceBody: L('You may use a brief for your own organisation’s internal planning. Please do not share, resell or publish it. If colleagues need it, buy additional copies, or ask us about a team licence.', 'يمكنك استخدام الموجز للتخطيط الداخلي في مؤسستك. يرجى عدم مشاركته أو إعادة بيعه أو نشره. وإذا احتاجه زملاؤك فاشترِ نسخًا إضافية أو اسألنا عن ترخيص للفريق.') },
  order: { eyebrow: L('Order confirmed', 'تم تأكيد الطلب'), title: L('Thank you. Your briefs are ready.', 'شكرًا لك. موجزاتك جاهزة.'), lead: L('Download them below. We have also emailed you a receipt with a link back to this page.', 'نزّلها أدناه. وأرسلنا إليك أيضًا إيصالًا برابط للعودة إلى هذه الصفحة.'),
    ref: L('Order reference', 'مرجع الطلب'), download: L('Download PDF', 'تنزيل PDF'), preparing: L('Preparing your secure link…', 'جارٍ تجهيز رابطك الآمن…'), left: L('downloads left', 'تنزيلات متبقية'), none: L('No downloads left. Contact us and we will help.', 'لا تنزيلات متبقية. تواصل معنا وسنساعدك.'), expired: L('This link has expired. Please try again.', 'انتهت صلاحية الرابط. يرجى المحاولة مرة أخرى.'),
    tips: L('Keep this page. If you need a fresh download link later, come back here and press Download again.', 'احتفظ بهذه الصفحة. وإن احتجت رابطًا جديدًا لاحقًا فعد إليها واضغط تنزيل مرة أخرى.'), invoice: L('View tax invoice', 'عرض الفاتورة الضريبية'), notFound: L('We could not find this order. Check the link in your receipt email.', 'لم نجد هذا الطلب. تحقق من الرابط في بريد الإيصال.'), next: L('While you are here', 'وأنت هنا'), nextBody: L('Take the 10-minute Saudi Readiness Scorecard to see how your own plans measure up.', 'أجرِ مقياس الجاهزية السعودي في ١٠ دقائق لترى كيف تقف خططك.'), nextCta: L('Start the scorecard', 'ابدأ المقياس') },
  licenceDoc: { title: L('Brief licence terms', 'شروط ترخيص الموجز') }
};
