import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScorecardIntro } from "@/components/scorecard/ScorecardIntro";
import { getScorecardUi, getUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { getScorecard } from "@/scorecard/load.ts";
import { buildMetadata } from "@/seo/metadata.ts";
import { featureIndexing } from "@/seo/state.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/readiness-scorecard">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const ui = getScorecardUi(lang);
  const index = (await featureIndexing()).scorecard;
  return buildMetadata({ locale: lang, path: "/readiness-scorecard", title: ui.meta.title, description: ui.meta.description, index });
}

export default async function Page({ params }: PageProps<"/[lang]/readiness-scorecard">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { mode, config, issues } = await getScorecard();
  return <ScorecardIntro ui={getUi(lang)} sui={getScorecardUi(lang)} locale={lang} mode={mode} minutes={config?.estimatedMinutes ?? 10} issues={issues} />;
}
