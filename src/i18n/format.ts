import type { Locale } from "./config";

/** Formats an ISO date (YYYY-MM-DD). Arabic uses the Gregorian calendar explicitly (ar-SA defaults to Hijri). */
export function formatDate(iso: string, locale: Locale): string {
  const tag = locale === "ar" ? "ar-SA-u-ca-gregory" : "en-GB";
  return new Intl.DateTimeFormat(tag, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

/** Replaces {key} placeholders in interface strings. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? `{${k}}`));
}
