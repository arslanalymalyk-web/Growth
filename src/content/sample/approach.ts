import type { Locale } from "@/i18n/config";
import type { ApproachContent } from "../types";

/**
 * Our Approach, drafted from the supplied approach reference (five steps and four decision gates).
 * Gate 3 wording was adapted for clarity and the "measurable progress" key output was softened to avoid implying results.
 * DRAFT Arabic: needs professional review.
 */
export const sampleApproach: Record<Locale, ApproachContent> = {
  en: {
    review: "draft",
    editorialNotes: [
      "Client to confirm decision-gate names and the key outputs listed under each gate.",
      "Gate 3 reworded from the reference ('Go / no-go to establish'); gate 4 key output softened (no implied results).",
      "Scope note (advisory role, external providers) needs client and legal-adviser review.",
      "'Points' under each step are drafted examples of what the work may involve.",
    ],
    meta: { title: "Our Approach | Growth Blueprint Advisory", description: "A structured, practical approach with decision gates to help you make informed decisions about entering and growing in Saudi Arabia." },
    hero: {
      eyebrow: "Our approach",
      title: "Our Approach",
      intro: "A structured, practical approach to help you make informed decisions about entering and growing in Saudi Arabia.",
    },
    intro: {
      eyebrow: "From insight to impact",
      title: "A clear, phased way of working",
      body: "We follow a phased approach that combines commercial insight with hands-on support. Between phases there are decision gates: points where we review the work with you, and the next stage follows once you have reviewed and agreed.",
    },
    labels: { step: "Step", points: "What this may involve", gate: "Decision gate", keyOutput: "Possible output" },
    steps: [
      { id: "assess", icon: "search", title: "Assess", summary: "Understand your ambition and the market opportunity.", points: ["Clarify your objectives", "Review the market opportunity", "Identify key questions and risks"] },
      { id: "plan", icon: "document", title: "Plan", summary: "Develop a tailored market entry or growth plan.", points: ["Shape a plan around your objectives", "Set priorities and sequencing", "Outline the resources and support that may be needed"] },
      { id: "establish", icon: "gear", title: "Establish", summary: "Set up the right structure, partners and capabilities.", points: ["Prepare structure and operations, with qualified providers where needed", "Identify partners and capabilities", "Prepare for launch"] },
      { id: "execute", icon: "users", title: "Execute", summary: "Implement with hands-on support.", points: ["Put the plan into action", "Coordinate advisers and providers", "Track progress against the plan"] },
      { id: "grow", icon: "chart", title: "Grow", summary: "Scale operations and look for long-term opportunities.", points: ["Review progress", "Consider scaling and diversification", "Plan the next phase"] },
    ],
    gates: [
      { id: "gate-1", title: "Confirm opportunity and strategic fit", body: "We review the assessment with you. Planning follows once you have reviewed and agreed.", keyOutput: "Opportunity assessment and options" },
      { id: "gate-2", title: "Agree plan and resources", body: "We review the plan with you. Establishing follows once you have reviewed and agreed.", keyOutput: "Detailed plan and roadmap" },
      { id: "gate-3", title: "Confirm readiness to establish and launch", body: "We review readiness with you and agree whether to proceed. Execution follows once you have agreed.", keyOutput: "Operational setup and launch plan" },
      { id: "gate-4", title: "Review progress and plan the next phase", body: "We review progress with you. Any next phase follows once you have reviewed and agreed.", keyOutput: "Progress review and next-phase plan" },
    ],
    services: {
      eyebrow: "Supported by our services",
      title: "How the approach is delivered",
      intro: "The approach is delivered through a range of advisory services, tailored to your needs at each stage.",
      links: [
        { label: "Entering Saudi Arabia", target: { kind: "entering" } },
        { label: "Growing in Saudi Arabia", target: { kind: "growing" } },
        { label: "All services", target: { kind: "services" } },
      ],
    },
    scope: {
      title: "Our role",
      body: "Growth Blueprint Advisory provides advisory and coordination support. We do not act as your legal representative, and regulated legal, licensing or other specialist work may involve qualified external providers. The stages and outputs above describe a typical way of working and may vary by engagement.",
    },
  },
  ar: {
    review: "needs-professional-review",
    editorialNotes: ["Arabic draft: requires professional review before launch.", "Same client confirmations as the English page apply."],
    meta: { title: "نهجنا | Growth Blueprint Advisory", description: "نهج منظّم وعملي مع بوابات قرار يساعدك على اتخاذ قرارات مستنيرة بشأن دخول المملكة العربية السعودية والنمو فيها." },
    hero: {
      eyebrow: "نهجنا",
      title: "نهجنا",
      intro: "نهج منظّم وعملي يساعدك على اتخاذ قرارات مستنيرة بشأن دخول المملكة العربية السعودية والنمو فيها.",
    },
    intro: {
      eyebrow: "من الرؤية إلى الأثر",
      title: "أسلوب عمل واضح ومرحلي",
      body: "نتّبع نهجًا مرحليًا يجمع بين الرؤية التجارية والدعم الميداني. وبين المراحل توجد بوابات قرار، وهي محطات نراجع فيها العمل معك، وتبدأ المرحلة التالية بعد أن تراجع الأمر وتوافق عليه.",
    },
    labels: { step: "الخطوة", points: "ما قد تتضمنه هذه الخطوة", gate: "بوابة قرار", keyOutput: "مخرج محتمل" },
    steps: [
      { id: "assess", icon: "search", title: "قيّم", summary: "افهم طموحك وفرصة السوق.", points: ["توضيح أهدافك", "مراجعة فرصة السوق", "تحديد الأسئلة والمخاطر الرئيسية"] },
      { id: "plan", icon: "document", title: "خطّط", summary: "ضع خطة مصمّمة لدخول السوق أو للنمو.", points: ["صياغة خطة تنطلق من أهدافك", "ترتيب الأولويات والتسلسل", "تحديد الموارد والدعم الذي قد تحتاجه"] },
      { id: "establish", icon: "gear", title: "أسّس", summary: "أنشئ الهيكل والشركاء والقدرات المناسبة.", points: ["تهيئة الهيكل والعمليات، بمشاركة مزوّدين مؤهلين عند الحاجة", "تحديد الشركاء والقدرات", "الاستعداد للإطلاق"] },
      { id: "execute", icon: "users", title: "نفّذ", summary: "طبّق الخطة بدعم ميداني.", points: ["وضع الخطة موضع التنفيذ", "التنسيق بين المستشارين والمزوّدين", "متابعة التقدّم مقارنةً بالخطة"] },
      { id: "grow", icon: "chart", title: "انمُ", summary: "وسّع عملياتك وابحث عن فرص طويلة الأجل.", points: ["مراجعة التقدّم", "النظر في التوسع والتنويع", "التخطيط للمرحلة التالية"] },
    ],
    gates: [
      { id: "gate-1", title: "تأكيد الفرصة والملاءمة الاستراتيجية", body: "نراجع التقييم معك. ويبدأ التخطيط بعد أن تراجع الأمر وتوافق عليه.", keyOutput: "تقييم الفرصة والخيارات" },
      { id: "gate-2", title: "الاتفاق على الخطة والموارد", body: "نراجع الخطة معك. وتبدأ مرحلة التأسيس بعد أن تراجع الأمر وتوافق عليه.", keyOutput: "خطة مفصّلة وخارطة طريق" },
      { id: "gate-3", title: "تأكيد الجاهزية للتأسيس والإطلاق", body: "نراجع الجاهزية معك ونتفق على المضي قدمًا من عدمه. ويبدأ التنفيذ بعد موافقتك.", keyOutput: "خطة الإعداد التشغيلي والإطلاق" },
      { id: "gate-4", title: "مراجعة التقدّم والتخطيط للمرحلة التالية", body: "نراجع التقدّم معك. وتبدأ أي مرحلة تالية بعد أن تراجع الأمر وتوافق عليه.", keyOutput: "مراجعة التقدّم وخطة المرحلة التالية" },
    ],
    services: {
      eyebrow: "مدعوم بخدماتنا",
      title: "كيف يُنفَّذ النهج",
      intro: "يُنفَّذ النهج عبر مجموعة من الخدمات الاستشارية المصمّمة بحسب احتياجاتك في كل مرحلة.",
      links: [
        { label: "دخول السوق السعودي", target: { kind: "entering" } },
        { label: "النمو في السوق السعودي", target: { kind: "growing" } },
        { label: "جميع الخدمات", target: { kind: "services" } },
      ],
    },
    scope: {
      title: "دورنا",
      body: "تقدّم Growth Blueprint Advisory دعمًا استشاريًا وتنسيقيًا. ولا نعمل بصفتنا ممثلك القانوني، وقد يتطلب العمل القانوني أو التنظيمي أو الترخيص أو غيره من الأعمال المتخصصة الاستعانة بمزوّدين خارجيين مؤهلين. وتصف المراحل والمخرجات أعلاه أسلوب عمل معتادًا وقد تختلف بحسب المهمة.",
    },
  },
};
