import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JourneyPage } from "@/components/pages/JourneyPage";
import { getHomeContent, getJourneyContent, getServicesContent, getUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/growing-in-saudi-arabia">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { data } = await getJourneyContent(lang, "growing");
  return buildMetadata({ locale: lang, path: "/growing-in-saudi-arabia", title: data.meta.title, description: data.meta.description, index: true });
}

export default async function Page({ params }: PageProps<"/[lang]/growing-in-saudi-arabia">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ data: journey }, { data: services }, { data: home }] = await Promise.all([getJourneyContent(lang, "growing"), getServicesContent(lang), getHomeContent(lang)]);
  return <JourneyPage ui={getUi(lang)} locale={lang} journey={journey} services={services} home={home} variant="grid" navId="growing" />;
}
