import type { Locale } from "@/i18n/config";
import type { JourneyContent, JourneyId } from "../types";

/**
 * "Entering" and "Growing in Saudi Arabia" journeys. Drafted from the supplied page concepts. They describe how advisory
 * support may help; they make no claims about market outcomes, track record, regulatory approvals or legal representation.
 * DRAFT Arabic: needs professional review.
 */
const book = { label: "Book a Consultation", target: { kind: "booking" } } as const;

export const sampleJourneys: Record<Locale, Record<JourneyId, JourneyContent>> = {
  en: {
    entering: {
      review: "draft",
      editorialNotes: [
        "Journey stages and 'what this may involve' points are drafted; client to confirm.",
        "Scope note about external providers and legal representation needs client / legal-adviser review.",
        "Hero tagline softened from the reference ('clear and achievable') to avoid implying an outcome.",
      ],
      meta: { title: "Entering Saudi Arabia | Growth Blueprint Advisory", description: "A clear journey for businesses evaluating or preparing to enter Saudi Arabia." },
      hero: { eyebrow: "Enter Saudi Arabia", title: "Entering Saudi Arabia", intro: "Turning opportunity into a clear market entry plan, with practical support at each stage." },
      audience: {
        title: "Who this journey is for",
        items: ["Businesses evaluating whether to enter Saudi Arabia", "Organisations that have decided to enter and are preparing", "Teams that want a structured view of the steps involved"],
      },
      stagesHeading: { eyebrow: "The journey", title: "From evaluation to a decision on next steps", intro: "Five areas that businesses typically work through. Your own journey may differ in order and depth." },
      labels: { stage: "Stage", points: "What this may involve" },
      stages: [
        { id: "understand", icon: "search", title: "Understand the opportunity", summary: "Build a clear picture of the Saudi market and where your business may fit.", points: ["Review the market and customer landscape", "Consider where your offer may fit", "Identify early questions and risks"], links: [{ label: "Market Entry Advisory", target: { kind: "service", slug: "market-entry-advisory" } }] },
        { id: "readiness", icon: "check", title: "Assess readiness", summary: "Take stock of how prepared your organisation is to enter.", points: ["Review your resources, capabilities and appetite", "Identify gaps to address before entry", "Prepare your questions for discussion"], links: [{ label: "Saudi Readiness Scorecard", target: { kind: "scorecard" } }] },
        { id: "plan", icon: "document", title: "Plan entry", summary: "Shape an entry route, sequence and plan.", points: ["Compare entry route options", "Set priorities and phasing", "Outline the support and resources that may be needed"], links: [{ label: "Market Entry Advisory", target: { kind: "service", slug: "market-entry-advisory" } }, { label: "Go-to-Market Strategy", target: { kind: "service", slug: "go-to-market-strategy" } }] },
        { id: "setup", icon: "gear", title: "Coordinate setup support", summary: "Organise the practical steps of establishing a presence.", points: ["Coordinate advisers and service providers", "Consider regulatory and licensing steps with qualified providers", "Consider potential local partners"], links: [{ label: "Regulatory & Licensing Support", target: { kind: "service", slug: "regulatory-licensing-support" } }, { label: "Local Partner Identification", target: { kind: "service", slug: "local-partner-identification" } }, { label: "Business Setup Support", target: { kind: "service", slug: "business-setup-support" } }] },
        { id: "decide", icon: "flag", title: "Decide next steps", summary: "Review what you have learned and agree what to do next.", points: ["Review findings with your team", "Decide whether and how to proceed", "Agree next actions and responsibilities"], links: [book] },
      ],
      scope: { title: "Specialist and regulated work", body: "Regulated legal, licensing, tax or other specialist work may involve qualified external providers. Growth Blueprint Advisory can help coordinate this work but does not act as your legal representative." },
      related: { title: "Related services", serviceIds: ["market-entry-advisory", "regulatory-licensing-support", "local-partner-identification", "business-setup-support"] },
      cta: { eyebrow: "Let's talk", title: "Ready to explore your opportunity?", body: "Book a consultation to discuss your market entry plans in Saudi Arabia.", ctaLabel: "Book a Consultation" },
    },
    growing: {
      review: "draft",
      editorialNotes: [
        "Journey areas and points are drafted; client to confirm.",
        "No track-record or market-outcome claims are included; keep it that way unless the client supplies approved evidence.",
      ],
      meta: { title: "Growing in Saudi Arabia | Growth Blueprint Advisory", description: "A journey for businesses already operating in Saudi Arabia, or looking to expand." },
      hero: { eyebrow: "Grow in Saudi Arabia", title: "Growing in Saudi Arabia", intro: "Building on your foundation, with practical support for the next stage of your growth." },
      audience: {
        title: "Who this journey is for",
        items: ["Businesses already operating in Saudi Arabia", "Leaders planning the next phase of growth", "Organisations looking to expand into new segments or regions"],
      },
      stagesHeading: { eyebrow: "Areas of focus", title: "Where advisory support may help you grow", intro: "Five areas that growing businesses often consider. Which ones matter most depends on your situation." },
      labels: { stage: "Area", points: "What this may involve" },
      stages: [
        { id: "priorities", icon: "flag", title: "Growth priorities", summary: "Clarify where to focus your next stage of growth.", points: ["Review your current position", "Compare growth options", "Set priorities"], links: [{ label: "Ongoing Growth Advisory", target: { kind: "service", slug: "ongoing-growth-advisory" } }] },
        { id: "operations", icon: "gear", title: "Operational readiness", summary: "Check whether your operations and people can support growth.", points: ["Review operating model and capacity", "Consider talent and organisation needs", "Identify capability gaps"], links: [{ label: "Operational Setup Advisory", target: { kind: "service", slug: "operational-setup-advisory" } }, { label: "Talent & Organisation Advisory", target: { kind: "service", slug: "talent-organisation-advisory" } }] },
        { id: "relationships", icon: "network", title: "Local relationships", summary: "Develop the partners and relationships that may support growth.", points: ["Consider new partners, distributors or collaborators", "Assess fit and capability", "Plan how to engage"], links: [{ label: "Local Partner Identification", target: { kind: "service", slug: "local-partner-identification" } }] },
        { id: "gtm", icon: "users", title: "Go-to-market planning", summary: "Plan how to reach new segments, channels or regions.", points: ["Review target segments", "Consider channels and positioning", "Sequence launches"], links: [{ label: "Go-to-Market Strategy", target: { kind: "service", slug: "go-to-market-strategy" } }] },
        { id: "ongoing", icon: "nodes", title: "Ongoing advisory support", summary: "Keep an independent sounding board as plans develop.", points: ["Periodic progress reviews", "Adjust priorities as conditions change", "Consider diversification and new opportunities"], links: [{ label: "Ongoing Growth Advisory", target: { kind: "service", slug: "ongoing-growth-advisory" } }] },
      ],
      scope: { title: "A note on outcomes", body: "Growth depends on your business and on market conditions. This page describes areas where advisory support may help; it does not predict or promise results." },
      related: { title: "Related services", serviceIds: ["go-to-market-strategy", "operational-setup-advisory", "talent-organisation-advisory", "ongoing-growth-advisory"] },
      cta: { eyebrow: "Let's talk", title: "Plan your next stage of growth", body: "Book a consultation to discuss how we can support your expansion plans in Saudi Arabia.", ctaLabel: "Book a Consultation" },
    },
  },
  ar: {
    entering: {
      review: "needs-professional-review",
      editorialNotes: ["Arabic draft: requires professional review before launch.", "Same client confirmations as the English page apply."],
      meta: { title: "دخول السوق السعودي | Growth Blueprint Advisory", description: "رحلة واضحة للشركات التي تقيّم دخول المملكة العربية السعودية أو تستعد له." },
      hero: { eyebrow: "ادخل السوق السعودي", title: "دخول السوق السعودي", intro: "نحوّل الفرصة إلى خطة واضحة لدخول السوق، بدعم عملي في كل مرحلة." },
      audience: {
        title: "لمن تناسب هذه الرحلة",
        items: ["شركات تقيّم دخول المملكة العربية السعودية", "مؤسسات قرّرت الدخول وتستعد له", "فرق ترغب في رؤية منظمة للخطوات المعنية"],
      },
      stagesHeading: { eyebrow: "الرحلة", title: "من التقييم إلى قرار الخطوات التالية", intro: "خمسة مجالات تعمل عليها الشركات عادةً. وقد تختلف رحلتك في الترتيب والعمق." },
      labels: { stage: "المرحلة", points: "ما قد تتضمنه هذه المرحلة" },
      stages: [
        { id: "understand", icon: "search", title: "فهم الفرصة", summary: "كوّن صورة واضحة عن السوق السعودي وأين قد يناسب عملك.", points: ["مراجعة مشهد السوق والعملاء", "النظر في موقع عرضك المحتمل", "تحديد الأسئلة والمخاطر المبكرة"], links: [{ label: "استشارات دخول السوق", target: { kind: "service", slug: "market-entry-advisory" } }] },
        { id: "readiness", icon: "check", title: "تقييم الجاهزية", summary: "قيّم مدى استعداد مؤسستك للدخول.", points: ["مراجعة مواردك وقدراتك ومدى استعدادك", "تحديد الفجوات التي ينبغي معالجتها قبل الدخول", "تجهيز أسئلتك للنقاش"], links: [{ label: "بطاقة تقييم الجاهزية للسوق السعودي", target: { kind: "scorecard" } }] },
        { id: "plan", icon: "document", title: "التخطيط للدخول", summary: "صُغ مسار الدخول وتسلسله وخطته.", points: ["مقارنة خيارات مسار الدخول", "ترتيب الأولويات والمراحل", "تحديد الدعم والموارد التي قد تحتاجها"], links: [{ label: "استشارات دخول السوق", target: { kind: "service", slug: "market-entry-advisory" } }, { label: "استراتيجية الوصول إلى السوق", target: { kind: "service", slug: "go-to-market-strategy" } }] },
        { id: "setup", icon: "gear", title: "تنسيق دعم التأسيس", summary: "نظّم الخطوات العملية لتأسيس الحضور.", points: ["التنسيق بين المستشارين ومزوّدي الخدمات", "النظر في الخطوات التنظيمية وخطوات الترخيص مع مزوّدين مؤهلين", "النظر في الشركاء المحليين المحتملين"], links: [{ label: "الدعم التنظيمي والترخيص", target: { kind: "service", slug: "regulatory-licensing-support" } }, { label: "تحديد الشركاء المحليين", target: { kind: "service", slug: "local-partner-identification" } }, { label: "دعم تأسيس الأعمال", target: { kind: "service", slug: "business-setup-support" } }] },
        { id: "decide", icon: "flag", title: "تحديد الخطوات التالية", summary: "راجع ما توصلت إليه واتفق على ما سيأتي بعد ذلك.", points: ["مراجعة النتائج مع فريقك", "تقرير ما إذا كنت ستمضي قدمًا وكيف", "الاتفاق على الإجراءات التالية والمسؤوليات"], links: [{ label: "احجز استشارة", target: { kind: "booking" } }] },
      ],
      scope: { title: "الأعمال المتخصصة والخاضعة للتنظيم", body: "قد يتطلب العمل القانوني أو التنظيمي أو الترخيص أو الضريبي أو غيره من الأعمال المتخصصة الاستعانة بمزوّدين خارجيين مؤهلين. وتستطيع Growth Blueprint Advisory المساعدة في تنسيق هذا العمل، ولا تعمل بصفتها ممثلك القانوني." },
      related: { title: "خدمات ذات صلة", serviceIds: ["market-entry-advisory", "regulatory-licensing-support", "local-partner-identification", "business-setup-support"] },
      cta: { eyebrow: "لنتحدث", title: "هل أنت مستعد لاستكشاف فرصتك؟", body: "احجز استشارة لمناقشة خططك لدخول السوق في المملكة العربية السعودية.", ctaLabel: "احجز استشارة" },
    },
    growing: {
      review: "needs-professional-review",
      editorialNotes: ["Arabic draft: requires professional review before launch.", "Same client confirmations as the English page apply."],
      meta: { title: "النمو في السوق السعودي | Growth Blueprint Advisory", description: "رحلة للشركات التي تعمل بالفعل في المملكة العربية السعودية أو تسعى إلى التوسع." },
      hero: { eyebrow: "انمُ في السوق السعودي", title: "النمو في السوق السعودي", intro: "نبني على ما أسّسته، بدعم عملي للمرحلة التالية من نموك." },
      audience: {
        title: "لمن تناسب هذه الرحلة",
        items: ["شركات تعمل بالفعل في المملكة العربية السعودية", "قيادات تخطط للمرحلة التالية من النمو", "مؤسسات تسعى إلى التوسع في شرائح أو مناطق جديدة"],
      },
      stagesHeading: { eyebrow: "مجالات التركيز", title: "أين قد يساعدك الدعم الاستشاري على النمو", intro: "خمسة مجالات تنظر فيها الشركات النامية عادةً. وتعتمد أهمية كل منها على وضعك." },
      labels: { stage: "المجال", points: "ما قد يتضمنه هذا المجال" },
      stages: [
        { id: "priorities", icon: "flag", title: "أولويات النمو", summary: "حدّد أين تركّز في المرحلة التالية من نموك.", points: ["مراجعة وضعك الحالي", "مقارنة خيارات النمو", "ترتيب الأولويات"], links: [{ label: "استشارات النمو المستمر", target: { kind: "service", slug: "ongoing-growth-advisory" } }] },
        { id: "operations", icon: "gear", title: "الجاهزية التشغيلية", summary: "تحقّق من قدرة عملياتك وكوادرك على دعم النمو.", points: ["مراجعة النموذج التشغيلي والطاقة الاستيعابية", "النظر في احتياجات المواهب والمنظمة", "تحديد فجوات القدرات"], links: [{ label: "استشارات الإعداد التشغيلي", target: { kind: "service", slug: "operational-setup-advisory" } }, { label: "استشارات المواهب والمنظمة", target: { kind: "service", slug: "talent-organisation-advisory" } }] },
        { id: "relationships", icon: "network", title: "العلاقات المحلية", summary: "طوّر الشراكات والعلاقات التي قد تدعم نموك.", points: ["النظر في شركاء أو موزّعين أو متعاونين جدد", "تقييم الملاءمة والقدرات", "التخطيط لكيفية التواصل"], links: [{ label: "تحديد الشركاء المحليين", target: { kind: "service", slug: "local-partner-identification" } }] },
        { id: "gtm", icon: "users", title: "التخطيط للوصول إلى السوق", summary: "خطّط لكيفية الوصول إلى شرائح أو قنوات أو مناطق جديدة.", points: ["مراجعة الشرائح المستهدفة", "النظر في القنوات والتموضع", "ترتيب مراحل الإطلاق"], links: [{ label: "استراتيجية الوصول إلى السوق", target: { kind: "service", slug: "go-to-market-strategy" } }] },
        { id: "ongoing", icon: "nodes", title: "الدعم الاستشاري المتواصل", summary: "احتفظ بطرف مستقل تتشاور معه مع تطوّر خططك.", points: ["مراجعات دورية للتقدّم", "تعديل الأولويات مع تغيّر الظروف", "النظر في التنويع والفرص الجديدة"], links: [{ label: "استشارات النمو المستمر", target: { kind: "service", slug: "ongoing-growth-advisory" } }] },
      ],
      scope: { title: "ملاحظة بشأن النتائج", body: "يعتمد النمو على عملك وعلى ظروف السوق. تصف هذه الصفحة مجالات قد يساعد فيها الدعم الاستشاري، ولا تتنبأ بالنتائج ولا تعد بها." },
      related: { title: "خدمات ذات صلة", serviceIds: ["go-to-market-strategy", "operational-setup-advisory", "talent-organisation-advisory", "ongoing-growth-advisory"] },
      cta: { eyebrow: "لنتحدث", title: "خطّط للمرحلة التالية من نموك", body: "احجز استشارة لمناقشة كيف يمكننا دعم خطط توسعك في المملكة العربية السعودية.", ctaLabel: "احجز استشارة" },
    },
  },
};
