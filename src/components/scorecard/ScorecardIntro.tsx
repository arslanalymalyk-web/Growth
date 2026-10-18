import type { ScorecardUi, UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";
import { routes } from "@/i18n/routes";
import type { ScorecardMode, ValidationIssue } from "@/scorecard/types.ts";
import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icons";
import { PageHero } from "../ui/PageHero";
import { Section } from "../ui/Section";
import { DemoBanner } from "./DemoBanner";
import { OpeningSoon } from "./OpeningSoon";

interface Props { ui: UiStrings; sui: ScorecardUi; locale: Locale; mode: ScorecardMode; minutes: number; issues: ValidationIssue[] }

/** Introduction page. Offers "Start" only when a live (approved) or development demo configuration is active. */
export function ScorecardIntro({ ui, sui, locale, mode, minutes, issues }: Props) {
  const startable = mode !== "opening-soon";
  return (
    <>
      <PageHero
        ui={ui}
        review={sui.review}
        crumbs={[{ label: ui.nav[0].label, href: routes.home(locale) }, { label: ui.placeholder.scorecard.title }]}
        eyebrow={sui.hero.eyebrow}
        title={sui.hero.title}
        intro={sui.hero.intro}
      />
      {mode === "demo" && <DemoBanner text={sui.demo.banner} />}

      <Section tone="ivory" labelledBy="expect-title">
        <h2 id="expect-title" className="text-3xl text-navy-900">{sui.overview.title}</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {sui.overview.items.map((it) => (
            <li key={it.title} className="flex gap-4 border border-ivory-300 bg-ivory-50 p-5">
              <span className="mt-0.5 shrink-0 text-gold-500"><Icon name="check" className="size-6" /></span>
              <div><h3 className="text-xl text-navy-900">{it.title}</h3><p className="mt-1 text-sm text-ink-muted">{it.body}</p></div>
            </li>
          ))}
        </ul>
      </Section>

      {startable ? (
        <Section tone="ivory-deep" labelledBy="before-title">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 id="before-title" className="text-3xl text-navy-900">{sui.before.title}</h2>
              <ul className="mt-5 list-disc space-y-2 ps-6 text-ink">
                {sui.before.items.map((t) => <li key={t}>{fill(t, { n: minutes })}</li>)}
              </ul>
              <p className="mt-8"><ButtonLink href={routes.scorecardAssessment(locale)}>{sui.before.startCta}</ButtonLink></p>
            </div>
            <aside aria-labelledby="consent-title" className="border border-ivory-300 bg-ivory-50 p-6">
              <h2 id="consent-title" className="text-2xl text-navy-900">{sui.consentBox.title}</h2>
              <p className="mt-3 text-ink-muted">{sui.consentBox.processing}</p>
              <p className="mt-2 text-ink-muted">{sui.consentBox.newsletter}</p>
              <p className="mt-3 text-sm font-medium text-gold-700">{sui.consentBox.privacy}</p>
            </aside>
          </div>
        </Section>
      ) : (
        <OpeningSoon ui={sui} locale={locale} issues={issues} />
      )}
    </>
  );
}
