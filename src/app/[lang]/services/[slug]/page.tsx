import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/pages/ServicesPages";
import { serviceSlugs } from "@/content/catalog";
import { getHomeContent, getServicesContent, getUi } from "@/content";
import { hasLocale, locales } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";

export const dynamicParams = false; // unknown slugs return 404

export function generateStaticParams() {
  return locales.flatMap((lang) => serviceSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const { data } = await getServicesContent(lang);
  const service = data.items.find((s) => s.id === slug);
  if (!service) return {};
  return buildMetadata({ locale: lang, path: `/services/${slug}`, title: service.seo?.title ?? service.title, description: service.seo?.description ?? service.summary, index: true });
}

export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ data: services }, { data: home }] = await Promise.all([getServicesContent(lang), getHomeContent(lang)]);
  const service = services.items.find((s) => s.id === slug);
  if (!service) notFound();
  return <ServiceDetail ui={getUi(lang)} locale={lang} services={services} home={home} service={service} />;
}
