import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryDetail } from "@/components/pages/IndustriesPages";
import { industrySlugs } from "@/content/catalog";
import { getHomeContent, getIndustriesContent, getUi } from "@/content";
import { hasLocale, locales } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";

export const dynamicParams = false; // unknown slugs return 404

export function generateStaticParams() {
  return locales.flatMap((lang) => industrySlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/industries/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const { data } = await getIndustriesContent(lang);
  const industry = data.items.find((s) => s.id === slug);
  if (!industry) return {};
  return buildMetadata({ locale: lang, path: `/industries/${slug}`, title: industry.seo?.title ?? industry.title, description: industry.seo?.description ?? industry.tagline, index: true });
}

export default async function IndustryPage({ params }: PageProps<"/[lang]/industries/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ data: industries }, { data: home }] = await Promise.all([getIndustriesContent(lang), getHomeContent(lang)]);
  const industry = industries.items.find((s) => s.id === slug);
  if (!industry) notFound();
  return <IndustryDetail ui={getUi(lang)} locale={lang} industries={industries} home={home} industry={industry} />;
}
