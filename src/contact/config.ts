import type { ContactConfig, EnquiryField } from "./types.ts";

const d = (en: string, ar: string) => ({ en, ar });

/** Only what is needed to respond to an enquiry. The client must confirm this list; add fields only if genuinely needed. */
export const enquiryFields: EnquiryField[] = [
  { id: "fullName", type: "text", step: "about", required: true, label: d("Full name", "الاسم الكامل"), maxLength: 120, autocomplete: "name" },
  { id: "email", type: "email", step: "about", required: true, label: d("Email address", "البريد الإلكتروني"), help: d("We will reply to this address.", "سنرد على هذا العنوان."), maxLength: 254, autocomplete: "email" },
  { id: "organisation", type: "text", step: "about", required: false, label: d("Organisation (optional)", "المؤسسة (اختياري)"), maxLength: 160, autocomplete: "organization" },
  { id: "topic", type: "topic", step: "enquiry", required: false, label: d("What is your enquiry about? (optional)", "ما موضوع استفسارك؟ (اختياري)"), maxLength: 80 },
  { id: "message", type: "textarea", step: "enquiry", required: true, label: d("Your message", "رسالتك"), help: d("Tell us briefly what you would like to discuss.", "أخبرنا باختصار بما ترغب في مناقشته."), minLength: 10, maxLength: 2000 },
];

/**
 * THE REAL ENQUIRY / NEWSLETTER CONFIGURATION: DRAFT / UNAVAILABLE.
 *
 * The client has not selected a CRM or an email-marketing platform, has not supplied approved consent wording, and the
 * privacy notice has not been approved by the client's legal adviser. Do not invent any of them. When they exist:
 *   1. the client's legal adviser approves the privacy notice (src/content/sample/legal.ts) and the two consent wordings,
 *      set terms.version/enquiryConsent/newsletterConsent and privacyNotice "approved",
 *   2. the client selects and sets up a CRM and/or newsletter platform in their own accounts; an adapter implementing
 *      CrmProvider / NewsletterProvider is installed in providers.ts and `providers.*` set to its id,
 *   3. professional Arabic review, review "approved", approval recorded, status "approved".
 * Until validateContactChannel() is clean AND that channel's provider is installed, nothing collects personal data.
 */
export const realContact: ContactConfig = {
  id: "enquiry-and-newsletter",
  version: "0.0.0-draft",
  status: "draft",
  isDemo: false,
  review: { en: "draft", ar: "draft" },
  approval: null,
  privacyNotice: "pending",
  terms: { version: null, enquiryConsent: null, newsletterConsent: null },
  fields: enquiryFields,
  providers: { crm: null, newsletter: null },
};
