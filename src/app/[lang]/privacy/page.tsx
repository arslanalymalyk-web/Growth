import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/contact/LegalPage";
import { getLegalUi, getUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";
import { featureIndexing } from "@/seo/state.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const page = getLegalUi(lang).privacy;
  const index = (await featureIndexing()).privacy;
  return buildMetadata({ locale: lang, path: "/privacy", title: page.meta.title, description: page.meta.description, index });
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LegalPage page={getLegalUi(lang).privacy} ui={getUi(lang)} locale={lang} />;
}
