import type { Locale } from "@/i18n/config";
import type { ContactUi } from "../types";

/**
 * Interface copy for the enquiry form and newsletter signup. The consent sentences are DRAFT wording only: they carry a
 * visible "draft" marker, are replaced by client/legal-approved wording from the contact configuration, and must be
 * reviewed by Growth Blueprint's legal adviser. Nothing here claims legal compliance. English = draft pending client
 * approval. DRAFT Arabic: needs professional review.
 */
export const sampleContactUi: Record<Locale, ContactUi> = {
  en: {
    review: "draft",
    meta: { title: "Contact | Growth Blueprint Advisory", description: "Send an enquiry to Growth Blueprint Advisory." },
    hero: { eyebrow: "Contact", title: "Send an enquiry", intro: "Tell us a little about what you would like to discuss and we will respond." },
    crumb: "Contact",
    demo: { banner: "DEMO MODE: this form is a layout preview. Nothing you enter is sent, saved or logged anywhere, and no enquiry or subscription is made.", sent: "Demo only: nothing was sent." },
    unavailable: {
      badge: "Not open yet",
      title: "Online enquiries are not open yet",
      body: "We are preparing our enquiry form. It is not available yet, so please do not expect a reply to anything entered here.",
      note: "This page does not collect any personal information.",
      bookCta: "Book a Consultation",
      scorecardCta: "Saudi Readiness Scorecard",
    },
    progress: { label: "Enquiry progress", stepOf: "Step {current} of {total}: {name}", steps: { about: "About you", enquiry: "Your enquiry", review: "Review" } },
    steps: {
      about: { title: "About you", intro: "So that we know who to reply to." },
      enquiry: { title: "Your enquiry", intro: "What would you like to discuss?" },
      review: { title: "Review and send", intro: "Check your details, then give your consent to send." },
    },
    labels: { required: "Required", optional: "Optional", topicGeneral: "General enquiry", topicPlaceholder: "Choose a topic", count: "{n} / {max}", notProvided: "Not provided", edit: "Change", summary: "Your enquiry" },
    fieldLabels: { fullName: "Full name", email: "Email address", organisation: "Organisation", topic: "Topic", message: "Message" },
    consent: {
      title: "Consent",
      enquiryDraft: "I agree that Growth Blueprint Advisory may use the details I have entered to respond to my enquiry.",
      draftMarker: "Draft wording: requires client and legal review before it is used.",
      privacyLink: "Read the privacy notice (draft shell)",
      separateNote: "This consent is only for responding to your enquiry. It does not sign you up to the newsletter.",
    },
    errors: {
      title: "There is a problem", hint: "Please fix the following before continuing:",
      required: "This field is required.", invalid: "Enter a valid value.", tooShort: "This is too short. Please add a little more detail.", tooLong: "This is too long. Please shorten it.",
      consent: "You must give your consent to send the enquiry.", failed: "We could not send your enquiry. Please try again.", unavailable: "Enquiries are not available right now.",
    },
    buttons: { continue: "Continue", back: "Back", send: "Send enquiry", sendDemo: "Preview sending (demo)", sending: "Sending…", retry: "Try again", newEnquiry: "Start a new enquiry" },
    success: { title: "Enquiry sent", body: "Thank you. Your enquiry has been sent." },
    demoSuccess: { title: "Demo: nothing was sent", body: "This is a layout preview. No enquiry was sent, saved or logged." },
    failure: { title: "Your enquiry was not sent", body: "Something went wrong. Your details are still here, so you can try again." },
    side: { title: "Other ways to start", items: [{ label: "Book a Consultation", target: "booking" }, { label: "Take the Saudi Readiness Scorecard", target: "scorecard" }, { label: "Explore Entering Saudi Arabia", target: "entering" }] },
    newsletter: {
      title: "Newsletter", intro: "Receive our insights by email.", email: "Email address",
      consentDraft: "I would like to receive the Growth Blueprint Advisory newsletter by email.",
      draftMarker: "Draft wording: requires client and legal review before it is used.",
      privacyLink: "Privacy notice (draft shell)", submit: "Subscribe", sending: "Subscribing…",
      subscribed: "You are subscribed.", pending: "Almost done: please check your email to confirm your subscription.", demoSuccess: "Demo only: nothing was sent and nobody was subscribed.",
      failed: "We could not complete your subscription. Please try again.", retry: "Try again", unavailable: "Newsletter signup is not open yet.",
      errors: { title: "There is a problem", emailRequired: "Enter your email address.", emailInvalid: "Enter a valid email address.", emailTooLong: "This email address is too long.", consent: "You must give your consent to subscribe." },
    },
  },
  ar: {
    review: "needs-professional-review",
    meta: { title: "تواصل معنا | Growth Blueprint Advisory", description: "أرسل استفسارًا إلى Growth Blueprint Advisory." },
    hero: { eyebrow: "تواصل معنا", title: "أرسل استفسارًا", intro: "أخبرنا قليلًا عمّا ترغب في مناقشته وسنرد عليك." },
    crumb: "تواصل معنا",
    demo: { banner: "وضع تجريبي: هذا النموذج معاينة للتصميم فقط. لا يُرسل ولا يُحفظ ولا يُسجَّل أي شيء تُدخله في أي مكان، ولا يُنشأ أي استفسار أو اشتراك.", sent: "للعرض التجريبي فقط: لم يُرسل أي شيء." },
    unavailable: {
      badge: "غير متاح بعد",
      title: "الاستفسارات عبر الإنترنت غير متاحة بعد",
      body: "نعمل على إعداد نموذج الاستفسار. وهو غير متاح بعد، لذا لا تتوقع ردًا على أي شيء يُدخل هنا.",
      note: "لا تجمع هذه الصفحة أي معلومات شخصية.",
      bookCta: "احجز استشارة",
      scorecardCta: "بطاقة تقييم الجاهزية للسوق السعودي",
    },
    progress: { label: "تقدّم الاستفسار", stepOf: "الخطوة {current} من {total}: {name}", steps: { about: "عنك", enquiry: "استفسارك", review: "المراجعة" } },
    steps: {
      about: { title: "عنك", intro: "لنعرف لمن نرد." },
      enquiry: { title: "استفسارك", intro: "ما الذي ترغب في مناقشته؟" },
      review: { title: "المراجعة والإرسال", intro: "راجع بياناتك ثم أعطِ موافقتك للإرسال." },
    },
    labels: { required: "مطلوب", optional: "اختياري", topicGeneral: "استفسار عام", topicPlaceholder: "اختر موضوعًا", count: "{n} / {max}", notProvided: "غير مقدَّم", edit: "تعديل", summary: "استفسارك" },
    fieldLabels: { fullName: "الاسم الكامل", email: "البريد الإلكتروني", organisation: "المؤسسة", topic: "الموضوع", message: "الرسالة" },
    consent: {
      title: "الموافقة",
      enquiryDraft: "أوافق على أن تستخدم Growth Blueprint Advisory البيانات التي أدخلتها للرد على استفساري.",
      draftMarker: "صياغة مسودة: تتطلب مراجعة العميل والمستشار القانوني قبل استخدامها.",
      privacyLink: "اقرأ إشعار الخصوصية (هيكل مسودة)",
      separateNote: "هذه الموافقة مخصصة للرد على استفسارك فقط. ولا تشتركك في النشرة الإخبارية.",
    },
    errors: {
      title: "توجد مشكلة", hint: "يُرجى معالجة ما يلي قبل المتابعة:",
      required: "هذا الحقل مطلوب.", invalid: "أدخل قيمة صالحة.", tooShort: "النص قصير جدًا. يُرجى إضافة مزيد من التفاصيل.", tooLong: "النص طويل جدًا. يُرجى اختصاره.",
      consent: "يجب إعطاء موافقتك لإرسال الاستفسار.", failed: "تعذّر إرسال استفسارك. يُرجى المحاولة مرة أخرى.", unavailable: "الاستفسارات غير متاحة حاليًا.",
    },
    buttons: { continue: "متابعة", back: "رجوع", send: "إرسال الاستفسار", sendDemo: "معاينة الإرسال (تجريبي)", sending: "جارٍ الإرسال…", retry: "إعادة المحاولة", newEnquiry: "بدء استفسار جديد" },
    success: { title: "تم إرسال الاستفسار", body: "شكرًا لك. تم إرسال استفسارك." },
    demoSuccess: { title: "تجريبي: لم يُرسل أي شيء", body: "هذه معاينة للتصميم فقط. لم يُرسل أي استفسار ولم يُحفظ ولم يُسجَّل." },
    failure: { title: "لم يُرسل استفسارك", body: "حدث خطأ ما. ما زالت بياناتك موجودة هنا، فيمكنك المحاولة مرة أخرى." },
    side: { title: "طرق أخرى للبدء", items: [{ label: "احجز استشارة", target: "booking" }, { label: "ابدأ بطاقة تقييم الجاهزية للسوق السعودي", target: "scorecard" }, { label: "اكتشف دخول السوق السعودي", target: "entering" }] },
    newsletter: {
      title: "النشرة الإخبارية", intro: "تلقَّ رؤانا عبر البريد الإلكتروني.", email: "البريد الإلكتروني",
      consentDraft: "أرغب في تلقي النشرة الإخبارية لـ Growth Blueprint Advisory عبر البريد الإلكتروني.",
      draftMarker: "صياغة مسودة: تتطلب مراجعة العميل والمستشار القانوني قبل استخدامها.",
      privacyLink: "إشعار الخصوصية (هيكل مسودة)", submit: "اشتراك", sending: "جارٍ الاشتراك…",
      subscribed: "تم اشتراكك.", pending: "أوشكنا على الانتهاء: يُرجى مراجعة بريدك الإلكتروني لتأكيد اشتراكك.", demoSuccess: "للعرض التجريبي فقط: لم يُرسل أي شيء ولم يُشترك أحد.",
      failed: "تعذّر إكمال اشتراكك. يُرجى المحاولة مرة أخرى.", retry: "إعادة المحاولة", unavailable: "الاشتراك في النشرة الإخبارية غير متاح بعد.",
      errors: { title: "توجد مشكلة", emailRequired: "أدخل بريدك الإلكتروني.", emailInvalid: "أدخل بريدًا إلكترونيًا صالحًا.", emailTooLong: "البريد الإلكتروني طويل جدًا.", consent: "يجب إعطاء موافقتك للاشتراك." },
    },
  },
};
