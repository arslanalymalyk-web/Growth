import type { DetailField, LField, LPackage, Locale, Money, PaymentStatus, Slot, BundlePolicy } from "./types.ts";

/** How many slots the visitor chooses during booking. */
export const sessionsToSchedule = (pkg: Pick<LPackage, "kind" | "sessions">, policy: BundlePolicy): number =>
  pkg.kind === "single" ? 1 : policy === "select-all-now" ? pkg.sessions : 1;

// ---- Selection ---------------------------------------------------------------------------------------------
export type SelectionErrorCode = "missing" | "duplicate" | "order";
export interface SelectionError { index: number; code: SelectionErrorCode }

/** Every slot chosen, distinct, in chronological order and not overlapping the previous one. No invented gap rules. */
export function checkSelection(count: number, slots: (Slot | null)[]): SelectionError[] {
  const errors: SelectionError[] = [];
  for (let i = 0; i < count; i++) {
    const s = slots[i];
    if (!s) { errors.push({ index: i, code: "missing" }); continue; }
    for (let j = 0; j < i; j++) if (slots[j] && slots[j]!.id === s.id) { errors.push({ index: i, code: "duplicate" }); break; }
    const prev = i > 0 ? slots[i - 1] : null;
    if (prev && !errors.some((e) => e.index === i) && s.startsAt < prev.endsAt) errors.push({ index: i, code: "order" });
  }
  return errors;
}

// ---- Details -----------------------------------------------------------------------------------------------
export type DetailErrorCode = "required" | "invalid" | "too-long";
export interface DetailError { fieldId: string; code: DetailErrorCode }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s-]{6,}$/;

export const fieldsFor = <T extends { appliesTo: string[] }>(fields: T[], kind: string): T[] => fields.filter((f) => f.appliesTo.includes(kind));

export function checkDetails(fields: (DetailField | LField)[], values: Record<string, string>): DetailError[] {
  const errors: DetailError[] = [];
  for (const f of fields) {
    const v = (values[f.id] ?? "").trim();
    if (!v) { if (f.required) errors.push({ fieldId: f.id, code: "required" }); continue; }
    if ((values[f.id] ?? "").length > f.maxLength) errors.push({ fieldId: f.id, code: "too-long" });
    else if (f.type === "email" && !EMAIL.test(v)) errors.push({ fieldId: f.id, code: "invalid" });
    else if (f.type === "tel" && !PHONE.test(v)) errors.push({ fieldId: f.id, code: "invalid" });
  }
  return errors;
}

// ---- Price -------------------------------------------------------------------------------------------------
/** null when the client has not supplied a price: callers must show "price to be confirmed", never a number. */
export function formatPrice(price: Money | null, locale: Locale): string | null {
  if (!price) return null;
  const tag = locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB";
  return new Intl.NumberFormat(tag, { style: "currency", currency: price.currency, currencyDisplay: "code" }).format(price.amountMinor / 100);
}

// ---- Return state ------------------------------------------------------------------------------------------
export type ReturnRoute = "confirmation" | "pending" | "cancelled" | "error";
export type ReturnState = "confirmed" | "pending" | "cancelled" | "error" | "unverified";

/**
 * What a return page may show. "confirmed" ONLY when the provider verified payment server-side: never from the URL
 * alone. Without a verified status, the confirmation route shows "unverified"; other routes show their own
 * non-success state.
 */
export function deriveReturnState(route: ReturnRoute, status: PaymentStatus | "no-session"): ReturnState {
  if (status === "paid") return "confirmed";
  if (status === "pending") return "pending";
  if (status === "cancelled" || status === "expired") return "cancelled";
  if (status === "failed") return "error";
  return route === "confirmation" ? "unverified" : route;
}
