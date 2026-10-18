import type { Locale } from "@/i18n/config";
import type { Article, InsightsContent } from "../types";

/**
 * Insights sample content. NO real article has been supplied. The three entries below use titles seen in the reference
 * screens purely to test the layout; they are "draft-preview": hidden in production unless a client changes their
 * status to "published" (or SHOW_DRAFT_PREVIEWS=1 is set for testing). Body text is placeholder only and makes no claims.
 * DRAFT Arabic: needs professional review.
 */
const placeholderEn = (title: string): Article["body"] => [
  { type: "paragraph", text: `Draft preview of "${title}". This is placeholder text for layout testing only. No article has been written or approved for this entry.` },
  { type: "heading", text: "Placeholder heading" },
  { type: "paragraph", text: "Replace this body with approved article content. The template supports headings, paragraphs and lists." },
  { type: "list", items: ["Placeholder point one", "Placeholder point two", "Placeholder point three"] },
];
const placeholderAr = (title: string): Article["body"] => [
  { type: "paragraph", text: `معاينة مسودة لمقال «${title}». هذا نص مؤقت لاختبار التصميم فقط. لم تُكتب أي مقالة لهذا العنصر ولم تُعتمد.` },
  { type: "heading", text: "عنوان مؤقت" },
  { type: "paragraph", text: "استبدل هذا النص بمحتوى المقال المعتمد. يدعم القالب العناوين والفقرات والقوائم." },
  { type: "list", items: ["نقطة مؤقتة أولى", "نقطة مؤقتة ثانية", "نقطة مؤقتة ثالثة"] },
];

const base = { status: "draft-preview" as const, author: { name: "Growth Blueprint Advisory" }, publishDate: null, heroImage: null };

export const sampleInsights: Record<Locale, InsightsContent> = {
  en: {
    review: "draft",
    editorialNotes: [
      "Categories are drafted structure; client to confirm the category list.",
      "All three articles are layout-test drafts built from reference-screen titles, not published articles.",
      "Author byline uses the company name; replace with approved author names if desired.",
    ],
    meta: { title: "Insights | Growth Blueprint Advisory", description: "Perspectives on entering and growing in Saudi Arabia." },
    hero: { eyebrow: "Insights", title: "Perspectives for a changing market", intro: "Articles on entering, establishing and growing in Saudi Arabia." },
    categories: [
      { id: "market-entry", label: "Market entry" },
      { id: "industry-perspectives", label: "Industry perspectives" },
      { id: "growth", label: "Growing in Saudi Arabia" },
    ],
    labels: {
      all: "All", filterLabel: "Filter by category", draftPreview: "Draft preview", dateTbc: "Date to be confirmed", by: "By", read: "Read article",
      related: "Related articles", back: "All insights", empty: "No insights have been published yet.", noneInCategory: "No articles in this category yet.",
    },
    articles: [
      { ...base, id: "navigating-market-entry-in-saudi-arabia", review: "draft", categoryId: "market-entry", title: "Navigating market entry in Saudi Arabia", excerpt: "Layout-test draft. Key considerations for international businesses entering the Saudi market.", body: placeholderEn("Navigating market entry in Saudi Arabia"), relatedIds: ["the-evolving-real-estate-opportunity", "hospitality-in-a-new-era"], nextStep: { title: "Evaluating Saudi Arabia?", body: "See how a market entry journey may work.", cta: { label: "Entering Saudi Arabia", target: { kind: "entering" } } } },
      { ...base, id: "the-evolving-real-estate-opportunity", review: "draft", categoryId: "industry-perspectives", title: "The evolving real estate opportunity in Saudi Arabia", excerpt: "Layout-test draft. Trends and insights shaping the Kingdom's real estate landscape.", body: placeholderEn("The evolving real estate opportunity in Saudi Arabia"), relatedIds: ["navigating-market-entry-in-saudi-arabia", "hospitality-in-a-new-era"], nextStep: { title: "Real estate organisations", body: "See how we may support organisations in this sector.", cta: { label: "Real Estate", target: { kind: "industry", slug: "real-estate" } } } },
      { ...base, id: "hospitality-in-a-new-era", review: "draft", categoryId: "industry-perspectives", title: "Hospitality in a new era", excerpt: "Layout-test draft. How Saudi Arabia's tourism transformation is creating opportunities for global operators.", body: placeholderEn("Hospitality in a new era"), relatedIds: ["the-evolving-real-estate-opportunity", "navigating-market-entry-in-saudi-arabia"], nextStep: { title: "Hospitality organisations", body: "See how we may support organisations in this sector.", cta: { label: "Hospitality", target: { kind: "industry", slug: "hospitality" } } } },
    ],
  },
  ar: {
    review: "needs-professional-review",
    editorialNotes: ["Arabic draft: requires professional review before launch.", "Same client confirmations as the English page apply."],
    meta: { title: "رؤى | Growth Blueprint Advisory", description: "رؤى حول دخول المملكة العربية السعودية والنمو فيها." },
    hero: { eyebrow: "رؤى", title: "رؤى لسوق متغيّر", intro: "مقالات حول دخول المملكة العربية السعودية وتأسيس الأعمال والنمو فيها." },
    categories: [
      { id: "market-entry", label: "دخول السوق" },
      { id: "industry-perspectives", label: "رؤى قطاعية" },
      { id: "growth", label: "النمو في السوق السعودي" },
    ],
    labels: {
      all: "الكل", filterLabel: "التصفية بحسب الفئة", draftPreview: "معاينة مسودة", dateTbc: "التاريخ قيد التأكيد", by: "بقلم", read: "اقرأ المقال",
      related: "مقالات ذات صلة", back: "جميع الرؤى", empty: "لم تُنشر أي رؤى بعد.", noneInCategory: "لا توجد مقالات في هذه الفئة بعد.",
    },
    articles: [
      { ...base, id: "navigating-market-entry-in-saudi-arabia", review: "needs-professional-review", categoryId: "market-entry", title: "التنقّل في مسار دخول السوق السعودي", excerpt: "مسودة لاختبار التصميم. اعتبارات رئيسية للشركات الدولية الراغبة في دخول السوق السعودي.", body: placeholderAr("التنقّل في مسار دخول السوق السعودي"), relatedIds: ["the-evolving-real-estate-opportunity", "hospitality-in-a-new-era"], nextStep: { title: "هل تقيّم دخول السعودية؟", body: "اطّلع على كيف قد تسير رحلة دخول السوق.", cta: { label: "دخول السوق السعودي", target: { kind: "entering" } } } },
      { ...base, id: "the-evolving-real-estate-opportunity", review: "needs-professional-review", categoryId: "industry-perspectives", title: "الفرصة العقارية المتطورة في السعودية", excerpt: "مسودة لاختبار التصميم. اتجاهات ورؤى تشكّل المشهد العقاري في المملكة.", body: placeholderAr("الفرصة العقارية المتطورة في السعودية"), relatedIds: ["navigating-market-entry-in-saudi-arabia", "hospitality-in-a-new-era"], nextStep: { title: "مؤسسات العقارات", body: "اطّلع على كيف قد ندعم المؤسسات في هذا القطاع.", cta: { label: "العقارات", target: { kind: "industry", slug: "real-estate" } } } },
      { ...base, id: "hospitality-in-a-new-era", review: "needs-professional-review", categoryId: "industry-perspectives", title: "الضيافة في حقبة جديدة", excerpt: "مسودة لاختبار التصميم. كيف يخلق التحول السياحي في السعودية فرصًا للمشغّلين العالميين.", body: placeholderAr("الضيافة في حقبة جديدة"), relatedIds: ["the-evolving-real-estate-opportunity", "navigating-market-entry-in-saudi-arabia"], nextStep: { title: "مؤسسات الضيافة", body: "اطّلع على كيف قد ندعم المؤسسات في هذا القطاع.", cta: { label: "الضيافة", target: { kind: "industry", slug: "hospitality" } } } },
    ],
  },
};
