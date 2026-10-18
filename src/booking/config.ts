import type { BookingConfig } from "./types.ts";

const d = (en: string, ar: string) => ({ en, ar });

/**
 * THE REAL CONSULTATION BOOKING CONFIGURATION: DRAFT / UNAVAILABLE.
 *
 * The client has not supplied prices, session duration, availability rules, cancellation/refund terms, a calendar
 * provider or a payment gateway. Do not invent them. When the client supplies approved material:
 *   1. set each package's price (minor units + ISO currency) and durationMinutes,
 *   2. decide bundlePolicy, confirm weekStartsOn and the detail fields,
 *   3. paste client-approved terms (English and Arabic) after legal review,
 *   4. create client-owned calendar and payment accounts, install the adapters in providers.ts and set providers.*,
 *   5. mark review.en / review.ar "approved" after professional review, record approval, set status "approved".
 * Until validateBookingConfig() is clean AND both providers are installed, the site shows "Booking opening soon".
 */
export const realBooking: BookingConfig = {
  id: "consultation-booking",
  version: "0.0.0-draft",
  status: "draft",
  isDemo: false,
  review: { en: "draft", ar: "draft" },
  approval: null,
  timeZone: "Asia/Riyadh",
  weekStartsOn: 0, // display convention only: to be confirmed with the client
  bundlePolicy: null,
  packages: [
    // Names come from the brief (one session / three-session bundle). Price and duration are NOT supplied.
    { id: "single", kind: "single", sessions: 1, name: d("One consultation session", "جلسة استشارية واحدة"), summary: d("A single consultation session.", "جلسة استشارية واحدة."), price: null, durationMinutes: null },
    { id: "bundle", kind: "bundle", sessions: 3, name: d("Three-session bundle", "حزمة من ثلاث جلسات"), summary: d("A bundle of three consultation sessions.", "حزمة من ثلاث جلسات استشارية."), price: null, durationMinutes: null },
  ],
  // Minimal details needed to arrange and confirm a consultation. The client must confirm this list.
  fields: [
    { id: "fullName", type: "text", required: true, label: d("Full name", "الاسم الكامل"), maxLength: 120, autocomplete: "name", appliesTo: ["single", "bundle"] },
    { id: "email", type: "email", required: true, label: d("Email address", "البريد الإلكتروني"), help: d("Used to send your booking confirmation.", "يُستخدم لإرسال تأكيد الحجز."), maxLength: 160, autocomplete: "email", appliesTo: ["single", "bundle"] },
    { id: "notes", type: "textarea", required: false, label: d("What would you like to discuss? (optional)", "ما الذي تودّ مناقشته؟ (اختياري)"), maxLength: 600, appliesTo: ["single", "bundle"] },
  ],
  terms: { cancellation: null, refund: null, booking: null, privacy: null, processingConsent: null },
  providers: { calendar: null, payment: null },
  enquiryEmail: null,
};
