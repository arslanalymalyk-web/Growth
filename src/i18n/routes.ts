import { industrySlugs, serviceSlugs } from "@/content/catalog";
import type { LinkTarget, NavItem } from "@/content/types";
import { hasLocale, type Locale } from "./config";

/** Static pages that exist in every locale. Detail pages are added from the shared catalogue slugs. */
const staticRoutes = [
  "", "/services", "/industries", "/about", "/our-approach", "/entering-saudi-arabia", "/growing-in-saudi-arabia",
  "/insights", "/book-consultation", "/readiness-scorecard", "/readiness-scorecard/assessment", "/readiness-scorecard/results",
  "/book-consultation/schedule", "/book-consultation/details", "/book-consultation/checkout",
  "/book-consultation/confirmation", "/book-consultation/pending", "/book-consultation/cancelled", "/book-consultation/error",
  "/contact", "/privacy", "/terms",
  "/shop", "/shop/order/confirmation", "/shop/order/pending", "/shop/order/failed", "/shop/order/resend",
];
const translated = new Set<string>([
  ...staticRoutes,
  ...serviceSlugs.map((s) => `/services/${s}`),
  ...industrySlugs.map((s) => `/industries/${s}`),
]);

export const routes = {
  home: (l: Locale) => `/${l}`,
  section: (l: Locale, anchor: string) => (anchor ? `/${l}#${anchor}` : `/${l}`),
  services: (l: Locale) => `/${l}/services`,
  service: (l: Locale, slug: string) => `/${l}/services/${slug}`,
  industries: (l: Locale) => `/${l}/industries`,
  industry: (l: Locale, slug: string) => `/${l}/industries/${slug}`,
  about: (l: Locale) => `/${l}/about`,
  approach: (l: Locale) => `/${l}/our-approach`,
  entering: (l: Locale) => `/${l}/entering-saudi-arabia`,
  growing: (l: Locale) => `/${l}/growing-in-saudi-arabia`,
  insights: (l: Locale) => `/${l}/insights`,
  insight: (l: Locale, slug: string) => `/${l}/insights/${slug}`,
  booking: (l: Locale) => `/${l}/book-consultation`,
  bookingStep: (l: Locale, step: "schedule" | "details" | "checkout" | "confirmation" | "pending" | "cancelled" | "error") => `/${l}/book-consultation/${step}`,
  contact: (l: Locale) => `/${l}/contact`,
  privacy: (l: Locale) => `/${l}/privacy`,
  terms: (l: Locale) => `/${l}/terms`,
  shop: (l: Locale) => `/${l}/shop`,
  product: (l: Locale, slug: string) => `/${l}/shop/${slug}`,
  productCheckout: (l: Locale, slug: string) => `/${l}/shop/${slug}/checkout`,
  shopOrder: (l: Locale, step: "confirmation" | "pending" | "failed" | "resend") => `/${l}/shop/order/${step}`,
  scorecard: (l: Locale) => `/${l}/readiness-scorecard`,
  scorecardAssessment: (l: Locale) => `/${l}/readiness-scorecard/assessment`,
  scorecardResults: (l: Locale) => `/${l}/readiness-scorecard/results`,
  nav: (l: Locale, item: NavItem) => (item.path ? `/${l}/${item.path}` : `/${l}${item.anchor ? `#${item.anchor}` : ""}`),
};

/** Resolves an editable link target (from content data) to a URL. */
export function hrefFor(l: Locale, t: LinkTarget): string {
  switch (t.kind) {
    case "service": return routes.service(l, t.slug);
    case "industry": return routes.industry(l, t.slug);
    case "insight": return routes.insight(l, t.slug);
    default: return routes[t.kind](l);
  }
}

/**
 * Path for the same page in another locale. Falls back to the other locale's nearest listing or homepage when no
 * equivalent exists. `articleSlugs` = insight slugs visible in every language (computed on the server).
 */
export function pathInLocale(pathname: string, target: Locale, articleSlugs: string[] = []): string {
  const [, first, ...rest] = pathname.split("/");
  const tail = first && hasLocale(first) ? (rest.length ? `/${rest.join("/")}` : "") : pathname === "/" ? "" : pathname;
  const clean = tail.replace(/\/$/, "");
  if (translated.has(clean)) return `/${target}${clean}`;
  if (clean.startsWith("/insights/")) return articleSlugs.includes(clean.slice("/insights/".length)) ? `/${target}${clean}` : `/${target}/insights`;
  // Shop products are language-independent (every product is bilingual), so a product page or its checkout has a translation.
  if (/^\/shop\/[^/]+(\/checkout)?$/.test(clean)) return `/${target}${clean}`;
  return `/${target}`;
}
