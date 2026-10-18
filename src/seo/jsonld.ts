import { defaultLocale, type Locale } from "../i18n/config.ts";
import type { BusinessProfile } from "./business.ts";

type Json = Record<string, unknown>;
const abs = (origin: string, path: string) => `${origin.replace(/\/$/, "")}${path}`;

/**
 * Organization: name and URL are always present (name is confirmed; URL comes from SITE_URL). Every other field appears
 * ONLY if the client has confirmed it. No ratings, reviews, credentials, awards or founding claims are ever generated.
 * A LocalBusiness/ProfessionalService type is NOT used: it needs a confirmed address, which does not exist yet.
 */
export function organizationJsonLd(profile: BusinessProfile, origin: string): Json {
  const o: Json = { "@context": "https://schema.org", "@type": "Organization", "@id": abs(origin, "/#organization"), name: profile.name, url: abs(origin, `/${defaultLocale}`) };
  if (profile.logoUrl) o.logo = profile.logoUrl;
  if (profile.email) o.email = profile.email;
  if (profile.telephone) o.telephone = profile.telephone;
  if (profile.address) o.address = { "@type": "PostalAddress", ...profile.address };
  if (profile.sameAs.length) o.sameAs = profile.sameAs;
  if (profile.areaServed.length) o.areaServed = profile.areaServed;
  return o;
}

export function websiteJsonLd(profile: BusinessProfile, origin: string, locale: Locale): Json {
  return {
    "@context": "https://schema.org", "@type": "WebSite", "@id": abs(origin, `/${locale}#website`), name: profile.name,
    url: abs(origin, `/${locale}`), inLanguage: locale, publisher: { "@id": abs(origin, "/#organization") },
  };
}

export interface Crumb { name: string; path?: string }
/** The last crumb is the current page; Google accepts it without an item URL. */
export function breadcrumbJsonLd(origin: string, crumbs: Crumb[]): Json | null {
  if (crumbs.length < 2) return null;
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, ...(c.path ? { item: abs(origin, c.path) } : {}) })),
  };
}

/**
 * Article: only for a PUBLISHED article with a confirmed date. The author is the Organization (never a person the client
 * has not confirmed publicly); no image unless the article has an approved one.
 */
export function articleJsonLd(origin: string, a: { locale: Locale; slug: string; headline: string; description: string; datePublished: string | null; imageUrl?: string | null }, profile: BusinessProfile): Json | null {
  if (!a.datePublished) return null;
  const o: Json = {
    "@context": "https://schema.org", "@type": "Article", headline: a.headline, description: a.description, inLanguage: a.locale,
    datePublished: a.datePublished, mainEntityOfPage: abs(origin, `/${a.locale}/insights/${a.slug}`),
    author: { "@id": abs(origin, "/#organization") }, publisher: { "@id": abs(origin, "/#organization"), "@type": "Organization", name: profile.name },
  };
  if (a.imageUrl) o.image = a.imageUrl;
  return o;
}

/** Serialises for a <script type="application/ld+json">. Escapes "<" so content can never close the script tag. */
export function serializeJsonLd(data: Json): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

