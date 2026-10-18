// Enquiry and newsletter model, provider interfaces and canonical records. Pure types: no framework imports (tests run this
// code under Node). NO CRM or newsletter provider has been selected by the client, so nothing here names one, maps fields to
// one, or holds a credential. Adapters (added later, server-side only) translate these canonical records to a provider.
import type { L, Locale, ProviderError, Result, ReviewState, ValidationIssue } from "../booking/types.ts";

export type { L, Locale, ProviderError, Result, ReviewState, ValidationIssue };

export type EnquiryStep = "about" | "enquiry";
/** "topic" is a select built from the existing services (plus a general option); the others are plain inputs. */
export type EnquiryFieldType = "text" | "email" | "textarea" | "topic";

/** Only fields needed to respond to an enquiry. The client must confirm this list. */
export interface EnquiryField {
  id: "fullName" | "email" | "organisation" | "topic" | "message";
  type: EnquiryFieldType;
  step: EnquiryStep;
  required: boolean;
  label: L;
  help?: L;
  minLength?: number;
  maxLength: number;
  autocomplete?: string;
}

export interface ContactTerms {
  /** Identifier of the approved consent wording, stored with each consent as evidence. null until approved. */
  version: string | null;
  /** Client/legal-approved wording. null = a DRAFT wording (marked as such) is shown instead and live use is blocked. */
  enquiryConsent: L | null;
  newsletterConsent: L | null;
}

export interface ContactConfig {
  id: string;
  version: string;
  status: "draft" | "approved";
  /** True only for the development-only demo fixture; it can never be live. */
  isDemo: boolean;
  review: { en: ReviewState; ar: ReviewState };
  approval: { approvedBy: string; approvedAt: string } | null;
  /** The privacy notice page must be approved by the client's legal adviser before any personal data is collected. */
  privacyNotice: "pending" | "approved";
  terms: ContactTerms;
  fields: EnquiryField[];
  /** Ids of approved, client-owned providers. null until selected and set up. */
  providers: { crm: string | null; newsletter: string | null };
}

export type Channel = "enquiry" | "newsletter";
export type ContactMode = "live" | "demo" | "unavailable";

// ---- Canonical records (what adapters receive) -------------------------------------------------------------
export interface ConsentEvidence {
  given: true;
  /** ContactTerms.version of the wording shown. */
  textVersion: string;
  /** ISO timestamp, set server-side. */
  at: string;
}
export interface EnquiryRecord {
  fullName: string;
  email: string;
  organisation?: string;
  /** A service slug, or "general". */
  topic?: string;
  message: string;
  locale: Locale;
  /** Consent to process the details in order to respond. NOT consent to marketing. */
  processingConsent: ConsentEvidence;
}
export interface SubscriptionRecord {
  email: string;
  locale: Locale;
  /** Newsletter subscription consent: separate from, and never implied by, an enquiry. */
  subscriptionConsent: ConsentEvidence;
}

// ---- Provider interfaces (server-side only) ---------------------------------------------------------------
/** Client-owned CRM. The adapter owns any field mapping; none is defined here. Must not log record contents. */
export interface CrmProvider {
  readonly id: string;
  createEnquiry(record: EnquiryRecord): Promise<Result<{ reference: string }>>;
}
/** Client-owned email-marketing platform. "pending-confirmation" = the provider sends its own confirmation email. */
export interface NewsletterProvider {
  readonly id: string;
  subscribe(record: SubscriptionRecord): Promise<Result<{ status: "subscribed" | "pending-confirmation" }>>;
}
export interface ContactProviders { crm: CrmProvider | null; newsletter: NewsletterProvider | null }

// ---- Single-language view used by the UI ----------------------------------------------------------------------
export interface LEnquiryField extends Omit<EnquiryField, "label" | "help"> { label: string; help?: string }
export interface LocalizedContact {
  isDemo: boolean;
  fields: LEnquiryField[];
  /** Approved wording, or null (the UI then shows a labelled DRAFT wording). */
  terms: { enquiryConsent: string | null; newsletterConsent: string | null };
}
