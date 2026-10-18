import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutPage } from "@/components/pages/AboutPage";
import { getAboutContent, getHomeContent, getUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { data } = await getAboutContent(lang);
  return buildMetadata({ locale: lang, path: "/about", title: data.meta.title, description: data.meta.description, index: true });
}

export default async function Page({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ data: about }, { data: home }] = await Promise.all([getAboutContent(lang), getHomeContent(lang)]);
  return <AboutPage ui={getUi(lang)} locale={lang} about={about} home={home} />;
}
