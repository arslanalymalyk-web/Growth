import type { Locale } from "@/i18n/config";
import type { HomeContent } from "../types";

/**
 * Local sample content, written only from the supplied Growth Blueprint reference screens.
 * It contains no testimonials, statistics, credentials, client names or founder details.
 * Insight titles come from the reference mock-up and are shown as "Sample" until the client supplies articles.
 * DRAFT Arabic: needs professional review by the client.
 */
export const sampleHome: Record<Locale, HomeContent> = {
  en: {
    meta: {
      title: "Growth Blueprint Advisory | Strategic advisory for Saudi Arabia",
      description:
        "Strategic advisory for ambitious businesses to enter, establish and grow in Saudi Arabia.",
    },
    hero: {
      eyebrow: "Saudi Arabia. Greater possibilities.",
      headline: "Your Growth Blueprint for Saudi Arabia",
      subheadline:
        "Strategic advisory for ambitious businesses to enter, establish and grow in one of the world's most dynamic markets.",
      primaryCtaLabel: "Book a Consultation",
      secondaryCtaLabel: "Explore Our Services",
    },
    pathways: [
      {
        id: "enter",
        icon: "door",
        title: "Enter Saudi Arabia",
        body: "Navigate with confidence. Turn opportunity into a successful market entry.",
        linkLabel: "Explore entry support",
      },
      {
        id: "grow",
        icon: "chart",
        title: "Grow in Saudi Arabia",
        body: "Scale with purpose. Build a stronger, more resilient presence.",
        linkLabel: "Explore growth support",
      },
    ],
    services: {
      eyebrow: "Our services",
      title: "End-to-end advisory for your Saudi growth journey",
      intro:
        "Practical, sector-aware advisory across the full business lifecycle, from market understanding to long-term scale.",
      items: [
        { id: "market-entry-advisory", icon: "search", title: "Market Entry Advisory", description: "Strategy, market analysis and route-to-market planning." },
        { id: "regulatory-licensing-support", icon: "document", title: "Regulatory & Licensing Support", description: "Guidance through regulatory requirements and licensing processes." },
        { id: "local-partner-identification", icon: "network", title: "Local Partner Identification", description: "Support in identifying and assessing potential local partners." },
        { id: "business-setup-support", icon: "gear", title: "Business Setup Support", description: "Assistance with company setup and operational readiness." },
        { id: "go-to-market-strategy", icon: "users", title: "Go-to-Market Strategy", description: "Tailored commercial strategies for sustainable growth." },
        { id: "operational-setup-advisory", icon: "chart", title: "Operational Setup Advisory", description: "Support in building efficient operations and local capabilities." },
        { id: "talent-organisation-advisory", icon: "leaf", title: "Talent & Organisation Advisory", description: "Guidance on talent, structure and organisational readiness." },
        { id: "ongoing-growth-advisory", icon: "nodes", title: "Ongoing Growth Advisory", description: "Continued support to scale, diversify and capture new opportunities." },
      ],
    },
    industries: {
      eyebrow: "Our industries",
      title: "Focused on key sectors shaping Saudi Arabia's future",
      intro: "Deep sector understanding. Practical guidance.",
      items: [
        { id: "fmcg-consumer-brands", title: "FMCG" },
        { id: "real-estate", title: "Real Estate" },
        { id: "hospitality", title: "Hospitality" },
        { id: "industry-manufacturing", title: "Manufacturing" },
      ],
    },
    approach: {
      eyebrow: "Our approach",
      title: "A clear path from insight to impact",
      intro: "A structured, practical approach to help you enter, establish and grow in Saudi Arabia.",
      steps: [
        { id: "assess", icon: "search", title: "Assess", description: "Understand your objectives and the Saudi market opportunity." },
        { id: "plan", icon: "document", title: "Plan", description: "Develop a tailored strategy and roadmap." },
        { id: "establish", icon: "gear", title: "Establish", description: "Set up your business, operations and local capabilities." },
        { id: "execute", icon: "users", title: "Execute", description: "Implement with focus and support." },
        { id: "grow", icon: "chart", title: "Grow", description: "Scale, diversify and unlock long-term opportunities." },
      ],
    },
    founder: {
      eyebrow: "Founder-led advisory",
      title: "A personal commitment to your success",
      body: "Growth Blueprint Advisory was founded with a clear purpose: to help ambitious businesses realise the immense opportunities in Saudi Arabia through practical, honest and hands-on advisory.",
    },
    insights: {
      eyebrow: "Latest insights",
      title: "Perspectives for a changing market",
      intro: "",
      items: [
        { id: "market-entry", title: "Navigating market entry in Saudi Arabia", excerpt: "Key considerations for international businesses entering the Saudi market.", isSample: true },
        { id: "real-estate", title: "The evolving real estate opportunity in Saudi Arabia", excerpt: "Trends and insights shaping the Kingdom's real estate landscape.", isSample: true },
        { id: "hospitality", title: "Hospitality in a new era", excerpt: "How Saudi Arabia's tourism transformation is creating opportunities for global operators.", isSample: true },
      ],
    },
    scorecard: {
      eyebrow: "Saudi Readiness Scorecard",
      title: "Are you ready for Saudi Arabia?",
      body: "A scorecard of about 10 minutes to assess your readiness for market entry or expansion in Saudi Arabia, with a tailored readiness report.",
      ctaLabel: "Take the Saudi Readiness Scorecard",
    },
    consultation: {
      eyebrow: "Let's talk",
      title: "Book a consultation",
      body: "Discuss your ambitions, ask your questions, and explore how we can support your Saudi growth journey.",
      ctaLabel: "Book a Consultation",
    },
  },
  ar: {
    meta: {
      title: "Growth Blueprint Advisory | استشارات استراتيجية للمملكة العربية السعودية",
      description:
        "استشارات استراتيجية للشركات الطموحة للدخول والتأسيس والنمو في المملكة العربية السعودية.",
    },
    hero: {
      eyebrow: "المملكة العربية السعودية. آفاق أرحب.",
      headline: "مخطّطك للنمو في المملكة العربية السعودية",
      subheadline:
        "استشارات استراتيجية للشركات الطموحة للدخول والتأسيس والنمو في أحد أكثر الأسواق ديناميكية في العالم.",
      primaryCtaLabel: "احجز استشارة",
      secondaryCtaLabel: "استكشف خدماتنا",
    },
    pathways: [
      {
        id: "enter",
        icon: "door",
        title: "ادخل السوق السعودي",
        body: "تقدّم بثقة. حوّل الفرصة إلى دخول ناجح إلى السوق.",
        linkLabel: "استكشف دعم الدخول",
      },
      {
        id: "grow",
        icon: "chart",
        title: "انمُ في السوق السعودي",
        body: "وسّع أعمالك بهدف واضح. ابنِ حضورًا أقوى وأكثر مرونة.",
        linkLabel: "استكشف دعم النمو",
      },
    ],
    services: {
      eyebrow: "خدماتنا",
      title: "استشارات متكاملة لرحلة نموك في السعودية",
      intro: "استشارات عملية تراعي خصوصية القطاعات على امتداد دورة حياة الأعمال، من فهم السوق إلى التوسع طويل الأجل.",
      items: [
        { id: "market-entry-advisory", icon: "search", title: "استشارات دخول السوق", description: "الاستراتيجية وتحليل السوق وتخطيط منافذ الوصول إلى السوق." },
        { id: "regulatory-licensing-support", icon: "document", title: "الدعم التنظيمي والترخيص", description: "إرشاد خلال المتطلبات التنظيمية وإجراءات الترخيص." },
        { id: "local-partner-identification", icon: "network", title: "تحديد الشركاء المحليين", description: "دعم في تحديد الشركاء المحليين المحتملين وتقييمهم." },
        { id: "business-setup-support", icon: "gear", title: "دعم تأسيس الأعمال", description: "مساندة في تأسيس الشركة والجاهزية التشغيلية." },
        { id: "go-to-market-strategy", icon: "users", title: "استراتيجية الوصول إلى السوق", description: "استراتيجيات تجارية مصمّمة لنمو مستدام." },
        { id: "operational-setup-advisory", icon: "chart", title: "استشارات الإعداد التشغيلي", description: "دعم في بناء عمليات كفؤة وقدرات محلية." },
        { id: "talent-organisation-advisory", icon: "leaf", title: "استشارات المواهب والمنظمة", description: "إرشاد بشأن المواهب والهيكل التنظيمي والجاهزية المؤسسية." },
        { id: "ongoing-growth-advisory", icon: "nodes", title: "استشارات النمو المستمر", description: "دعم متواصل للتوسع والتنويع واقتناص فرص جديدة." },
      ],
    },
    industries: {
      eyebrow: "قطاعاتنا",
      title: "تركيز على القطاعات الرئيسية التي تشكّل مستقبل السعودية",
      intro: "فهم عميق للقطاعات. إرشاد عملي.",
      items: [
        { id: "fmcg-consumer-brands", title: "السلع الاستهلاكية سريعة الحركة" },
        { id: "real-estate", title: "العقارات" },
        { id: "hospitality", title: "الضيافة" },
        { id: "industry-manufacturing", title: "التصنيع" },
      ],
    },
    approach: {
      eyebrow: "نهجنا",
      title: "مسار واضح من الرؤية إلى الأثر",
      intro: "نهج منظّم وعملي لمساعدتك على الدخول والتأسيس والنمو في السعودية.",
      steps: [
        { id: "assess", icon: "search", title: "قيّم", description: "افهم أهدافك وفرصة السوق السعودي." },
        { id: "plan", icon: "document", title: "خطّط", description: "ضع استراتيجية وخارطة طريق مصمّمة لك." },
        { id: "establish", icon: "gear", title: "أسّس", description: "أنشئ عملك وعملياتك وقدراتك المحلية." },
        { id: "execute", icon: "users", title: "نفّذ", description: "طبّق بتركيز ودعم." },
        { id: "grow", icon: "chart", title: "انمُ", description: "وسّع نطاقك ونوّع أعمالك واكتشف فرصًا طويلة الأجل." },
      ],
    },
    founder: {
      eyebrow: "استشارات يقودها المؤسس",
      title: "التزام شخصي بنجاحك",
      body: "تأسست Growth Blueprint Advisory بهدف واضح: مساعدة الشركات الطموحة على تحقيق الفرص الكبيرة في المملكة العربية السعودية عبر استشارات عملية وصريحة وميدانية.",
    },
    insights: {
      eyebrow: "أحدث الرؤى",
      title: "رؤى لسوق متغيّر",
      intro: "",
      items: [
        { id: "market-entry", title: "التنقّل في مسار دخول السوق السعودي", excerpt: "اعتبارات رئيسية للشركات الدولية الراغبة في دخول السوق السعودي.", isSample: true },
        { id: "real-estate", title: "الفرصة العقارية المتطورة في السعودية", excerpt: "اتجاهات ورؤى تشكّل المشهد العقاري في المملكة.", isSample: true },
        { id: "hospitality", title: "الضيافة في حقبة جديدة", excerpt: "كيف يخلق التحول السياحي في السعودية فرصًا للمشغّلين العالميين.", isSample: true },
      ],
    },
    scorecard: {
      eyebrow: "بطاقة تقييم الجاهزية",
      title: "هل أنت جاهز للسوق السعودي؟",
      body: "بطاقة تقييم مدتها نحو 10 دقائق لقياس جاهزيتك لدخول السوق السعودي أو التوسع فيه، مع تقرير جاهزية مخصص.",
      ctaLabel: "ابدأ بطاقة تقييم الجاهزية للسوق السعودي",
    },
    consultation: {
      eyebrow: "لنتحدث",
      title: "احجز استشارة",
      body: "ناقش طموحاتك واطرح أسئلتك واستكشف كيف يمكننا دعم رحلة نموك في السعودية.",
      ctaLabel: "احجز استشارة",
    },
  },
};
