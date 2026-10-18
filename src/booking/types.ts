// Consultation booking model and provider interfaces. Pure types: no framework imports (tests run this code under Node).
// The client has NOT supplied prices, session duration, availability, cancellation/refund terms, a calendar provider or a
// payment gateway. Nothing here may invent them, and no real booking or payment is possible in this stage.

export interface L { en: string; ar: string }
export type Locale = "en" | "ar";
export type ReviewState = "draft" | "needs-professional-review" | "approved";
export interface ValidationIssue { code: string; message: string }

/** Display time zone for the whole journey. Availability itself always comes from the calendar provider. */
export const DISPLAY_TIME_ZONE = "Asia/Riyadh" as const;

/** Minor units (e.g. halalas/cents) plus an ISO 4217 code. Never a float. */
export interface Money { amountMinor: number; currency: string }

export type PackageKind = "single" | "bundle";
export interface BookingPackage {
  id: string;
  kind: PackageKind;
  /** 1 for a single session; the number of sessions in the bundle (the brief says three). */
  sessions: number;
  name: L;
  summary: L;
  /** null until the client supplies a price: the UI then shows "price to be confirmed". */
  price: Money | null;
  /** null until the client supplies the session duration. */
  durationMinutes: number | null;
}

/**
 * How many bundle sessions are scheduled during booking. null = the client has not decided (blocks activation).
 *  - "select-all-now": the visitor picks every session's slot now.
 *  - "select-first-now": the visitor picks the first slot; the rest are arranged afterwards.
 */
export type BundlePolicy = "select-all-now" | "select-first-now";

export type FieldType = "text" | "email" | "tel" | "textarea";
/** A booking-detail field. Only fields the client confirms are needed should be listed. */
export interface DetailField {
  id: string;
  type: FieldType;
  required: boolean;
  label: L;
  help?: L;
  maxLength: number;
  autocomplete?: string;
  appliesTo: PackageKind[];
}

export interface BookingTerms {
  /** Client-approved wording. null = an "approval needed" placeholder is shown instead; never invented. */
  cancellation: L | null;
  refund: L | null;
  booking: L | null;
  privacy: L | null;
  /** Wording of the required consent to process booking details. */
  processingConsent: L | null;
}

export interface BookingConfig {
  id: string;
  version: string;
  /** "approved" only when the client has signed off every item below. */
  status: "draft" | "approved";
  /** True only for the development-only demo fixture; a demo fixture can never be live. */
  isDemo: boolean;
  review: { en: ReviewState; ar: ReviewState };
  approval: { approvedBy: string; approvedAt: string } | null;
  timeZone: typeof DISPLAY_TIME_ZONE;
  /** 0 = Sunday, 1 = Monday, 6 = Saturday. A display convention for the calendar grid, to be confirmed. */
  weekStartsOn: 0 | 1 | 6;
  bundlePolicy: BundlePolicy | null;
  packages: BookingPackage[];
  fields: DetailField[];
  terms: BookingTerms;
  /** Ids of the approved, client-owned providers. null until accounts exist. */
  providers: { calendar: string | null; payment: string | null };
  /** Where consultation enquiries go while booking is unavailable. null until the client supplies it. */
  enquiryEmail: string | null;
}

// ---- Slots ---------------------------------------------------------------------------------------------
export interface Slot { id: string; startsAt: string; endsAt: string } // ISO 8601 UTC instants

// ---- Provider interfaces (server-side only) ---------------------------------------------------------------
export interface ProviderError { code: "unavailable" | "invalid-request" | "rate-limited" | "provider-error" | "not-enabled"; message: string }
export type Result<T> = { ok: true; value: T } | { ok: false; error: ProviderError };

export interface AvailabilityQuery {
  packageId: string;
  /** Inclusive calendar dates (YYYY-MM-DD) in the display time zone. */
  fromDate: string;
  toDate: string;
  timeZone: typeof DISPLAY_TIME_ZONE;
}

export interface CalendarProvider {
  /** Must equal BookingConfig.providers.calendar. */
  readonly id: string;
  getAvailability(query: AvailabilityQuery): Promise<Result<Slot[]>>;
  /** Temporarily reserves slots before payment. Provider-defined hold semantics. */
  reserveSlots(req: { packageId: string; slotIds: string[] }): Promise<Result<{ reservationId: string; expiresAt?: string }>>;
  /** Confirms a reservation once payment is verified. */
  confirmBooking(req: { reservationId: string }): Promise<Result<{ bookingRef: string }>>;
  cancelBooking(req: { bookingRef: string }): Promise<Result<void>>;
}

export type PaymentStatus = "paid" | "pending" | "cancelled" | "expired" | "failed" | "unknown";

export interface CheckoutRequest {
  packageId: string;
  reservationId: string;
  /** Absolute return URLs on this site. */
  returnUrls: { success: string; pending: string; cancelled: string; error: string };
  locale: Locale;
  customer: { name: string; email: string };
}

/**
 * Hosted-checkout gateway. The site NEVER renders or stores card fields: createCheckoutSession returns a URL on the
 * provider's own hosted payment page, and the browser is sent there. The result of payment is always verified
 * server-side with getCheckoutStatus (never trusted from the return URL).
 */
export interface PaymentProvider {
  /** Must equal BookingConfig.providers.payment. */
  readonly id: string;
  createCheckoutSession(req: CheckoutRequest): Promise<Result<{ sessionId: string; checkoutUrl: string; expiresAt?: string }>>;
  getCheckoutStatus(sessionId: string): Promise<Result<PaymentStatus>>;
}

export interface BookingProviders { calendar: CalendarProvider | null; payment: PaymentProvider | null }

export type BookingMode = "live" | "demo" | "opening-soon";

// ---- Single-language view used by the UI ------------------------------------------------------------------
export interface LPackage { id: string; kind: PackageKind; sessions: number; name: string; summary: string; price: Money | null; durationMinutes: number | null }
export interface LField { id: string; type: FieldType; required: boolean; label: string; help?: string; maxLength: number; autocomplete?: string; appliesTo: PackageKind[] }
export interface LocalizedBooking {
  isDemo: boolean;
  timeZone: typeof DISPLAY_TIME_ZONE;
  weekStartsOn: 0 | 1 | 6;
  bundlePolicy: BundlePolicy;
  packages: LPackage[];
  fields: LField[];
  terms: { cancellation: string | null; refund: string | null; booking: string | null; privacy: string | null; processingConsent: string | null };
  enquiryEmail: string | null;
}
