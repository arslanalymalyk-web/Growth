import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JourneyPage } from "@/components/pages/JourneyPage";
import { getHomeContent, getJourneyContent, getServicesContent, getUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/entering-saudi-arabia">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { data } = await getJourneyContent(lang, "entering");
  return buildMetadata({ locale: lang, path: "/entering-saudi-arabia", title: data.meta.title, description: data.meta.description, index: true });
}

export default async function Page({ params }: PageProps<"/[lang]/entering-saudi-arabia">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ data: journey }, { data: services }, { data: home }] = await Promise.all([getJourneyContent(lang, "entering"), getServicesContent(lang), getHomeContent(lang)]);
  return <JourneyPage ui={getUi(lang)} locale={lang} journey={journey} services={services} home={home} variant="timeline" navId="entering" />;
}
