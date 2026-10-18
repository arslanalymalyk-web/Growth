import type { Locale } from "@/i18n/config";
import type { LegalUi } from "../types";

/**
 * Privacy and Terms page SHELLS. They contain NO legal wording and make NO compliance claim (including PDPL). The
 * outlines below only list TOPICS a legal adviser would be expected to confirm; every section is marked as pending
 * review by Growth Blueprint's legal adviser. The client must supply the approved text. DRAFT Arabic: needs professional review.
 */
export const sampleLegalUi: Record<Locale, LegalUi> = {
  en: {
    privacy: {
      review: "draft",
      meta: { title: "Privacy Notice | Growth Blueprint Advisory", description: "Privacy notice (draft shell, pending legal review)." },
      hero: { eyebrow: "Legal", title: "Privacy Notice", intro: "This page is a placeholder for Growth Blueprint Advisory's privacy notice." },
      crumb: "Privacy Notice",
      status: { badge: "Draft shell", title: "Approved text pending legal review", body: "No approved privacy wording has been supplied. This page does not describe how personal data is handled and must not be relied on. It will be completed once Growth Blueprint's legal adviser has provided and approved the text." },
      outline: {
        title: "Topics the legal adviser is expected to cover", note: "Outline only. These are proposed headings, not legal text, and the legal adviser may change them.", pending: "Text pending review by Growth Blueprint's legal adviser.",
        sections: [
          { id: "controller", title: "Who is responsible for personal data" },
          { id: "data", title: "What personal data is collected and why" },
          { id: "consent", title: "How consent is given and withdrawn" },
          { id: "sharing", title: "Who data is shared with" },
          { id: "retention", title: "How long data is kept" },
          { id: "rights", title: "Rights and how to exercise them" },
          { id: "cookies", title: "Cookies and similar technologies" },
          { id: "contact", title: "How to contact us about privacy" },
        ],
      },
      related: [{ label: "Terms", target: "terms" }],
      contact: { title: "Questions", body: "Online enquiries are not open yet.", cta: "Book a Consultation" },
    },
    terms: {
      review: "draft",
      meta: { title: "Terms | Growth Blueprint Advisory", description: "Terms (draft shell, pending legal review)." },
      hero: { eyebrow: "Legal", title: "Terms", intro: "This page is a placeholder for Growth Blueprint Advisory's terms." },
      crumb: "Terms",
      status: { badge: "Draft shell", title: "Approved text pending legal review", body: "No approved terms have been supplied. This page does not set out any terms and must not be relied on. It will be completed once Growth Blueprint's legal adviser has provided and approved the text." },
      outline: {
        title: "Topics the legal adviser is expected to cover", note: "Outline only. These are proposed headings, not legal text, and the legal adviser may change them.", pending: "Text pending review by Growth Blueprint's legal adviser.",
        sections: [
          { id: "use", title: "Use of this website" },
          { id: "bookings", title: "Consultation bookings and cancellations" },
          { id: "briefs", title: "Sector briefs: licence and refunds" },
          { id: "ip", title: "Intellectual property" },
          { id: "liability", title: "Limits of liability" },
          { id: "law", title: "Governing law and disputes" },
          { id: "changes", title: "Changes to these terms" },
        ],
      },
      related: [{ label: "Privacy Notice", target: "privacy" }],
      contact: { title: "Questions", body: "Online enquiries are not open yet.", cta: "Book a Consultation" },
    },
  },
  ar: {
    privacy: {
      review: "needs-professional-review",
      meta: { title: "إشعار الخصوصية | Growth Blueprint Advisory", description: "إشعار الخصوصية (هيكل مسودة بانتظار المراجعة القانونية)." },
      hero: { eyebrow: "قانوني", title: "إشعار الخصوصية", intro: "هذه الصفحة مكان مخصص لإشعار الخصوصية الخاص بـ Growth Blueprint Advisory." },
      crumb: "إشعار الخصوصية",
      status: { badge: "هيكل مسودة", title: "النص المعتمد بانتظار المراجعة القانونية", body: "لم تُقدَّم أي صياغة معتمدة للخصوصية. لا تصف هذه الصفحة كيفية التعامل مع البيانات الشخصية ولا ينبغي الاعتماد عليها. وسيُستكمل المحتوى بعد أن يقدّم المستشار القانوني لـ Growth Blueprint النص ويعتمده." },
      outline: {
        title: "موضوعات يُتوقع أن يغطيها المستشار القانوني", note: "مخطط عام فقط. هذه عناوين مقترحة وليست نصًا قانونيًا، وللمستشار القانوني تعديلها.", pending: "النص بانتظار مراجعة المستشار القانوني لـ Growth Blueprint.",
        sections: [
          { id: "controller", title: "الجهة المسؤولة عن البيانات الشخصية" },
          { id: "data", title: "البيانات الشخصية التي تُجمع ولماذا" },
          { id: "consent", title: "كيفية إعطاء الموافقة وسحبها" },
          { id: "sharing", title: "الجهات التي تُشارَك معها البيانات" },
          { id: "retention", title: "مدة الاحتفاظ بالبيانات" },
          { id: "rights", title: "الحقوق وكيفية ممارستها" },
          { id: "cookies", title: "ملفات تعريف الارتباط والتقنيات المماثلة" },
          { id: "contact", title: "كيفية التواصل معنا بشأن الخصوصية" },
        ],
      },
      related: [{ label: "الشروط", target: "terms" }],
      contact: { title: "أسئلة", body: "الاستفسارات عبر الإنترنت غير متاحة بعد.", cta: "احجز استشارة" },
    },
    terms: {
      review: "needs-professional-review",
      meta: { title: "الشروط | Growth Blueprint Advisory", description: "الشروط (هيكل مسودة بانتظار المراجعة القانونية)." },
      hero: { eyebrow: "قانوني", title: "الشروط", intro: "هذه الصفحة مكان مخصص لشروط Growth Blueprint Advisory." },
      crumb: "الشروط",
      status: { badge: "هيكل مسودة", title: "النص المعتمد بانتظار المراجعة القانونية", body: "لم تُقدَّم أي شروط معتمدة. لا تحدد هذه الصفحة أي شروط ولا ينبغي الاعتماد عليها. وسيُستكمل المحتوى بعد أن يقدّم المستشار القانوني لـ Growth Blueprint النص ويعتمده." },
      outline: {
        title: "موضوعات يُتوقع أن يغطيها المستشار القانوني", note: "مخطط عام فقط. هذه عناوين مقترحة وليست نصًا قانونيًا، وللمستشار القانوني تعديلها.", pending: "النص بانتظار مراجعة المستشار القانوني لـ Growth Blueprint.",
        sections: [
          { id: "use", title: "استخدام هذا الموقع" },
          { id: "bookings", title: "حجوزات الاستشارات والإلغاء" },
          { id: "briefs", title: "الموجزات القطاعية: الترخيص والاسترداد" },
          { id: "ip", title: "الملكية الفكرية" },
          { id: "liability", title: "حدود المسؤولية" },
          { id: "law", title: "القانون الواجب التطبيق وتسوية النزاعات" },
          { id: "changes", title: "التغييرات على هذه الشروط" },
        ],
      },
      related: [{ label: "إشعار الخصوصية", target: "privacy" }],
      contact: { title: "أسئلة", body: "الاستفسارات عبر الإنترنت غير متاحة بعد.", cta: "احجز استشارة" },
    },
  },
};
