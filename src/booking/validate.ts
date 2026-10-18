import type { BookingConfig, L, ValidationIssue } from "./types.ts";

const hasText = (l: L | undefined | null): l is L => Boolean(l && l.en?.trim() && l.ar?.trim());
const posInt = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n > 0;

/**
 * Booking may be activated for production ONLY when this returns no issues AND approved calendar and payment providers
 * are installed (see mode.ts). It requires approval records, approved English and Arabic review, both packages with
 * real prices and durations, a decided bundle policy, client-approved terms, and provider ids.
 */
export function validateBookingConfig(c: BookingConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (code: string, message: string) => issues.push({ code, message });

  if (c.isDemo) add("demo-fixture", "Demo fixtures can never be activated as a live booking journey.");
  if (c.status !== "approved") add("not-approved", `Configuration status is "${c.status}"; it must be "approved".`);
  if (!c.approval?.approvedBy?.trim() || !c.approval?.approvedAt?.trim()) add("no-approval-record", "Missing approval record (approvedBy, approvedAt).");
  if (c.review.en !== "approved") add("review-not-approved", "English content is not marked approved.");
  if (c.review.ar !== "approved") add("review-not-approved", "Arabic content has not been professionally reviewed and approved.");
  if (c.timeZone !== "Asia/Riyadh") add("bad-time-zone", 'The display time zone must be "Asia/Riyadh".');
  if (c.bundlePolicy === null) add("bundle-policy-missing", "Client has not decided whether bundle sessions are scheduled all now or one at a time.");

  const kinds = new Set(c.packages.map((p) => p.kind));
  if (!kinds.has("single")) add("package-missing", "A single-session package is required.");
  if (!kinds.has("bundle")) add("package-missing", "A bundle package is required.");
  const ids = new Set<string>();
  for (const p of c.packages) {
    if (ids.has(p.id)) add("duplicate-id", `Duplicate package id "${p.id}".`);
    ids.add(p.id);
    if (!hasText(p.name) || !hasText(p.summary)) add("text-missing-translation", `Package "${p.id}" name and summary need English and Arabic text.`);
    if (p.kind === "single" && p.sessions !== 1) add("bad-sessions", `Single package "${p.id}" must have exactly 1 session.`);
    if (p.kind === "bundle" && !(p.sessions >= 2)) add("bad-sessions", `Bundle package "${p.id}" must have at least 2 sessions.`);
    if (p.price === null) add("price-missing", `Package "${p.id}" has no client-supplied price.`);
    else if (!posInt(p.price.amountMinor) || !/^[A-Z]{3}$/.test(p.price.currency)) add("price-invalid", `Package "${p.id}" price needs a positive integer amount in minor units and an ISO currency code.`);
    if (!posInt(p.durationMinutes)) add("duration-missing", `Package "${p.id}" has no client-supplied session duration.`);
  }

  // Details fields: minimal set, must include a name and an email
  const fieldIds = new Set<string>();
  for (const f of c.fields) {
    if (fieldIds.has(f.id)) add("duplicate-id", `Duplicate field id "${f.id}".`);
    fieldIds.add(f.id);
    if (!hasText(f.label)) add("text-missing-translation", `Field "${f.id}" label needs English and Arabic text.`);
    if (!posInt(f.maxLength)) add("bad-field", `Field "${f.id}" needs maxLength > 0.`);
  }
  if (!c.fields.some((f) => f.type === "email" && f.required)) add("fields-missing", "A required email field is needed to send the booking confirmation.");
  if (!c.fields.some((f) => f.id === "fullName" && f.required)) add("fields-missing", "A required fullName field is needed.");

  // Terms: never invented. Every item must be client-approved text.
  for (const key of ["cancellation", "refund", "booking", "privacy", "processingConsent"] as const) {
    if (!hasText(c.terms[key])) add("terms-missing", `Client-approved "${key}" wording is missing (English and Arabic).`);
  }

  if (!c.providers.calendar) add("calendar-provider-missing", "No approved, client-owned calendar provider is configured.");
  if (!c.providers.payment) add("payment-provider-missing", "No approved, client-owned payment gateway is configured.");
  return issues;
}

export const isBookingConfigValid = (c: BookingConfig): boolean => validateBookingConfig(c).length === 0;
