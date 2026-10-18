import type { AboutContent, HomeContent, UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { ConsultationBand } from "../home/HomeSections";
import { Icon } from "../ui/Icons";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { PageHero } from "../ui/PageHero";
import { Section, SectionHeading } from "../ui/Section";

export function AboutPage({ ui, locale, about, home }: { ui: UiStrings; locale: Locale; about: AboutContent; home: HomeContent }) {
  const label = ui.nav.find((n) => n.id === "about")!.label;
  return (
    <>
      <PageHero
        ui={ui}
        review={about.review}
        crumbs={[{ label: ui.nav[0].label, href: routes.home(locale) }, { label }]}
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        intro={about.hero.intro}
      />

      <Section labelledBy="founder-title" tone="ivory">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Approved founder photography has not been supplied: placeholder only. */}
          <ImagePlaceholder label={ui.imagePending} className="aspect-[4/5] w-full max-w-md lg:max-w-none" />
          <div>
            <p className="eyebrow text-gold-700">{about.founder.eyebrow}</p>
            <h2 id="founder-title" className="mt-3 text-3xl text-navy-900 sm:text-4xl">{about.founder.title}</h2>
            <div className="mt-6 space-y-4 text-ink-muted">
              {about.founder.paragraphs.map((t) => <p key={t}>{t}</p>)}
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="principles-title" tone="ivory-deep">
        <SectionHeading id="principles-title" eyebrow={about.principles.eyebrow} title={about.principles.title} intro={about.principles.intro} />
        <ul className="mt-12 grid gap-px border border-ivory-300 bg-ivory-300 sm:grid-cols-2 lg:grid-cols-4">
          {about.principles.items.map((p) => (
            <li key={p.id} className="bg-ivory-50 p-6 sm:p-7">
              <span className="text-gold-500"><Icon name={p.icon} className="size-11" /></span>
              <h3 className="mt-5 text-2xl text-navy-900">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="specialists-title" tone="ivory">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-gold-700">{about.specialists.eyebrow}</p>
            <h2 id="specialists-title" className="mt-3 text-3xl text-navy-900 sm:text-4xl">{about.specialists.title}</h2>
            <div className="mt-6 space-y-4 text-ink-muted">
              {about.specialists.paragraphs.map((t) => <p key={t}>{t}</p>)}
            </div>
          </div>
          <ImagePlaceholder label={ui.imagePending} className="aspect-[16/10] w-full" />
        </div>
      </Section>

      <ConsultationBand content={home} ui={ui} locale={locale} />
    </>
  );
}
