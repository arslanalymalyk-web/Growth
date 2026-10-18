import type { HomeContent, JourneyContent, ServicesContent, UiStrings } from "@/content/types";
import { serviceCatalog } from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import { hrefFor, routes } from "@/i18n/routes";
import { ButtonLink } from "../ui/Button";
import { ServiceCard } from "../ui/Cards";
import { CtaBand } from "../ui/CtaBand";
import { Icon } from "../ui/Icons";
import { PageHero } from "../ui/PageHero";
import { Section, SectionHeading } from "../ui/Section";

interface Props {
  ui: UiStrings;
  locale: Locale;
  journey: JourneyContent;
  services: ServicesContent;
  home: HomeContent;
  /** "timeline": one stage per row (entering). "grid": parallel focus areas (growing). */
  variant: "timeline" | "grid";
  navId: "entering" | "growing";
}

export function JourneyPage({ ui, locale, journey, services, variant, navId }: Props) {
  const label = ui.journeyNav.find((n) => n.id === navId)!.label;
  const { labels } = journey;
  const related = journey.related.serviceIds.map((id) => services.items.find((s) => s.id === id)).filter((s) => Boolean(s));

  const stageBody = (st: JourneyContent["stages"][number], i: number) => (
    <>
      <h3 className="text-2xl text-navy-900 sm:text-3xl"><span className="sr-only">{labels.stage} {i + 1}: </span>{st.title}</h3>
      <p className="mt-2 text-ink-muted">{st.summary}</p>
      <p className="eyebrow mt-5 text-gold-700">{labels.points}</p>
      <ul className="mt-3 space-y-2 text-sm sm:text-base">
        {st.points.map((pt) => (
          <li key={pt} className="flex gap-3"><span className="mt-1 shrink-0 text-gold-500"><Icon name="check" className="size-5" /></span><span>{pt}</span></li>
        ))}
      </ul>
      {st.links.length ? (
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          {st.links.map((l) => (
            <li key={l.label}><ButtonLink href={hrefFor(locale, l.target)} variant="ghost-gold">{l.label}</ButtonLink></li>
          ))}
        </ul>
      ) : null}
    </>
  );

  return (
    <>
      <PageHero
        ui={ui}
        review={journey.review}
        crumbs={[{ label: ui.nav[0].label, href: routes.home(locale) }, { label }]}
        eyebrow={journey.hero.eyebrow}
        title={journey.hero.title}
        intro={journey.hero.intro}
        actions={<ButtonLink href={routes.booking(locale)}>{ui.bookConsultation}</ButtonLink>}
      />

      <Section labelledBy="audience-title" tone="ivory">
        <h2 id="audience-title" className="text-3xl text-navy-900">{journey.audience.title}</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {journey.audience.items.map((t) => (
            <li key={t} className="flex gap-3 border border-ivory-300 bg-ivory-50 p-5"><span className="mt-0.5 shrink-0 text-gold-500"><Icon name="check" className="size-6" /></span><span>{t}</span></li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="stages-title" tone="ivory-deep">
        <SectionHeading id="stages-title" eyebrow={journey.stagesHeading.eyebrow} title={journey.stagesHeading.title} intro={journey.stagesHeading.intro} />
        {variant === "timeline" ? (
          <ol className="mt-12 space-y-0">
            {journey.stages.map((st, i) => (
              <li key={st.id} className="relative grid gap-4 pb-10 ps-16 last:pb-0 sm:ps-20">
                {i < journey.stages.length - 1 && <span aria-hidden="true" className="absolute start-6 top-14 bottom-0 w-px bg-gold-500/50 sm:start-8 sm:top-16" />}
                <span aria-hidden="true" className="absolute start-0 top-0 flex size-12 items-center justify-center border border-gold-500 bg-ivory-50 text-gold-700 sm:size-16"><Icon name={st.icon} className="size-6 sm:size-8" /></span>
                <div>{stageBody(st, i)}</div>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {journey.stages.map((st, i) => (
              <li key={st.id} className="border border-ivory-300 bg-ivory-50 p-6 sm:p-7">
                <span className="text-gold-500"><Icon name={st.icon} className="size-10" /></span>
                <div className="mt-4">{stageBody(st, i)}</div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section labelledBy="scope-title" tone="ivory">
        <div className="max-w-3xl border-s-2 border-gold-500 bg-ivory-50 p-6 sm:p-8">
          <h2 id="scope-title" className="text-2xl text-navy-900">{journey.scope.title}</h2>
          <p className="mt-3 text-ink-muted">{journey.scope.body}</p>
        </div>
      </Section>

      <Section labelledBy="related-title" tone="white">
        <h2 id="related-title" className="text-3xl text-navy-900">{journey.related.title}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((s) => (
            <ServiceCard key={s!.id} href={routes.service(locale, s!.id)} icon={serviceCatalog.find((c) => c.id === s!.id)!.icon} title={s!.title} summary={s!.summary} learnMore={ui.learnMore} />
          ))}
        </ul>
      </Section>

      <CtaBand eyebrow={journey.cta.eyebrow} title={journey.cta.title} body={journey.cta.body} primary={{ label: journey.cta.ctaLabel, href: routes.booking(locale) }} secondary={{ label: ui.takeScorecard, href: routes.scorecard(locale) }} />
    </>
  );
}
