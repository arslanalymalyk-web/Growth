import Link from "next/link";
import type { LegalPageUi, UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { ButtonLink } from "../ui/Button";
import { PageHero } from "../ui/PageHero";
import { Section } from "../ui/Section";

/** Privacy / Terms shell: headings only, each marked as pending review. Contains no legal wording. */
export function LegalPage({ page, ui, locale }: { page: LegalPageUi; ui: UiStrings; locale: Locale }) {
  return (
    <>
      <PageHero
        ui={ui}
        review={page.review}
        crumbs={[{ label: ui.nav[0].label, href: routes.home(locale) }, { label: page.crumb }]}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        intro={page.hero.intro}
      />
      <Section tone="ivory" labelledBy="legal-status-title">
        <div className="max-w-3xl border border-gold-500 bg-ivory-50 p-6 sm:p-8">
          <p className="inline-block border border-gold-700 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold-700">{page.status.badge}</p>
          <h2 id="legal-status-title" className="mt-4 text-2xl text-navy-900">{page.status.title}</h2>
          <p className="mt-3 text-ink-muted">{page.status.body}</p>
        </div>
        <h2 className="mt-12 text-2xl text-navy-900">{page.outline.title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-ink-muted">{page.outline.note}</p>
        <ol className="mt-6 max-w-3xl space-y-4">
          {page.outline.sections.map((s) => (
            <li key={s.id} id={s.id} className="border-s-2 border-gold-500 ps-4">
              <h3 className="text-lg text-navy-900">{s.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{page.outline.pending}</p>
            </li>
          ))}
        </ol>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {page.related.map((r) => (
            <li key={r.target}><Link href={routes[r.target](locale)} className="font-medium text-navy-900 underline underline-offset-4 hover:text-gold-700">{r.label}</Link></li>
          ))}
        </ul>
        <div className="mt-12 max-w-3xl border-t border-ivory-300 pt-8">
          <h2 className="text-xl text-navy-900">{page.contact.title}</h2>
          <p className="mt-2 text-ink-muted">{page.contact.body}</p>
          <div className="mt-5"><ButtonLink href={routes.booking(locale)} variant="outline">{page.contact.cta}</ButtonLink></div>
        </div>
      </Section>
    </>
  );
}
