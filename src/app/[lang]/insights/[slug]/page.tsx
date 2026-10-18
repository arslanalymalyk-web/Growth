import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/pages/InsightsPages";
import { getInsightsContent, getTranslatedArticleSlugs, getUi } from "@/content";
import { hasLocale, locales, siteUrl } from "@/i18n/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { confirmedBusiness } from "@/seo/business.ts";
import { articleJsonLd } from "@/seo/jsonld.ts";
import { buildMetadata } from "@/seo/metadata.ts";

export const dynamicParams = false; // unknown or unpublished slugs return 404

export async function generateStaticParams() {
  const perLocale = await Promise.all(locales.map(async (lang) => (await getInsightsContent(lang)).data.articles.map((a) => ({ lang, slug: a.id }))));
  return perLocale.flat();
}

export async function generateMetadata({ params }: PageProps<"/[lang]/insights/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const [{ data }, translated] = await Promise.all([getInsightsContent(lang), getTranslatedArticleSlugs()]);
  const article = data.articles.find((a) => a.id === slug);
  if (!article) return {};
  return buildMetadata({
    locale: lang, path: `/insights/${slug}`, title: article.seo?.title ?? article.title, description: article.seo?.description ?? article.excerpt,
    index: article.status !== "draft-preview", availableIn: translated.includes(slug) ? undefined : [lang], type: "article", publishedTime: article.publishDate,
  });
}

export default async function ArticleRoute({ params }: PageProps<"/[lang]/insights/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const { data: insights } = await getInsightsContent(lang);
  const article = insights.articles.find((a) => a.id === slug);
  if (!article) notFound();
  const ld = article.status === "draft-preview" ? null : articleJsonLd(siteUrl(), { locale: lang, slug, headline: article.title, description: article.excerpt, datePublished: article.publishDate, imageUrl: article.heroImage?.url }, confirmedBusiness);
  return (
    <>
      <JsonLd data={ld} />
      <ArticlePage ui={getUi(lang)} locale={lang} insights={insights} article={article} />
    </>
  );
}
