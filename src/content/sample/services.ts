import type { Locale } from "@/i18n/config";
import type { ReviewStatus, ServiceCopy, ServicesContent } from "../types";

/**
 * Sample services content. Written from the supplied reference concepts (service names and one-line descriptions)
 * plus drafted, deliberately cautious detail copy. No outcomes, statistics, credentials or guarantees are claimed.
 * English = "draft" (pending client approval). Arabic = "needs-professional-review" (unreviewed draft).
 */
type Body = Omit<ServiceCopy, "id" | "review">;
const withReview = (review: ReviewStatus, rows: Record<string, Body>): ServiceCopy[] =>
  Object.entries(rows).map(([id, body]) => ({ id, review, ...body }));

const en: Record<string, Body> = {
  "market-entry-advisory": {
    title: "Market Entry Advisory",
    summary: "Strategy, market analysis and route-to-market planning.",
    intro: "Advisory to help you assess the Saudi opportunity and decide how, where and when you may want to enter.",
    audience: ["Businesses considering Saudi Arabia for the first time", "Organisations comparing entry routes or timing", "Leadership teams that want a clear, structured view before committing resources"],
    topics: ["Market and opportunity assessment", "Customer and competitive landscape", "Entry route options", "Prioritisation and phasing", "Early resource and capability considerations"],
    outputs: ["A market opportunity summary", "An outline of entry options and their trade-offs", "A route-to-market plan", "A prioritised list of next steps"],
  },
  "regulatory-licensing-support": {
    title: "Regulatory & Licensing Support",
    summary: "Guidance through regulatory requirements and licensing processes.",
    intro: "Practical guidance to help you understand the regulatory and licensing steps that may apply to your business in Saudi Arabia.",
    audience: ["Businesses preparing to operate in Saudi Arabia", "Teams unsure which requirements may apply to their activity", "Organisations that need to coordinate with legal and other advisers"],
    topics: ["Registrations and licences that may apply", "Requirements that may vary by sector and activity", "Sequencing of application steps", "Coordination with relevant advisers and authorities", "Preparing supporting documentation"],
    outputs: ["A summary of regulatory and licensing considerations", "An outline of possible steps and sequencing", "A documentation checklist", "Coordination notes for legal and other advisers"],
  },
  "local-partner-identification": {
    title: "Local Partner Identification",
    summary: "Support in identifying and assessing potential local partners.",
    intro: "Support to help you define what you need from a local partner, and to identify and assess potential options.",
    audience: ["Businesses that may need a local partner, distributor or collaborator", "Teams comparing partnership models", "Organisations that want a structured way to assess potential partners"],
    topics: ["Defining partner criteria", "Identifying potential partners", "Assessing fit and capability", "Preparing introductions and early discussions", "Considering partnership structures"],
    outputs: ["Partner criteria and a long-list of options", "An assessment of shortlisted partners", "An engagement and introduction plan", "Considerations for structuring a partnership"],
  },
  "business-setup-support": {
    title: "Business Setup Support",
    summary: "Assistance with company setup and operational readiness.",
    intro: "Assistance to help you plan and prepare the practical steps of setting up a business presence in Saudi Arabia.",
    audience: ["Businesses that have decided to establish a presence", "Teams coordinating several advisers and providers", "Organisations that want a clear sequence of setup steps"],
    topics: ["Choosing a structure, with specialist advisers", "Setup planning and sequencing", "Team, premises and supplier readiness", "Coordinating banking, tax and compliance providers", "Launch readiness"],
    outputs: ["A setup roadmap", "A readiness checklist", "A plan of responsibilities and timing", "Coordination with specialist providers"],
  },
  "go-to-market-strategy": {
    title: "Go-to-Market Strategy",
    summary: "Tailored commercial strategies for sustainable growth.",
    intro: "Commercial planning to help you decide who to serve, how to position your offer and how to reach customers in Saudi Arabia.",
    audience: ["Businesses preparing to launch or relaunch in Saudi Arabia", "Teams that need to prioritise segments and channels", "Organisations adapting an existing offer to a new market"],
    topics: ["Target segments and customers", "Value proposition and positioning", "Pricing and channel approach", "Sales and marketing priorities", "Launch and scale-up planning"],
    outputs: ["A go-to-market plan", "A summary of segments and proposition", "A channel and partner approach", "Commercial priorities with indicative sequencing"],
  },
  "operational-setup-advisory": {
    title: "Operational Setup Advisory",
    summary: "Support in building efficient operations and local capabilities.",
    intro: "Advisory to help you design and build the operations and local capabilities your business may need to deliver in Saudi Arabia.",
    audience: ["Businesses setting up operations for the first time", "Teams scaling an existing local operation", "Leaders who want a clear operating model before expanding"],
    topics: ["Operating model design", "Processes and systems", "Supply chain and service delivery", "Building local capabilities", "Governance and performance tracking"],
    outputs: ["An operating model outline", "An operational set-up plan", "A view of capability gaps", "A framework of performance measures"],
  },
  "talent-organisation-advisory": {
    title: "Talent & Organisation Advisory",
    summary: "Guidance on talent, structure and organisational readiness.",
    intro: "Guidance to help you think through the people and organisation your Saudi business may need as it starts and grows.",
    audience: ["Businesses planning their first local team", "Leaders reviewing structure as the business grows", "Organisations building local leadership and capability"],
    topics: ["Organisation structure", "Role and capability needs", "Recruitment and onboarding approach", "Local team development", "Leadership and culture considerations"],
    outputs: ["Organisation design options", "A resourcing plan", "An outline of key roles", "An onboarding and development approach"],
  },
  "ongoing-growth-advisory": {
    title: "Ongoing Growth Advisory",
    summary: "Continued support to scale, diversify and capture new opportunities.",
    intro: "Continued advisory support to help you review progress and consider how you may scale, diversify or pursue new opportunities.",
    audience: ["Businesses already operating in Saudi Arabia", "Leaders who want an independent sounding board", "Teams planning the next phase of growth"],
    topics: ["Progress review", "Expansion and diversification options", "Partnership and channel development", "Operating improvements", "Strategic planning"],
    outputs: ["Periodic progress reviews", "Prioritised growth options", "Updated plans", "Ongoing advisory support"],
  },
};

const ar: Record<string, Body> = {
  "market-entry-advisory": {
    title: "استشارات دخول السوق",
    summary: "الاستراتيجية وتحليل السوق وتخطيط منافذ الوصول إلى السوق.",
    intro: "استشارات تساعدك على تقييم الفرصة في السوق السعودي وتحديد كيف وأين ومتى قد ترغب في الدخول.",
    audience: ["شركات تدرس دخول المملكة العربية السعودية لأول مرة", "مؤسسات تقارن بين مسارات الدخول أو توقيته", "فرق قيادية ترغب في رؤية واضحة ومنظمة قبل تخصيص الموارد"],
    topics: ["تقييم السوق والفرصة", "المشهد التنافسي وشرائح العملاء", "خيارات مسار الدخول", "ترتيب الأولويات والمراحل", "اعتبارات أولية للموارد والقدرات"],
    outputs: ["ملخص لفرصة السوق", "عرض موجز لخيارات الدخول ومفاضلاتها", "خطة للوصول إلى السوق", "قائمة مرتبة بالخطوات التالية"],
  },
  "regulatory-licensing-support": {
    title: "الدعم التنظيمي والترخيص",
    summary: "إرشاد خلال المتطلبات التنظيمية وإجراءات الترخيص.",
    intro: "إرشاد عملي يساعدك على فهم الخطوات التنظيمية وخطوات الترخيص التي قد تنطبق على عملك في المملكة العربية السعودية.",
    audience: ["شركات تستعد للعمل في المملكة", "فرق غير متأكدة من المتطلبات التي قد تنطبق على نشاطها", "مؤسسات تحتاج إلى التنسيق مع المستشارين القانونيين وغيرهم"],
    topics: ["التسجيلات والتراخيص التي قد تنطبق", "متطلبات قد تختلف بحسب القطاع والنشاط", "تسلسل خطوات التقديم", "التنسيق مع المستشارين والجهات المعنية", "إعداد المستندات الداعمة"],
    outputs: ["ملخص للاعتبارات التنظيمية واعتبارات الترخيص", "عرض موجز للخطوات المحتملة وتسلسلها", "قائمة مرجعية للمستندات", "ملاحظات تنسيق للمستشارين القانونيين وغيرهم"],
  },
  "local-partner-identification": {
    title: "تحديد الشركاء المحليين",
    summary: "دعم في تحديد الشركاء المحليين المحتملين وتقييمهم.",
    intro: "دعم يساعدك على تحديد ما تحتاجه من شريك محلي، وعلى تحديد الخيارات المحتملة وتقييمها.",
    audience: ["شركات قد تحتاج إلى شريك أو موزّع أو متعاون محلي", "فرق تقارن بين نماذج الشراكة", "مؤسسات ترغب في طريقة منظمة لتقييم الشركاء المحتملين"],
    topics: ["تحديد معايير اختيار الشريك", "تحديد الشركاء المحتملين", "تقييم الملاءمة والقدرات", "الإعداد للتعارف والنقاشات الأولية", "النظر في هياكل الشراكة"],
    outputs: ["معايير الشريك وقائمة أولية بالخيارات", "تقييم للشركاء المرشحين", "خطة للتواصل والتعارف", "اعتبارات لهيكلة الشراكة"],
  },
  "business-setup-support": {
    title: "دعم تأسيس الأعمال",
    summary: "مساندة في تأسيس الشركة والجاهزية التشغيلية.",
    intro: "مساندة تساعدك على التخطيط للخطوات العملية لتأسيس حضور لعملك في المملكة العربية السعودية والاستعداد لها.",
    audience: ["شركات قرّرت تأسيس حضور لها", "فرق تنسّق بين عدة مستشارين ومزوّدي خدمات", "مؤسسات ترغب في تسلسل واضح لخطوات التأسيس"],
    topics: ["اختيار الهيكل بالتعاون مع مستشارين متخصصين", "التخطيط للتأسيس وتسلسل خطواته", "جاهزية الفريق والمقر والموردين", "التنسيق مع مزوّدي الخدمات المصرفية والضريبية والامتثال", "الجاهزية للإطلاق"],
    outputs: ["خارطة طريق للتأسيس", "قائمة مرجعية للجاهزية", "خطة للمسؤوليات والتوقيت", "تنسيق مع مزوّدي الخدمات المتخصصين"],
  },
  "go-to-market-strategy": {
    title: "استراتيجية الوصول إلى السوق",
    summary: "استراتيجيات تجارية مصمّمة لنمو مستدام.",
    intro: "تخطيط تجاري يساعدك على تحديد الفئات التي تخدمها وكيفية تموضع عرضك وكيفية الوصول إلى العملاء في المملكة العربية السعودية.",
    audience: ["شركات تستعد للإطلاق أو إعادة الإطلاق في المملكة", "فرق تحتاج إلى ترتيب أولويات الشرائح والقنوات", "مؤسسات تكيّف عرضًا قائمًا مع سوق جديد"],
    topics: ["الشرائح والعملاء المستهدفون", "القيمة المقترحة والتموضع", "التسعير ونهج القنوات", "أولويات المبيعات والتسويق", "التخطيط للإطلاق والتوسع"],
    outputs: ["خطة للوصول إلى السوق", "ملخص للشرائح والقيمة المقترحة", "نهج للقنوات والشركاء", "أولويات تجارية مع تسلسل استرشادي"],
  },
  "operational-setup-advisory": {
    title: "استشارات الإعداد التشغيلي",
    summary: "دعم في بناء عمليات كفؤة وقدرات محلية.",
    intro: "استشارات تساعدك على تصميم وبناء العمليات والقدرات المحلية التي قد يحتاجها عملك للتنفيذ في المملكة العربية السعودية.",
    audience: ["شركات تؤسس عملياتها للمرة الأولى", "فرق توسّع عمليات محلية قائمة", "قيادات ترغب في نموذج تشغيلي واضح قبل التوسع"],
    topics: ["تصميم النموذج التشغيلي", "العمليات والأنظمة", "سلسلة الإمداد وتقديم الخدمة", "بناء القدرات المحلية", "الحوكمة وتتبع الأداء"],
    outputs: ["عرض موجز للنموذج التشغيلي", "خطة للإعداد التشغيلي", "تصور لفجوات القدرات", "إطار لمؤشرات الأداء"],
  },
  "talent-organisation-advisory": {
    title: "استشارات المواهب والمنظمة",
    summary: "إرشاد بشأن المواهب والهيكل التنظيمي والجاهزية المؤسسية.",
    intro: "إرشاد يساعدك على التفكير في الكوادر والتنظيم الذي قد يحتاجه عملك في السعودية مع انطلاقه ونموه.",
    audience: ["شركات تخطط لفريقها المحلي الأول", "قيادات تراجع الهيكل مع نمو العمل", "مؤسسات تبني قيادة وقدرات محلية"],
    topics: ["الهيكل التنظيمي", "احتياجات الأدوار والقدرات", "نهج الاستقطاب والتهيئة", "تطوير الفريق المحلي", "اعتبارات القيادة والثقافة"],
    outputs: ["خيارات للتصميم التنظيمي", "خطة للموارد البشرية", "عرض موجز للأدوار الرئيسية", "نهج للتهيئة والتطوير"],
  },
  "ongoing-growth-advisory": {
    title: "استشارات النمو المستمر",
    summary: "دعم متواصل للتوسع والتنويع واقتناص فرص جديدة.",
    intro: "دعم استشاري متواصل يساعدك على مراجعة التقدّم والنظر في كيفية التوسع أو التنويع أو السعي إلى فرص جديدة.",
    audience: ["شركات تعمل بالفعل في المملكة العربية السعودية", "قيادات ترغب في طرف مستقل تتشاور معه", "فرق تخطط للمرحلة التالية من النمو"],
    topics: ["مراجعة التقدّم", "خيارات التوسع والتنويع", "تطوير الشراكات والقنوات", "تحسينات تشغيلية", "التخطيط الاستراتيجي"],
    outputs: ["مراجعات دورية للتقدّم", "خيارات نمو مرتبة بالأولوية", "خطط محدّثة", "دعم استشاري متواصل"],
  },
};

const home = {
  en: {
    meta: { title: "Services | Growth Blueprint Advisory", description: "Advisory services to help ambitious businesses enter, establish and grow in Saudi Arabia." },
    hero: { eyebrow: "Our services", title: "End-to-end advisory for your Saudi growth journey", intro: "Practical, sector-aware advisory across the business lifecycle, from understanding the market to planning for long-term growth." },
    groups: {
      enter: { title: "Entering Saudi Arabia", intro: "Services that may help you assess, plan and establish your presence." },
      grow: { title: "Growing in Saudi Arabia", intro: "Services that may help you build, scale and develop what you have established." },
    },
    journey: { eyebrow: "The advisory journey", title: "How the services fit together", intro: "Each engagement is shaped around your objectives. These stages describe a typical way of working; the services you use may vary." },
    labels: { audience: "Who this is for", topics: "What it can cover", outputs: "Possible engagement outputs", outputsNote: "Depending on the engagement, the work may include:", related: "Related services", allServices: "All services" },
  },
  ar: {
    meta: { title: "الخدمات | Growth Blueprint Advisory", description: "خدمات استشارية تساعد الشركات الطموحة على الدخول والتأسيس والنمو في المملكة العربية السعودية." },
    hero: { eyebrow: "خدماتنا", title: "استشارات متكاملة لرحلة نموك في السعودية", intro: "استشارات عملية تراعي خصوصية القطاعات على امتداد دورة حياة الأعمال، من فهم السوق إلى التخطيط للنمو طويل الأجل." },
    groups: {
      enter: { title: "دخول السوق السعودي", intro: "خدمات قد تساعدك على تقييم حضورك والتخطيط له وتأسيسه." },
      grow: { title: "النمو في السوق السعودي", intro: "خدمات قد تساعدك على بناء ما أسّسته وتوسيعه وتطويره." },
    },
    journey: { eyebrow: "رحلة الاستشارة", title: "كيف تتكامل الخدمات", intro: "تُصاغ كل مهمة بحسب أهدافك. تصف هذه المراحل طريقة عمل معتادة، وقد تختلف الخدمات التي تستخدمها." },
    labels: { audience: "لمن تناسب هذه الخدمة", topics: "ما قد تغطيه", outputs: "مخرجات محتملة للمهمة", outputsNote: "بحسب المهمة، قد يشمل العمل ما يلي:", related: "خدمات ذات صلة", allServices: "جميع الخدمات" },
  },
} as const;

export const sampleServices: Record<Locale, ServicesContent> = {
  en: { review: "draft", ...home.en, items: withReview("draft", en) },
  ar: { review: "needs-professional-review", ...home.ar, items: withReview("needs-professional-review", ar) },
};
