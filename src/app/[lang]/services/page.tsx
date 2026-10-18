import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicesOverview } from "@/components/pages/ServicesPages";
import { getHomeContent, getServicesContent, getUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { data } = await getServicesContent(lang);
  return buildMetadata({ locale: lang, path: "/services", title: data.meta.title, description: data.meta.description, index: true });
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ data: services }, { data: home }] = await Promise.all([getServicesContent(lang), getHomeContent(lang)]);
  return <ServicesOverview ui={getUi(lang)} locale={lang} services={services} home={home} />;
}
