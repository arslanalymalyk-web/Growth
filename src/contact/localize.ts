import type { Locale } from "../booking/types.ts";
import type { ContactConfig, LocalizedContact } from "./types.ts";

/** Single-language view of a config for the UI. Approved wording only: null means "show the marked DRAFT wording". */
export function localizeContact(config: ContactConfig, locale: Locale): LocalizedContact {
  return {
    isDemo: config.isDemo,
    fields: config.fields.map((f) => ({ ...f, label: f.label[locale], help: f.help?.[locale] })),
    terms: {
      enquiryConsent: config.terms.enquiryConsent?.[locale] ?? null,
      newsletterConsent: config.terms.newsletterConsent?.[locale] ?? null,
    },
  };
}
