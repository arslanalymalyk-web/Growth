import type { HomeContent, IndustriesContent, IndustryCopy, UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { ConsultationBand } from "../home/HomeSections";
import { ButtonLink } from "../ui/Button";
import { IndustryCard } from "../ui/Cards";
import { Icon } from "../ui/Icons";
import { industryPhotoId } from "@/content/photos";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { SitePhoto } from "../ui/SitePhoto";
import { PageHero } from "../ui/PageHero";
import { Section, SectionHeading } from "../ui/Section";

interface Common { ui: UiStrings; locale: Locale; industries: IndustriesContent; home: HomeContent }

const industriesLabel = (ui: UiStrings) => ui.nav.find((n) => n.id === "industries")!.label;

export function IndustriesOverview({ ui, locale, industries, home }: Common) {
  return (
    <>
      <PageHero
        ui={ui}
        review={industries.review}
        crumbs={[{ label: ui.nav[0].label, href: routes.home(locale) }, { label: industriesLabel(ui) }]}
        eyebrow={industries.hero.eyebrow}
        title={industries.hero.title}
        intro={industries.hero.intro}
        actions={<ButtonLink href={routes.booking(locale)}>{ui.bookConsultation}</ButtonLink>}
        aside={<ImagePlaceholder tone="dark" label={ui.imagePending} className="hidden aspect-[4/3] border border-ivory-50/10 lg:flex" />}
      />
      <Section labelledBy="industries-grid-title" tone="ivory">
        <SectionHeading id="industries-grid-title" eyebrow={industries.hero.eyebrow} title={industries.gridTitle} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.items.map((item) => (
            <IndustryCard key={item.id} href={routes.industry(locale, item.id)} title={item.title} tagline={item.tagline} imageLabel={ui.imagePending} learnMore={ui.learnMore} photoId={industryPhotoId(item.id)} locale={locale} />
          ))}
        </ul>
      </Section>
      <ConsultationBand content={home} ui={ui} locale={locale} />
    </>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-ivory-300 rtl:lg:divide-x-reverse">
      {items.map((t, i) => (
        <li key={t} className="lg:px-6 lg:first:ps-0 lg:last:pe-0">
          <span className="font-display text-3xl text-gold-700" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <p className="mt-3 text-lg text-navy-900">{t}</p>
        </li>
      ))}
    </ol>
  );
}

export function IndustryDetail({ ui, locale, industries, home, industry }: Common & { industry: IndustryCopy }) {
  const { labels } = industries;
  return (
    <>
      <PageHero
        ui={ui}
        review={industry.review}
        crumbs={[
          { label: ui.nav[0].label, href: routes.home(locale) },
          { label: industriesLabel(ui), href: routes.industries(locale) },
          { label: industry.title },
        ]}
        eyebrow={industries.hero.eyebrow}
        title={industry.title}
        tagline={industry.tagline}
        intro={industry.intro}
        actions={<ButtonLink href={routes.booking(locale)}>{ui.bookConsultation}</ButtonLink>}
        aside={industryPhotoId(industry.id) ? (
          <div className="relative hidden aspect-[4/3] overflow-hidden border border-ivory-50/10 lg:block">
            <SitePhoto id={industryPhotoId(industry.id)!} locale={locale} fill priority sizes="(min-width: 1024px) 30rem, 100vw" />
          </div>
        ) : (
          <ImagePlaceholder tone="dark" label={ui.imagePending} className="hidden aspect-[4/3] border border-ivory-50/10 lg:flex" />
        )}
      />

      <Section labelledBy="context-title" tone="ivory">
        <SectionHeading id="context-title" eyebrow={industries.hero.eyebrow} title={labels.context} intro={industry.context} />
      </Section>

      <Section labelledBy="challenges-title" tone="white">
        <SectionHeading id="challenges-title" eyebrow={industries.hero.eyebrow} title={labels.challenges} />
        <div className="mt-10"><NumberedList items={industry.challenges} /></div>
      </Section>

      <Section labelledBy="help-title" tone="navy">
        <SectionHeading id="help-title" tone="dark" eyebrow={industries.hero.eyebrow} title={labels.help} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industry.help.map((t) => (
            <li key={t} className="border border-ivory-50/15 p-6">
              <span className="text-gold-400"><Icon name="check" className="size-6" /></span>
              <p className="mt-4 font-display text-xl text-ivory-50">{t}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="outputs-title" tone="ivory">
        <SectionHeading id="outputs-title" eyebrow={industries.hero.eyebrow} title={labels.outputs} intro={labels.outputsNote} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {industry.outputs.map((o) => (
            <li key={o} className="flex gap-4 border border-ivory-300 bg-ivory-50 p-5">
              <span className="mt-0.5 shrink-0 text-gold-500"><Icon name="check" className="size-6" /></span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="questions-title" tone="ivory-deep">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading id="questions-title" eyebrow={industries.hero.eyebrow} title={labels.questions} />
            <p className="mt-8"><ButtonLink href={routes.scorecard(locale)} variant="outline">{ui.takeScorecard}</ButtonLink></p>
          </div>
          <ul className="space-y-4">
            {industry.questions.map((q) => (
              <li key={q} className="border-s-2 border-gold-500 bg-ivory-50 p-5 text-lg text-navy-900">{q}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section labelledBy="insights-title" tone="ivory">
        <SectionHeading id="insights-title" eyebrow={industries.hero.eyebrow} title={labels.insights} />
        {industry.insights.length ? (
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {industry.insights.map((i) => (
              <li key={i.id}>
                <ImagePlaceholder label={ui.imagePending} className="aspect-[16/10]" />
                <h3 className="mt-4 text-xl text-navy-900">{i.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{i.excerpt}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 max-w-xl border border-dashed border-ivory-300 p-5 text-ink-muted">{labels.insightsEmpty}</p>
        )}
        <p className="mt-10"><ButtonLink href={routes.industries(locale)} variant="outline">{labels.allIndustries}</ButtonLink></p>
      </Section>

      <ConsultationBand content={home} ui={ui} locale={locale} />
    </>
  );
}
