import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApproachPage } from "@/components/pages/ApproachPage";
import { getApproachContent, getHomeContent, getUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/our-approach">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { data } = await getApproachContent(lang);
  return buildMetadata({ locale: lang, path: "/our-approach", title: data.meta.title, description: data.meta.description, index: true });
}

export default async function Page({ params }: PageProps<"/[lang]/our-approach">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ data: approach }, { data: home }] = await Promise.all([getApproachContent(lang), getHomeContent(lang)]);
  return <ApproachPage ui={getUi(lang)} locale={lang} approach={approach} home={home} />;
}
