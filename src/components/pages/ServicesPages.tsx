import type { HomeContent, ServiceCopy, ServicesContent, UiStrings } from "@/content/types";
import { serviceCatalog } from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { ConsultationBand } from "../home/HomeSections";
import { ApproachSteps } from "../home/ApproachSteps";
import { ButtonLink } from "../ui/Button";
import { ServiceCard } from "../ui/Cards";
import { Icon } from "../ui/Icons";
import { PageHero } from "../ui/PageHero";
import { Section, SectionHeading } from "../ui/Section";

interface Common { ui: UiStrings; locale: Locale; services: ServicesContent; home: HomeContent }

const iconFor = (id: string) => serviceCatalog.find((s) => s.id === id)!.icon;

export function ServicesOverview({ ui, locale, services, home }: Common) {
  const catalogGroup = (id: string) => serviceCatalog.find((s) => s.id === id)!.group;
  return (
    <>
      <PageHero
        ui={ui}
        review={services.review}
        crumbs={[{ label: ui.nav[0].label, href: routes.home(locale) }, { label: ui.nav.find((n) => n.id === "services")!.label }]}
        eyebrow={services.hero.eyebrow}
        title={services.hero.title}
        intro={services.hero.intro}
        actions={<ButtonLink href={routes.booking(locale)}>{ui.bookConsultation}</ButtonLink>}
      />
      {(["enter", "grow"] as const).map((group, i) => (
        <Section key={group} labelledBy={`group-${group}`} tone={i === 0 ? "ivory" : "white"}>
          <SectionHeading id={`group-${group}`} eyebrow={services.hero.eyebrow} title={services.groups[group].title} intro={services.groups[group].intro} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.items.filter((s) => catalogGroup(s.id) === group).map((s) => (
              <ServiceCard key={s.id} href={routes.service(locale, s.id)} icon={iconFor(s.id)} title={s.title} summary={s.summary} learnMore={ui.learnMore} />
            ))}
          </ul>
        </Section>
      ))}
      <Section labelledBy="journey-title" tone="ivory-deep">
        <SectionHeading id="journey-title" eyebrow={services.journey.eyebrow} title={services.journey.title} intro={services.journey.intro} />
        <ApproachSteps steps={home.approach.steps} />
      </Section>
      <ConsultationBand content={home} ui={ui} locale={locale} />
    </>
  );
}

function Bullets({ items, icon = "check" }: { items: string[]; icon?: "check" }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-ink">
          <span className="mt-1 shrink-0 text-gold-500"><Icon name={icon} className="size-5" /></span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function ServiceDetail({ ui, locale, services, home, service }: Common & { service: ServiceCopy }) {
  const entry = serviceCatalog.find((s) => s.id === service.id)!;
  const related = entry.relatedIds.map((id) => services.items.find((s) => s.id === id)).filter((s): s is ServiceCopy => Boolean(s));
  const { labels } = services;
  return (
    <>
      <PageHero
        ui={ui}
        review={service.review}
        crumbs={[
          { label: ui.nav[0].label, href: routes.home(locale) },
          { label: ui.nav.find((n) => n.id === "services")!.label, href: routes.services(locale) },
          { label: service.title },
        ]}
        eyebrow={services.hero.eyebrow}
        title={service.title}
        intro={service.intro}
        actions={<ButtonLink href={routes.booking(locale)}>{ui.bookConsultation}</ButtonLink>}
      />
      <Section labelledBy="audience-title" tone="ivory">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 id="audience-title" className="text-3xl text-navy-900">{labels.audience}</h2>
            <Bullets items={service.audience} />
          </div>
          <div>
            <h2 className="text-3xl text-navy-900">{labels.topics}</h2>
            <Bullets items={service.topics} />
          </div>
        </div>
      </Section>
      <Section labelledBy="outputs-title" tone="ivory-deep">
        <SectionHeading id="outputs-title" eyebrow={services.hero.eyebrow} title={labels.outputs} intro={labels.outputsNote} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {service.outputs.map((o) => (
            <li key={o} className="flex gap-4 border border-ivory-300 bg-ivory-50 p-5">
              <span className="mt-0.5 shrink-0 text-gold-500"><Icon name="check" className="size-6" /></span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section labelledBy="related-title" tone="ivory">
        <SectionHeading id="related-title" eyebrow={services.hero.eyebrow} title={labels.related} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((s) => (
            <ServiceCard key={s.id} href={routes.service(locale, s.id)} icon={iconFor(s.id)} title={s.title} summary={s.summary} learnMore={ui.learnMore} />
          ))}
        </ul>
        <p className="mt-8"><ButtonLink href={routes.services(locale)} variant="outline">{labels.allServices}</ButtonLink></p>
      </Section>
      <ConsultationBand content={home} ui={ui} locale={locale} />
    </>
  );
}
