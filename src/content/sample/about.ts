import type { Locale } from "@/i18n/config";
import type { AboutContent } from "../types";

/**
 * About page, drafted from the supplied About reference screen only. Deliberately omitted until the client confirms:
 * the "20+ years of experience" claim, founder name/biography/qualifications, client names, results.
 * DRAFT Arabic: needs professional review.
 */
export const sampleAbout: Record<Locale, AboutContent> = {
  en: {
    review: "draft",
    editorialNotes: [
      "Client to confirm: 'founder-led Saudi consultancy' wording.",
      "Client to confirm: 'founder is personally involved in every engagement'.",
      "Client to confirm: 'network of qualified specialists' wording and how specialists are engaged.",
      "NOT used (unconfirmed): '20+ years of experience'. Add only with client confirmation.",
      "Founder photo, name and biography not supplied; placeholder in use.",
    ],
    meta: { title: "About Us | Growth Blueprint Advisory", description: "Growth Blueprint Advisory is a founder-led Saudi consultancy offering practical advice and coordinated support." },
    hero: {
      eyebrow: "About us",
      title: "About Us",
      intro: "A founder-led Saudi consultancy, focused on positioning, purpose and principles, with practical advice and coordinated support.",
    },
    founder: {
      eyebrow: "Founder-led",
      title: "A personal commitment to meaningful impact",
      paragraphs: [
        "Growth Blueprint Advisory is a founder-led Saudi consultancy.",
        "We work closely with organisations to clarify positioning, strengthen purpose and put enduring principles into practice.",
        "Our founder is personally involved in every engagement, providing practical advice, coordinated support and candid perspectives to help clients navigate complexity and pursue their ambitions.",
      ],
    },
    principles: {
      eyebrow: "Our principles",
      title: "Guided by enduring principles",
      intro: "Our work is shaped by a clear set of principles that define how we advise, support and collaborate with our clients.",
      items: [
        { id: "personal-involvement", icon: "person", title: "Personal Involvement", body: "Our founder is personally involved in every engagement." },
        { id: "practical-advice", icon: "document", title: "Practical Advice", body: "We provide clear, practical and actionable advice." },
        { id: "coordinated-support", icon: "users", title: "Coordinated Support", body: "We bring together qualified specialists to provide coordinated support." },
        { id: "candour", icon: "chat", title: "Candour", body: "We offer honest perspectives to help clients make informed decisions." },
      ],
    },
    specialists: {
      eyebrow: "Qualified specialists",
      title: "Bringing together the right expertise",
      paragraphs: [
        "We coordinate a network of qualified specialists, bringing together the right expertise for each engagement.",
        "This flexible and collaborative approach is designed to give clients focused support tailored to their specific needs.",
      ],
    },
  },
  ar: {
    review: "needs-professional-review",
    editorialNotes: [
      "Arabic draft: requires professional review before launch.",
      "Same client confirmations as the English page apply.",
    ],
    meta: { title: "من نحن | Growth Blueprint Advisory", description: "Growth Blueprint Advisory شركة استشارات سعودية يقودها مؤسسها، تقدّم مشورة عملية ودعمًا منسّقًا." },
    hero: {
      eyebrow: "من نحن",
      title: "من نحن",
      intro: "شركة استشارات سعودية يقودها مؤسسها، تركّز على التموضع والغاية والمبادئ، وتقدّم مشورة عملية ودعمًا منسّقًا.",
    },
    founder: {
      eyebrow: "يقودها المؤسس",
      title: "التزام شخصي بأثر ذي معنى",
      paragraphs: [
        "Growth Blueprint Advisory شركة استشارات سعودية يقودها مؤسسها.",
        "نعمل بصورة وثيقة مع المؤسسات لتوضيح التموضع وتعزيز الغاية وتطبيق المبادئ الراسخة عمليًا.",
        "يشارك مؤسسنا شخصيًا في كل مهمة، مقدّمًا مشورة عملية ودعمًا منسّقًا ورؤى صريحة لمساعدة العملاء على تجاوز التعقيد والسعي نحو طموحاتهم.",
      ],
    },
    principles: {
      eyebrow: "مبادئنا",
      title: "نسترشد بمبادئ راسخة",
      intro: "يتشكّل عملنا وفق مجموعة واضحة من المبادئ التي تحدد كيف نقدّم المشورة والدعم ونتعاون مع عملائنا.",
      items: [
        { id: "personal-involvement", icon: "person", title: "المشاركة الشخصية", body: "يشارك مؤسسنا شخصيًا في كل مهمة." },
        { id: "practical-advice", icon: "document", title: "المشورة العملية", body: "نقدّم مشورة واضحة وعملية وقابلة للتنفيذ." },
        { id: "coordinated-support", icon: "users", title: "الدعم المنسّق", body: "نجمع متخصصين مؤهلين لتقديم دعم منسّق." },
        { id: "candour", icon: "chat", title: "الصراحة", body: "نقدّم رؤى صادقة تساعد العملاء على اتخاذ قرارات مستنيرة." },
      ],
    },
    specialists: {
      eyebrow: "متخصصون مؤهلون",
      title: "نجمع الخبرة المناسبة",
      paragraphs: [
        "ننسّق شبكة من المتخصصين المؤهلين، ونجمع الخبرة المناسبة لكل مهمة.",
        "يهدف هذا النهج المرن والتعاوني إلى تقديم دعم مركّز للعملاء يلبي احتياجاتهم المحددة.",
      ],
    },
  },
};
