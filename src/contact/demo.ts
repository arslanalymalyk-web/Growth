import { enquiryFields } from "./config.ts";
import type { ContactConfig } from "./types.ts";

/**
 * DEVELOPMENT-ONLY DEMO FIXTURE (marker: __CONTACT_DEMO_FIXTURE__).
 * Lets the enquiry form and newsletter signup be previewed. The demo is entirely CLIENT-SIDE: nothing is sent to any
 * server, provider, CRM or email service, nothing is stored or logged, and the UI says so. Consent wording is left null so
 * the clearly marked DRAFT wording is shown. Loaded only when NODE_ENV === "development" and CONTACT_DEMO=1, flagged
 * isDemo (always rejected for live use), and excluded from production bundles.
 */
export const demoContact: ContactConfig = {
  id: "__CONTACT_DEMO_FIXTURE__",
  version: "demo",
  status: "draft",
  isDemo: true,
  review: { en: "draft", ar: "needs-professional-review" },
  approval: null,
  privacyNotice: "pending",
  terms: { version: null, enquiryConsent: null, newsletterConsent: null },
  fields: enquiryFields,
  providers: { crm: null, newsletter: null },
};
