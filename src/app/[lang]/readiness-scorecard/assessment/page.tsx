import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssessmentFlow } from "@/components/scorecard/AssessmentFlow";
import { DemoBanner } from "@/components/scorecard/DemoBanner";
import { OpeningSoon } from "@/components/scorecard/OpeningSoon";
import { PageHero } from "@/components/ui/PageHero";
import { getScorecardUi, getUi } from "@/content";
import { hasLocale, siteUrl } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { getScorecard } from "@/scorecard/load.ts";
import { localizeScorecard } from "@/scorecard/localize.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/readiness-scorecard/assessment">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { metadataBase: new URL(siteUrl()), title: getScorecardUi(lang).assessment.title, robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps<"/[lang]/readiness-scorecard/assessment">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const ui = getUi(lang);
  const sui = getScorecardUi(lang);
  const { mode, config, issues } = await getScorecard();
  const crumbs = [
    { label: ui.nav[0].label, href: routes.home(lang) },
    { label: ui.placeholder.scorecard.title, href: routes.scorecard(lang) },
    { label: sui.assessment.title },
  ];
  return (
    <>
      <PageHero ui={ui} review={sui.review} crumbs={crumbs} eyebrow={sui.hero.eyebrow} title={sui.assessment.title} intro={sui.hero.intro} />
      {mode === "opening-soon" || !config ? (
        <OpeningSoon ui={sui} locale={lang} issues={issues} />
      ) : (
        <>
          {mode === "demo" && <DemoBanner text={sui.demo.banner} />}
          <AssessmentFlow sc={localizeScorecard(config, lang)} ui={sui} locale={lang} />
        </>
      )}
    </>
  );
}
