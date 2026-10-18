import type { ApproachContent, HomeContent, UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { hrefFor, routes } from "@/i18n/routes";
import { ConsultationBand } from "../home/HomeSections";
import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icons";
import { PageHero } from "../ui/PageHero";
import { Section, SectionHeading } from "../ui/Section";

export function ApproachPage({ ui, locale, approach, home }: { ui: UiStrings; locale: Locale; approach: ApproachContent; home: HomeContent }) {
  const label = ui.nav.find((n) => n.id === "approach")!.label;
  const { labels } = approach;
  return (
    <>
      <PageHero
        ui={ui}
        review={approach.review}
        crumbs={[{ label: ui.nav[0].label, href: routes.home(locale) }, { label }]}
        eyebrow={approach.hero.eyebrow}
        title={approach.hero.title}
        intro={approach.hero.intro}
      />

      <Section labelledBy="journey-title" tone="ivory">
        <SectionHeading id="journey-title" eyebrow={approach.intro.eyebrow} title={approach.intro.title} intro={approach.intro.body} />
        <ol className="mt-12 space-y-4">
          {approach.steps.flatMap((step, i) => {
            const gate = approach.gates[i];
            const items = [
              <li key={step.id} className="grid gap-4 border border-ivory-300 bg-ivory-50 p-6 sm:grid-cols-[auto_1fr] sm:gap-6 sm:p-8">
                <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                  <span className="flex size-12 items-center justify-center border border-gold-500 font-display text-2xl text-gold-700" aria-hidden="true">{i + 1}</span>
                  <span className="text-gold-500"><Icon name={step.icon} className="size-10" /></span>
                </div>
                <div>
                  <h3 className="text-3xl text-navy-900"><span className="sr-only">{labels.step} {i + 1}: </span>{step.title}</h3>
                  <p className="mt-2 text-lg text-ink-muted">{step.summary}</p>
                  <p className="eyebrow mt-5 text-gold-700">{labels.points}</p>
                  <ul className="mt-3 space-y-2">
                    {step.points.map((pt) => (
                      <li key={pt} className="flex gap-3"><span className="mt-1 shrink-0 text-gold-500"><Icon name="check" className="size-5" /></span><span>{pt}</span></li>
                    ))}
                  </ul>
                </div>
              </li>,
            ];
            if (gate) {
              items.push(
                <li key={gate.id} className="border border-dashed border-gold-500 bg-ivory-200 p-5 sm:ms-16 sm:p-6">
                  <p className="eyebrow flex items-center gap-2 text-gold-700"><Icon name="flag" className="size-4" />{labels.gate} {i + 1}</p>
                  <h3 className="mt-2 text-2xl text-navy-900">{gate.title}</h3>
                  <p className="mt-2 text-ink-muted">{gate.body}</p>
                  <p className="mt-3 text-sm"><span className="font-semibold text-navy-900">{labels.keyOutput}:</span> {gate.keyOutput}</p>
                </li>,
              );
            }
            return items;
          })}
        </ol>
      </Section>

      <Section labelledBy="services-link-title" tone="ivory-deep">
        <SectionHeading id="services-link-title" eyebrow={approach.services.eyebrow} title={approach.services.title} intro={approach.services.intro} />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {approach.services.links.map((l, i) => (
            <ButtonLink key={l.label} href={hrefFor(locale, l.target)} variant={i === 0 ? "primary" : "outline"}>{l.label}</ButtonLink>
          ))}
        </div>
      </Section>

      <Section labelledBy="scope-title" tone="ivory">
        <div className="max-w-3xl border-s-2 border-gold-500 bg-ivory-50 p-6 sm:p-8">
          <h2 id="scope-title" className="text-2xl text-navy-900">{approach.scope.title}</h2>
          <p className="mt-3 text-ink-muted">{approach.scope.body}</p>
        </div>
      </Section>

      <ConsultationBand content={home} ui={ui} locale={locale} />
    </>
  );
}
