export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { dir: "ltr" | "rtl"; name: string; htmlLang: string }> = {
  en: { dir: "ltr", name: "English", htmlLang: "en" },
  ar: { dir: "rtl", name: "العربية", htmlLang: "ar" },
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}

/** Base URL used for canonical and hreflang links. Set SITE_URL once the client domain is known. */
export function siteUrl(): string {
  return process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}
