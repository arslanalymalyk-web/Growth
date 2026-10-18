import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Approach, ConsultationBand, Founder, Hero, Industries, Insights, Pathways, ScorecardBand, Services } from "@/components/home/HomeSections";
import { getHomeContent, getUi } from "@/content";
import { hasLocale, siteUrl } from "@/i18n/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { confirmedBusiness } from "@/seo/business.ts";
import { organizationJsonLd, websiteJsonLd } from "@/seo/jsonld.ts";
import { buildMetadata } from "@/seo/metadata.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { data } = await getHomeContent(lang);
  return buildMetadata({ locale: lang, path: "", title: data.meta.title, description: data.meta.description, index: true });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { data: content } = await getHomeContent(lang);
  const ui = getUi(lang);
  const p = { content, ui, locale: lang };

  const origin = siteUrl();
  return (
    <>
      <JsonLd data={organizationJsonLd(confirmedBusiness, origin)} />
      <JsonLd data={websiteJsonLd(confirmedBusiness, origin, lang)} />
      <Hero {...p} />
      <Pathways {...p} />
      <Services {...p} />
      <Industries {...p} />
      <Approach {...p} />
      <Founder {...p} />
      <Insights {...p} />
      <ScorecardBand {...p} />
      <ConsultationBand {...p} />
    </>
  );
}
