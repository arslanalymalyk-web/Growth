import { checkEnquiry, checkSubscriberEmail, type FieldError } from "./rules.ts";
import type { ContactConfig, ContactMode, ContactProviders, EnquiryRecord, Locale, SubscriptionRecord } from "./types.ts";

/**
 * Server-side submission flows, written against the provider interfaces so they can be tested with stubs. They validate
 * EVERYTHING again (never trust the client), refuse unless the channel is live, store nothing, and never log or echo
 * personal data (provider error messages are deliberately not passed back).
 */
export type SubmitErrorCode = "unavailable" | "not-enabled" | "invalid" | "provider-error";
export interface SubmitFailure { ok: false; code: SubmitErrorCode; fieldErrors?: FieldError[]; consentMissing?: boolean }
export type SubmitResult<T> = { ok: true; value: T } | SubmitFailure;

export interface FlowDeps { mode: ContactMode; config: ContactConfig; providers: ContactProviders; topics: string[]; now?: () => Date }
const isLocale = (v: unknown): v is Locale => v === "en" || v === "ar";
const isStrings = (v: unknown): v is Record<string, string> => Boolean(v) && typeof v === "object" && !Array.isArray(v) && Object.values(v as object).every((x) => typeof x === "string");
const invalid = (extra: Partial<SubmitFailure> = {}): SubmitFailure => ({ ok: false, code: "invalid", ...extra });

export interface EnquiryInput { values: Record<string, string>; locale: Locale; consent: boolean; hp: string }
export interface NewsletterInput { email: string; locale: Locale; consent: boolean; hp: string }

export async function processEnquiry(d: FlowDeps, input: EnquiryInput): Promise<SubmitResult<Record<string, never>>> {
  if (d.mode === "unavailable" || !d.providers.crm) return { ok: false, code: "unavailable" };
  if (d.mode !== "live") return { ok: false, code: "not-enabled" }; // the demo never reaches the server
  if (!input || !isStrings(input.values) || !isLocale(input.locale) || typeof input.hp !== "string") return invalid();
  if (input.hp !== "") return invalid(); // honeypot field was filled in
  if (input.consent !== true) return invalid({ consentMissing: true }); // explicit consent is required and is never assumed
  const fieldErrors = checkEnquiry(d.config.fields, input.values, d.topics);
  if (fieldErrors.length) return invalid({ fieldErrors });
  const version = d.config.terms.version;
  if (!version) return { ok: false, code: "unavailable" };

  const v = (id: string) => (input.values[id] ?? "").trim();
  const record: EnquiryRecord = {
    fullName: v("fullName"),
    email: v("email"),
    ...(v("organisation") && { organisation: v("organisation") }),
    ...(v("topic") && { topic: v("topic") }),
    message: v("message"),
    locale: input.locale,
    processingConsent: { given: true, textVersion: version, at: (d.now?.() ?? new Date()).toISOString() },
  };
  try {
    const r = await d.providers.crm.createEnquiry(record);
    return r.ok ? { ok: true, value: {} } : { ok: false, code: "provider-error" };
  } catch {
    return { ok: false, code: "provider-error" };
  }
}

export async function processSubscription(d: FlowDeps, input: NewsletterInput): Promise<SubmitResult<{ status: "subscribed" | "pending-confirmation" }>> {
  if (d.mode === "unavailable" || !d.providers.newsletter) return { ok: false, code: "unavailable" };
  if (d.mode !== "live") return { ok: false, code: "not-enabled" };
  if (!input || typeof input.email !== "string" || !isLocale(input.locale) || typeof input.hp !== "string") return invalid();
  if (input.hp !== "") return invalid();
  if (input.consent !== true) return invalid({ consentMissing: true });
  if (checkSubscriberEmail(input.email)) return invalid({ fieldErrors: [{ fieldId: "email", code: checkSubscriberEmail(input.email)! }] });
  const version = d.config.terms.version;
  if (!version) return { ok: false, code: "unavailable" };

  const record: SubscriptionRecord = { email: input.email.trim(), locale: input.locale, subscriptionConsent: { given: true, textVersion: version, at: (d.now?.() ?? new Date()).toISOString() } };
  try {
    const r = await d.providers.newsletter.subscribe(record);
    return r.ok ? { ok: true, value: { status: r.value.status } } : { ok: false, code: "provider-error" };
  } catch {
    return { ok: false, code: "provider-error" };
  }
}
