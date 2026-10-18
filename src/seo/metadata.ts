import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "../i18n/config.ts";
import { indexingEnabled } from "./indexing.ts";
import { siteSocial } from "./site.ts";

export const BRAND = "Growth Blueprint Advisory";

export interface PageSeo {
  locale: Locale;
  /** Path WITHOUT the locale prefix, e.g. "" (home), "/services", "/services/market-entry". */
  path: string;
  title: string;
  description?: string;
  /** Page-level decision. It only takes effect when the deployment itself is indexable (see indexing.ts). */
  index: boolean;
  /** Locales in which this exact page exists. Omit for "both"; use [locale] when there is no translation. */
  availableIn?: readonly Locale[];
  type?: "website" | "article";
  /** ISO date for articles. */
  publishedTime?: string | null;
}

export const withBrand = (title: string) => (title.includes(BRAND) ? title : `${title} | ${BRAND}`);

const OG_LOCALE: Record<Locale, string> = { en: "en_US", ar: "ar_SA" };
const url = (l: Locale, path: string) => `/${l}${path}`;

/** hreflang map for the page: each available language, plus x-default pointing at the default-language page. */
export function languageAlternates(path: string, availableIn: readonly Locale[] = locales): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of availableIn) map[l] = url(l, path);
  if (availableIn.includes(defaultLocale)) map["x-default"] = url(defaultLocale, path);
  return map;
}

/**
 * One place that builds title, description, canonical, hreflang, Open Graph, Twitter and robots for a page. Relative URLs
 * resolve against `metadataBase` (SITE_URL). Non-indexable pages carry no hreflang (they are not canonical targets).
 */
export function buildMetadata(p: PageSeo): Metadata {
  const available = p.availableIn ?? locales;
  const indexable = p.index && indexingEnabled();
  const title = withBrand(p.title);
  const canonical = url(p.locale, p.path);
  const social = siteSocial.image;
  const m: Metadata = {
    title: { absolute: title },
    description: p.description,
    alternates: { canonical, ...(p.index ? { languages: languageAlternates(p.path, available) } : {}) },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: p.type ?? "website",
      siteName: BRAND,
      title,
      description: p.description,
      url: canonical,
      locale: OG_LOCALE[p.locale],
      alternateLocale: available.filter((l) => l !== p.locale).map((l) => OG_LOCALE[l]),
      ...(p.type === "article" && p.publishedTime ? { publishedTime: p.publishedTime } : {}),
      ...(social ? { images: [{ url: social.url, alt: social.alt[p.locale] }] } : {}),
    },
    twitter: { card: social ? "summary_large_image" : "summary", title, description: p.description, ...(social ? { images: [social.url] } : {}) },
  };
  return m;
}
