import type { Locale } from "@/i18n/config";
import {
  fetchAboutFromSanity, fetchApproachFromSanity, fetchHomeFromSanity, fetchIndustriesFromSanity, fetchInsightsFromSanity,
  fetchJourneyFromSanity, fetchServicesFromSanity, isSanityConfigured,
} from "./sanity";
import { sampleAbout } from "./sample/about";
import { sampleApproach } from "./sample/approach";
import { sampleHome } from "./sample/home";
import { sampleInsights } from "./sample/insights";
import { sampleJourneys } from "./sample/journeys";
import { sampleIndustries } from "./sample/industries";
import { sampleBookingUi } from "./sample/booking";
import { sampleContactUi } from "./sample/contact";
import { sampleLegalUi } from "./sample/legal";
import { sampleScorecardUi } from "./sample/scorecard";
import { sampleServices } from "./sample/services";
import { sampleShopUi } from "./sample/shop";
import { sampleUi } from "./sample/ui";
import type { ContactUi, LegalUi, ShopUi, BookingUi, ScorecardUi, AboutContent, ApproachContent, Article, HomeContent, IndustriesContent, InsightsContent, JourneyContent, JourneyId, Loaded, ServicesContent, UiStrings } from "./types";

/** Enquiry and newsletter interface copy (consent wording here is DRAFT only). */
export const getContactUi = (locale: Locale): ContactUi => sampleContactUi[locale];

/** Privacy and Terms page shells (no legal wording). */
export const getLegalUi = (locale: Locale): LegalUi => sampleLegalUi[locale];

/** Sector-brief shop interface copy (no products, prices or terms). */
export const getShopUi = (locale: Locale): ShopUi => sampleShopUi[locale];

/** Booking journey interface copy (no prices, terms or provider details). */
export const getBookingUi = (locale: Locale): BookingUi => sampleBookingUi[locale];

/** Scorecard journey interface copy (no assessment content). Kept in code, like other interface strings. */
export const getScorecardUi = (locale: Locale): ScorecardUi => sampleScorecardUi[locale];

/** Interface strings (navigation, footer, labels) live in code so they can never be broken by CMS edits. */
export function getUi(locale: Locale): UiStrings {
  return sampleUi[locale];
}

/** Homepage content: Sanity when configured and valid, otherwise local sample content. */
export async function getHomeContent(locale: Locale): Promise<Loaded<HomeContent>> {
  if (isSanityConfigured()) {
    try {
      const data = await fetchHomeFromSanity(locale);
      if (data) return { data, source: "sanity", locale };
      console.warn(`[content] No valid Sanity homePage for "${locale}"; using sample content.`);
    } catch (error) {
      console.warn("[content] Sanity request failed; using sample content.", error);
    }
  }
  return { data: sampleHome[locale], source: "sample", locale };
}

async function fromSanityOrSample<T>(label: string, locale: Locale, fetcher: (l: Locale) => Promise<T | null>, sample: T): Promise<Loaded<T>> {
  if (isSanityConfigured()) {
    try {
      const data = await fetcher(locale);
      if (data) return { data, source: "sanity", locale };
      console.warn(`[content] No complete, valid Sanity ${label} for "${locale}"; using sample content.`);
    } catch (error) {
      console.warn(`[content] Sanity request for ${label} failed; using sample content.`, error);
    }
  }
  return { data: sample, source: "sample", locale };
}

export const getServicesContent = (locale: Locale): Promise<Loaded<ServicesContent>> =>
  fromSanityOrSample("services", locale, fetchServicesFromSanity, sampleServices[locale]);

export const getIndustriesContent = (locale: Locale): Promise<Loaded<IndustriesContent>> =>
  fromSanityOrSample("industries", locale, fetchIndustriesFromSanity, sampleIndustries[locale]);

export const getAboutContent = (locale: Locale): Promise<Loaded<AboutContent>> =>
  fromSanityOrSample("about", locale, fetchAboutFromSanity, sampleAbout[locale]);

export const getApproachContent = (locale: Locale): Promise<Loaded<ApproachContent>> =>
  fromSanityOrSample("approach", locale, fetchApproachFromSanity, sampleApproach[locale]);

export const getJourneyContent = (locale: Locale, journey: JourneyId): Promise<Loaded<JourneyContent>> =>
  fromSanityOrSample(`journey "${journey}"`, locale, (l) => fetchJourneyFromSanity(l, journey), sampleJourneys[locale][journey]);

/**
 * Draft previews are visible only outside production, or when SHOW_DRAFT_PREVIEWS=1 (layout testing).
 * In production an article must have status "published" in the content data to appear or to resolve at its URL.
 */
export function draftPreviewsVisible(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFT_PREVIEWS === "1";
}
export const isVisibleArticle = (a: Article): boolean => a.status === "published" || draftPreviewsVisible();

/** Insights content with unpublished (draft-preview) articles removed unless previews are enabled. */
export async function getInsightsContent(locale: Locale): Promise<Loaded<InsightsContent>> {
  const loaded = await fromSanityOrSample("insights", locale, fetchInsightsFromSanity, sampleInsights[locale]);
  return { ...loaded, data: { ...loaded.data, articles: loaded.data.articles.filter(isVisibleArticle) } };
}

/** Article slugs visible in every language; the language switch only keeps an article page when it exists in both. */
export async function getTranslatedArticleSlugs(): Promise<string[]> {
  const [en, ar] = await Promise.all([getInsightsContent("en"), getInsightsContent("ar")]);
  const arIds = new Set(ar.data.articles.map((a) => a.id));
  return en.data.articles.map((a) => a.id).filter((id) => arIds.has(id));
}

export type { HomeContent, IndustriesContent, ServicesContent, UiStrings } from "./types";
