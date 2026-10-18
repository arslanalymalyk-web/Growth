import type { HomeContent, UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import Link from "next/link";
import { ButtonLink } from "../ui/Button";
import { ApproachSteps } from "./ApproachSteps";
import { Icon } from "../ui/Icons";
import { industryPhotoId } from "@/content/photos";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { SitePhoto } from "../ui/SitePhoto";
import { Container, Section, SectionHeading } from "../ui/Section";

interface P { content: HomeContent; ui: UiStrings; locale: Locale }

export function Hero({ content, ui, locale }: P) {
  const { hero } = content;
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy-900 text-ivory-50">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <SitePhoto id="skylineDusk" fill decorative priority sizes="100vw" position="50% 30%" />
        <div className="hero-scrim absolute inset-0" />
      </div>
      <Container className="flex items-center py-20 sm:py-28 lg:min-h-[36rem] lg:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow eyebrow-line text-gold-400">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-4 text-[2.5rem] text-ivory-50 sm:text-6xl lg:text-[4.25rem]">{hero.headline}</h1>
          <span aria-hidden="true" className="gold-rule" />
          <p className="mt-6 max-w-xl text-lg text-ivory-50/85">{hero.subheadline}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={routes.booking(locale)}>{hero.primaryCtaLabel}</ButtonLink>
            <ButtonLink href={routes.services(locale)} variant="outline-light" arrow={false}>{hero.secondaryCtaLabel}</ButtonLink>
          </div>
          <p className="mt-6">
            <ButtonLink href={routes.scorecard(locale)} variant="ghost-gold" className="!text-gold-300 hover:!text-ivory-50">{ui.takeScorecard}</ButtonLink>
          </p>
        </div>
      </Container>
    </section>
  );
}

export function Pathways({ content, locale }: P) {
  return (
    <section aria-label={content.pathways.map((p) => p.title).join(" / ")} className="border-b border-ivory-300 bg-ivory-50">
      <Container className="grid md:grid-cols-2 md:divide-x md:divide-ivory-300 rtl:md:divide-x-reverse">
        {content.pathways.map((p, i) => (
          <div key={p.id} className={`flex gap-5 py-9 md:py-12 ${i === 0 ? "md:pe-10" : "md:ps-10"} ${i === 0 ? "border-b border-ivory-300 md:border-b-0" : ""}`}>
            <span className="text-gold-500"><Icon name={p.icon} className="size-12 shrink-0" /></span>
            <div>
              <h2 className="text-2xl text-navy-900">{p.title}</h2>
              <p className="mt-2 max-w-sm text-ink-muted">{p.body}</p>
              <p className="mt-4"><ButtonLink href={p.id === "enter" ? routes.entering(locale) : routes.growing(locale)} variant="ghost-gold" className="eyebrow">{p.linkLabel}</ButtonLink></p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

export function Services({ content, ui, locale }: P) {
  const { services } = content;
  return (
    <Section id="services" labelledBy="services-title" tone="ivory">
      <SectionHeading id="services-title" eyebrow={services.eyebrow} title={services.title} intro={services.intro} />
      <ul className="mt-12 grid gap-px border border-ivory-300 bg-ivory-300 sm:grid-cols-2 lg:grid-cols-4">
        {services.items.map((s) => (
          <li key={s.id} className="relative bg-ivory-50 p-6 sm:p-7">
            <span className="text-gold-500"><Icon name={s.icon} className="size-10" /></span>
            <h3 className="mt-5 text-xl text-navy-900"><Link href={routes.service(locale, s.id)} className="after:absolute after:inset-0 hover:text-gold-700">{s.title}</Link></h3>
            <p className="mt-2 text-sm text-ink-muted">{s.description}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8"><ButtonLink href={routes.services(locale)} variant="outline">{ui.viewAllServices}</ButtonLink></p>
    </Section>
  );
}

export function Industries({ content, ui, locale }: P) {
  const { industries } = content;
  return (
    <Section id="industries" labelledBy="industries-title" tone="navy">
      <SectionHeading id="industries-title" tone="dark" eyebrow={industries.eyebrow} title={industries.title} intro={industries.intro} />
      <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {industries.items.map((item) => (
          <li key={item.id} className="relative">
            {industryPhotoId(item.id) ? (
              <div className="relative aspect-[4/3] overflow-hidden border border-ivory-50/10">
                <SitePhoto id={industryPhotoId(item.id)!} locale={locale} fill sizes="(min-width: 1024px) 18rem, 50vw" />
              </div>
            ) : (
              <ImagePlaceholder tone="dark" label={ui.imagePending} className="aspect-[4/3] border border-ivory-50/10" />
            )}
            <h3 className="mt-3 text-xl text-ivory-50 sm:text-2xl"><Link href={routes.industry(locale, item.id)} className="after:absolute after:inset-0 hover:text-gold-300">{item.title}</Link></h3>
          </li>
        ))}
      </ul>
      <p className="mt-8"><ButtonLink href={routes.industries(locale)} variant="outline-light">{ui.viewAllIndustries}</ButtonLink></p>
    </Section>
  );
}

export function Approach({ content, ui, locale }: P) {
  const { approach } = content;
  return (
    <Section id="approach" labelledBy="approach-title" tone="ivory">
      <SectionHeading id="approach-title" eyebrow={approach.eyebrow} title={approach.title} intro={approach.intro} />
      <ApproachSteps steps={approach.steps} />
      <p className="mt-10"><ButtonLink href={routes.approach(locale)} variant="outline">{ui.exploreApproach}</ButtonLink></p>
    </Section>
  );
}

export function Founder({ content, ui, locale }: P) {
  const { founder } = content;
  return (
    <Section id="about" labelledBy="about-title" tone="ivory-deep">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <ImagePlaceholder label={ui.imagePending} className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[4/3]" />
        <div>
          <SectionHeading id="about-title" eyebrow={founder.eyebrow} title={founder.title} intro={founder.body} />
          <p className="mt-8"><ButtonLink href={routes.about(locale)} variant="outline">{ui.ourStory}</ButtonLink></p>
        </div>
      </div>
    </Section>
  );
}

export function Insights({ content, ui, locale }: P) {
  const { insights } = content;
  return (
    <Section id="insights" labelledBy="insights-title" tone="ivory">
      <SectionHeading id="insights-title" eyebrow={insights.eyebrow} title={insights.title} intro={insights.intro || undefined} />
      <ul className="mt-12 grid gap-8 md:grid-cols-3">
        {insights.items.map((item) => (
          <li key={item.id}>
            <ImagePlaceholder label={ui.imagePending} className="aspect-[16/10]" />
            <div className="mt-4 flex items-start gap-3">
              <h3 className="text-xl text-navy-900">{item.title}</h3>
              {item.isSample && <span className="mt-1 shrink-0 border border-gold-700 px-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-700">{ui.sampleBadge}</span>}
            </div>
            <p className="mt-2 text-sm text-ink-muted">{item.excerpt}</p>
          </li>
        ))}
      </ul>
      <p className="mt-10"><ButtonLink href={routes.insights(locale)} variant="outline">{ui.viewAllInsights}</ButtonLink></p>
    </Section>
  );
}

export function ScorecardBand({ content, locale }: P) {
  const { scorecard } = content;
  return (
    <section aria-labelledby="scorecard-title" className="bg-navy-800 text-ivory-50">
      <Container className="grid items-center gap-8 py-14 md:grid-cols-[auto_1fr] md:gap-12 lg:py-16">
        <span className="hidden size-20 items-center justify-center border border-gold-400 text-gold-400 md:flex"><Icon name="check" className="size-10" /></span>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold-400">{scorecard.eyebrow}</p>
            <h2 id="scorecard-title" className="mt-3 text-3xl sm:text-4xl">{scorecard.title}</h2>
            <p className="mt-3 text-ivory-50/85">{scorecard.body}</p>
          </div>
          <ButtonLink href={routes.scorecard(locale)} className="shrink-0">{scorecard.ctaLabel}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export function ConsultationBand({ content, locale }: P) {
  const { consultation } = content;
  return (
    <Section labelledBy="consultation-title" tone="navy" className="relative isolate overflow-hidden !py-14 sm:!py-16">
      <div aria-hidden="true" className="lattice absolute inset-0 -z-10 opacity-60" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeading id="consultation-title" tone="dark" eyebrow={consultation.eyebrow} title={consultation.title} intro={consultation.body} />
        <ButtonLink href={routes.booking(locale)} className="shrink-0 self-start lg:self-center">{consultation.ctaLabel}</ButtonLink>
      </div>
    </Section>
  );
}
