import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsletterSection } from "@/components/contact/NewsletterSection";
import { InsightsListing } from "@/components/pages/InsightsPages";
import { getHomeContent, getInsightsContent, getUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/insights">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { data } = await getInsightsContent(lang);
  return buildMetadata({ locale: lang, path: "/insights", title: data.meta.title, description: data.meta.description, index: true });
}

export default async function InsightsPage({ params }: PageProps<"/[lang]/insights">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ data: insights }, { data: home }] = await Promise.all([getInsightsContent(lang), getHomeContent(lang)]);
  return <InsightsListing ui={getUi(lang)} locale={lang} insights={insights} home={home} after={<NewsletterSection locale={lang} />} />;
}
