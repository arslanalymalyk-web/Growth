import type { BookingConfig, L, LocalizedBooking, Locale } from "./types.ts";

const t = (l: L, locale: Locale): string => l[locale];
const opt = (l: L | null, locale: Locale): string | null => (l ? t(l, locale) : null);

/** Resolves a bilingual configuration to one language. Requires a decided bundlePolicy (active configs always have one). */
export function localizeBooking(c: BookingConfig, locale: Locale): LocalizedBooking {
  return {
    isDemo: c.isDemo,
    timeZone: c.timeZone,
    weekStartsOn: c.weekStartsOn,
    bundlePolicy: c.bundlePolicy ?? "select-all-now",
    packages: c.packages.map((p) => ({ id: p.id, kind: p.kind, sessions: p.sessions, name: t(p.name, locale), summary: t(p.summary, locale), price: p.price, durationMinutes: p.durationMinutes })),
    fields: c.fields.map((f) => ({ id: f.id, type: f.type, required: f.required, label: t(f.label, locale), help: f.help ? t(f.help, locale) : undefined, maxLength: f.maxLength, autocomplete: f.autocomplete, appliesTo: f.appliesTo })),
    terms: { cancellation: opt(c.terms.cancellation, locale), refund: opt(c.terms.refund, locale), booking: opt(c.terms.booking, locale), privacy: opt(c.terms.privacy, locale), processingConsent: opt(c.terms.processingConsent, locale) },
    enquiryEmail: c.enquiryEmail,
  };
}
