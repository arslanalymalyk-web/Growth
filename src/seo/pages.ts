import { getInsightsContent, getIndustriesContent, getServicesContent, getTranslatedArticleSlugs } from "@/content";
import { locales, siteUrl, type Locale } from "@/i18n/config";
import { getShopRuntime } from "@/shop/load.ts";
import { localizeShop } from "@/shop/localize.ts";
import { languageAlternates } from "./metadata.ts";
import { featureIndexing } from "./state.ts";

export interface SitemapPage { path: string; availableIn: readonly Locale[] }

/** Every page that may appear in sitemap.xml: indexable by page-level rules. (Deployment-level gating happens in sitemap.ts.) */
export async function indexablePages(): Promise<SitemapPage[]> {
  const both = locales;
  const f = await featureIndexing();
  const pages: SitemapPage[] = ["", "/services", "/industries", "/about", "/our-approach", "/entering-saudi-arabia", "/growing-in-saudi-arabia", "/insights"].map((path) => ({ path, availableIn: both }));
  const [services, industries, insightsEn, translated] = await Promise.all([getServicesContent("en"), getIndustriesContent("en"), getInsightsContent("en"), getTranslatedArticleSlugs()]);
  for (const s of services.data.items) pages.push({ path: `/services/${s.id}`, availableIn: both });
  for (const i of industries.data.items) pages.push({ path: `/industries/${i.id}`, availableIn: both });
  for (const a of insightsEn.data.articles) {
    if (a.status === "draft-preview") continue;
    pages.push({ path: `/insights/${a.id}`, availableIn: translated.includes(a.id) ? both : ["en"] });
  }
  if (f.booking) pages.push({ path: "/book-consultation", availableIn: both });
  if (f.scorecard) pages.push({ path: "/readiness-scorecard", availableIn: both });
  if (f.contact) pages.push({ path: "/contact", availableIn: both });
  if (f.privacy) pages.push({ path: "/privacy", availableIn: both });
  if (f.terms) pages.push({ path: "/terms", availableIn: both });
  if (f.shop) {
    pages.push({ path: "/shop", availableIn: both });
    const rt = await getShopRuntime();
    for (const p of localizeShop(rt.config, rt.mode, "en", rt.sectorSlugs).products) if (!p.isPreview) pages.push({ path: `/shop/${p.id}`, availableIn: both });
  }
  return pages;
}

/** Sitemap rows: one URL per language, each carrying the full hreflang set (including x-default). */
export async function sitemapRows() {
  const origin = siteUrl();
  const rows: { url: string; alternates: { languages: Record<string, string> } }[] = [];
  for (const page of await indexablePages()) {
    const languages = Object.fromEntries(Object.entries(languageAlternates(page.path, page.availableIn)).map(([k, v]) => [k, `${origin}${v}`]));
    for (const l of page.availableIn) rows.push({ url: `${origin}/${l}${page.path}`, alternates: { languages } });
  }
  return rows;
}
