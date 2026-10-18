import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustriesOverview } from "@/components/pages/IndustriesPages";
import { getHomeContent, getIndustriesContent, getUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/industries">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { data } = await getIndustriesContent(lang);
  return buildMetadata({ locale: lang, path: "/industries", title: data.meta.title, description: data.meta.description, index: true });
}

export default async function IndustriesPage({ params }: PageProps<"/[lang]/industries">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ data: industries }, { data: home }] = await Promise.all([getIndustriesContent(lang), getHomeContent(lang)]);
  return <IndustriesOverview ui={getUi(lang)} locale={lang} industries={industries} home={home} />;
}
