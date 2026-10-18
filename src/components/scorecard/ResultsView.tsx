"use client";

import { useRouter } from "next/navigation";
import type { ScorecardUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { computeScore } from "@/scorecard/scoring.ts";
import { scorecardStore } from "@/scorecard/store.ts";
import type { LocalizedScorecard } from "@/scorecard/types.ts";
import { TrackOnMount } from "../analytics/AnalyticsEvents";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Section";
import { DemoBanner } from "./DemoBanner";
import { useScorecard } from "./useScorecard";

const btn = "inline-flex min-h-12 items-center justify-center border border-navy-900 px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-ivory-50";

/**
 * Layout for the tailored report. Every figure and sentence comes from the (client-approved) configuration and the
 * user's own answers: nothing is invented here. With no completed assessment it shows an empty state only.
 */
export function ResultsView({ sc, ui, locale }: { sc: LocalizedScorecard; ui: ScorecardUi; locale: Locale }) {
  const state = useScorecard();
  const router = useRouter();
  const r = ui.results;

  if (!state.completed) {
    return (
      <Container className="py-14">
        <div className="max-w-2xl border border-dashed border-ivory-300 p-6">
          <h2 className="text-2xl text-navy-900">{r.none.title}</h2>
          <p className="mt-2 text-ink-muted">{r.none.body}</p>
          <p className="mt-6"><ButtonLink href={routes.scorecardAssessment(locale)}>{r.none.cta}</ButtonLink></p>
        </div>
      </Container>
    );
  }

  const score = computeScore(sc, state.answers);
  const band = sc.bands.find((b) => b.id === score.bandId);
  const overall = score.bandId ? sc.report.overallByBand[score.bandId] : undefined;
  const pct = (n: number) => Math.round(n);

  return (
    <>
      <TrackOnMount event="scorecard_complete" />
      {sc.isDemo && <DemoBanner text={ui.demo.resultBanner} />}
      <Container className="py-10 sm:py-14">
        <h2 className="text-3xl text-navy-900 sm:text-4xl">{sc.report.title}</h2>
        <p className="mt-3 max-w-2xl text-ink-muted">{sc.report.intro}</p>

        <section aria-labelledby="overall-title" className="mt-10 border border-gold-500 bg-ivory-50 p-6 sm:p-8">
          <h3 id="overall-title" className="eyebrow text-gold-700">{r.overall}</h3>
          {score.overallPercent !== null && band && overall ? (
            <div className="mt-4 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
              <p className="font-display text-6xl text-navy-900"><span className="sr-only">{r.scoreLabel}: </span>{pct(score.overallPercent)}%</p>
              <div>
                <p className="text-2xl text-navy-900">{band.title}</p>
                <p className="mt-1 text-ink-muted">{band.summary}</p>
                <p className="mt-3 font-medium text-navy-900">{overall.headline}</p>
                <p className="mt-1 text-ink-muted">{overall.body}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-ink-muted">{r.none.title}</p>
          )}
        </section>

        <section aria-labelledby="sections-title" className="mt-10">
          <h3 id="sections-title" className="text-2xl text-navy-900">{r.sections}</h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {sc.sections.map((s) => {
              const ss = score.sections.find((x) => x.sectionId === s.id);
              const note = ss?.bandId ? sc.report.sectionByBand[s.id]?.[ss.bandId] : undefined;
              const sband = sc.bands.find((b) => b.id === ss?.bandId);
              return (
                <li key={s.id} className="border border-ivory-300 bg-ivory-50 p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="text-xl text-navy-900">{s.title}</h4>
                    {ss?.percent != null && <span className="font-semibold text-navy-900">{pct(ss.percent)}%</span>}
                  </div>
                  {ss?.percent != null && (
                    <div role="progressbar" aria-label={s.title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct(ss.percent)} className="mt-3 h-2 bg-ivory-300">
                      <div className="h-full bg-gold-500" style={{ width: `${ss.percent}%` }} />
                    </div>
                  )}
                  {sband && <p className="mt-3 text-sm font-medium text-gold-700">{sband.title}</p>}
                  {note && <p className="mt-1 text-sm text-ink-muted">{note}</p>}
                </li>
              );
            })}
          </ul>
        </section>

        {overall && overall.nextSteps.length > 0 && (
          <section aria-labelledby="next-title" className="mt-10">
            <h3 id="next-title" className="text-2xl text-navy-900">{r.nextSteps}</h3>
            <ol className="mt-4 list-decimal space-y-2 ps-6 text-ink">{overall.nextSteps.map((n) => <li key={n}>{n}</li>)}</ol>
          </section>
        )}
        <p className="mt-8 text-ink-muted">{sc.report.closing}</p>
        <p className="mt-6 text-sm text-ink-muted">{r.localNote}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" className={btn} onClick={() => { scorecardStore.setStep(sc.sections.length); router.push(routes.scorecardAssessment(locale)); }}>{r.editAnswers}</button>
          <button type="button" className={btn} onClick={() => { scorecardStore.reset(); router.push(routes.scorecardAssessment(locale)); }}>{r.startOver}</button>
        </div>
      </Container>

      <section aria-labelledby="results-cta-title" className="bg-navy-900 text-ivory-50">
        <Container className="flex flex-col gap-6 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="results-cta-title" className="text-3xl">{r.cta.title}</h2>
            <p className="mt-2 text-ivory-50/85">{r.cta.body}</p>
          </div>
          <ButtonLink href={routes.booking(locale)} className="shrink-0 self-start lg:self-center">{r.cta.label}</ButtonLink>
        </Container>
      </section>
    </>
  );
}
