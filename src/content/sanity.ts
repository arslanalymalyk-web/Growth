import { createClient } from "@sanity/client";
import type { Locale } from "@/i18n/config";
import type { HomeContent } from "./types";

/**
 * Sanity is the planned CMS for PUBLIC-SITE CONTENT ONLY.
 * Never store enquiry, scorecard, customer or payment data here.
 * The project, dataset and schema are not created yet; this reader is inactive until
 * SANITY_PROJECT_ID and SANITY_DATASET are supplied (client-owned Sanity project).
 */
export function isSanityConfigured(): boolean {
  return Boolean(process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET);
}

function client() {
  return createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET!,
    apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
    useCdn: true, // public, published content only (no token)
  });
}

// Expected schema (to be created in the client's Sanity project): one `homePage` document per language,
// with fields shaped like HomeContent (see ./types.ts).
const HOME_QUERY = `*[_type == "homePage" && language == $language][0]{
  meta, hero, pathways, services, industries, approach, founder, insights, scorecard, consultation
}`;

function looksLikeHome(value: unknown): value is HomeContent {
  const v = value as Partial<HomeContent> | null;
  return Boolean(
    v?.hero?.headline && v.meta?.title && Array.isArray(v.services?.items) &&
      Array.isArray(v.industries?.items) && Array.isArray(v.approach?.steps) &&
      Array.isArray(v.insights?.items) && Array.isArray(v.pathways) && v.founder?.title &&
      v.scorecard?.title && v.consultation?.title,
  );
}

export async function fetchHomeFromSanity(locale: Locale): Promise<HomeContent | null> {
  const doc = await client().fetch(HOME_QUERY, { language: locale }, { next: { revalidate: 300 } });
  return looksLikeHome(doc) ? doc : null;
}

// ---- Services and industries ------------------------------------------------------------------
// Expected documents in the client's Sanity project, one per language:
//   servicesPage / industriesPage: page-level fields (review, meta, hero, labels, ...) of ServicesContent / IndustriesContent
//   service / industry: one document per catalogue id, with `slug.current` equal to the catalogue id,
//   fields shaped like ServiceCopy / IndustryCopy, and `order` for sorting.
// Content is used only if ALL catalogue entries are present and valid; otherwise sample content is used.
import { industrySlugs, serviceSlugs } from "./catalog";
import type { IndustriesContent, IndustryCopy, ServiceCopy, ServicesContent } from "./types";

const SERVICES_PAGE = `*[_type == "servicesPage" && language == $language][0]{ review, meta, hero, groups, journey, labels }`;
const SERVICE_ITEMS = `*[_type == "service" && language == $language] | order(order asc){
  "id": slug.current, review, title, summary, intro, audience, topics, outputs, seo }`;
const INDUSTRIES_PAGE = `*[_type == "industriesPage" && language == $language][0]{ review, meta, hero, gridTitle, labels }`;
const INDUSTRY_ITEMS = `*[_type == "industry" && language == $language] | order(order asc){
  "id": slug.current, review, seo, title, tagline, intro, context, challenges, help, outputs, questions,
  "insights": coalesce(insights, []) }`;

const strings = (v: unknown, min = 1) => Array.isArray(v) && v.length >= min && v.every((x) => typeof x === "string" && x);
const sameIds = (items: { id: string }[], expected: string[]) =>
  items.length === expected.length && expected.every((id) => items.some((i) => i.id === id));

function validServiceItem(i: Partial<ServiceCopy>): i is ServiceCopy {
  return Boolean(i.id && i.title && i.summary && i.intro && strings(i.audience) && strings(i.topics) && strings(i.outputs));
}
function validIndustryItem(i: Partial<IndustryCopy>): i is IndustryCopy {
  return Boolean(
    i.id && i.title && i.tagline && i.intro && i.context && strings(i.challenges) && strings(i.help) && strings(i.outputs) &&
      strings(i.questions) && Array.isArray(i.insights),
  );
}

export async function fetchServicesFromSanity(locale: Locale): Promise<ServicesContent | null> {
  const c = client();
  const [page, items] = await Promise.all([
    c.fetch(SERVICES_PAGE, { language: locale }, { next: { revalidate: 300 } }),
    c.fetch(SERVICE_ITEMS, { language: locale }, { next: { revalidate: 300 } }),
  ]);
  if (!page?.hero?.title || !page.meta?.title || !page.groups?.enter || !page.groups?.grow || !page.journey?.title || !page.labels) return null;
  if (!Array.isArray(items) || !items.every(validServiceItem) || !sameIds(items, serviceSlugs)) return null;
  return { ...page, items } as ServicesContent;
}

export async function fetchIndustriesFromSanity(locale: Locale): Promise<IndustriesContent | null> {
  const c = client();
  const [page, items] = await Promise.all([
    c.fetch(INDUSTRIES_PAGE, { language: locale }, { next: { revalidate: 300 } }),
    c.fetch(INDUSTRY_ITEMS, { language: locale }, { next: { revalidate: 300 } }),
  ]);
  if (!page?.hero?.title || !page.meta?.title || !page.gridTitle || !page.labels) return null;
  if (!Array.isArray(items) || !items.every(validIndustryItem) || !sameIds(items, industrySlugs)) return null;
  return { ...page, items } as IndustriesContent;
}

// ---- About, approach, journeys, insights ------------------------------------------------------
// Documents (one per language): aboutPage, approachPage, journeyPage (with `journey` = "entering" | "growing"),
// insightsPage and article (slug.current = URL slug, `status` = "published" | "draft-preview").
import type { AboutContent, ApproachContent, InsightsContent, JourneyContent, JourneyId, Article } from "./types";

const ABOUT = `*[_type == "aboutPage" && language == $language][0]`;
const APPROACH = `*[_type == "approachPage" && language == $language][0]`;
const JOURNEY = `*[_type == "journeyPage" && journey == $journey && language == $language][0]`;
const INSIGHTS_PAGE = `*[_type == "insightsPage" && language == $language][0]{ review, editorialNotes, meta, hero, categories, labels }`;
const ARTICLES = `*[_type == "article" && language == $language] | order(publishDate desc){
  "id": slug.current, status, review, seo, categoryId, title, excerpt, author, publishDate, heroImage, body,
  "relatedIds": coalesce(relatedIds, []), nextStep }`;

const opts = { next: { revalidate: 300 } };

export async function fetchAboutFromSanity(locale: Locale): Promise<AboutContent | null> {
  const d = await client().fetch(ABOUT, { language: locale }, opts);
  const ok = d?.hero?.title && d.meta?.title && d.founder?.title && Array.isArray(d.founder?.paragraphs) && Array.isArray(d.principles?.items) && d.principles.items.length && d.specialists?.title;
  return ok ? (d as AboutContent) : null;
}

export async function fetchApproachFromSanity(locale: Locale): Promise<ApproachContent | null> {
  const d = await client().fetch(APPROACH, { language: locale }, opts);
  const ok = d?.hero?.title && d.meta?.title && d.labels && Array.isArray(d.steps) && d.steps.length && Array.isArray(d.gates) && d.gates.length === d.steps.length - 1 && d.services && d.scope;
  return ok ? (d as ApproachContent) : null;
}

export async function fetchJourneyFromSanity(locale: Locale, journey: JourneyId): Promise<JourneyContent | null> {
  const d = await client().fetch(JOURNEY, { language: locale, journey }, opts);
  const ok = d?.hero?.title && d.meta?.title && d.audience && d.stagesHeading && d.labels && Array.isArray(d.stages) && d.stages.length && d.scope && d.related && d.cta;
  return ok ? (d as JourneyContent) : null;
}

export async function fetchInsightsFromSanity(locale: Locale): Promise<InsightsContent | null> {
  const c = client();
  const [page, articles] = await Promise.all([
    c.fetch(INSIGHTS_PAGE, { language: locale }, opts),
    c.fetch(ARTICLES, { language: locale }, opts),
  ]);
  if (!page?.hero?.title || !page.meta?.title || !Array.isArray(page.categories) || !page.labels || !Array.isArray(articles)) return null;
  const cats = new Set((page.categories as { id: string }[]).map((x) => x.id));
  const valid = (a: Partial<Article>): a is Article =>
    Boolean(a.id && a.title && a.excerpt && a.categoryId && cats.has(a.categoryId) && a.author?.name && Array.isArray(a.body) && a.nextStep?.cta &&
      (a.status === "published" || a.status === "draft-preview"));
  return articles.every(valid) ? ({ ...page, articles } as InsightsContent) : null;
}
