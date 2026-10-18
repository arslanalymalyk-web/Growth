import Link from "next/link";
import type { UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import type { ReactNode } from "react";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Section";
import { LanguageSwitch } from "./LanguageSwitch";
import { SkylineStrip } from "./SkylineStrip";
import { Wordmark } from "./Wordmark";

export function SiteFooter({ ui, locale, articleSlugs, newsletterSlot }: { ui: UiStrings; locale: Locale; articleSlugs: string[]; newsletterSlot?: ReactNode }) {
  return (
    <footer className="bg-navy-950 text-ivory-50">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Wordmark ui={ui} locale={locale} />
          <p className="mt-5 max-w-sm text-sm text-navy-300">{ui.footer.tagline}</p>
          <div className="mt-5 h-px w-12 bg-gold-400" aria-hidden="true" />
        </div>
        <nav aria-label={ui.footer.navigation}>
          <p className="eyebrow text-gold-400">{ui.footer.navigation}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {ui.nav.map((item) => (
              <li key={item.id}>
                <Link href={routes.nav(locale, item)} className="text-ivory-50/85 hover:text-gold-300">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={ui.footer.journeys}>
          <p className="eyebrow text-gold-400">{ui.footer.journeys}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {ui.journeyNav.map((item) => (
              <li key={item.id}>
                <Link href={routes.nav(locale, item)} className="text-ivory-50/85 hover:text-gold-300">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow text-gold-400">{ui.footer.getInTouch}</p>
          <div className="mt-4 flex flex-col items-start gap-5">
            <ButtonLink href={routes.booking(locale)} variant="outline-light">{ui.bookConsultation}</ButtonLink>
            <Link href={routes.contact(locale)} className="text-sm text-ivory-50/85 underline underline-offset-4 hover:text-gold-300">{ui.footer.contact}</Link>
            <LanguageSwitch locale={locale} label={ui.languageLabelFooter} articleSlugs={articleSlugs} />
          </div>
        </div>
      </Container>
      {newsletterSlot && <div className="border-t border-ivory-50/10"><Container className="py-8">{newsletterSlot}</Container></div>}
      <SkylineStrip />
      <div className="border-t border-gold-400/40">
        <Container className="flex flex-col gap-3 py-5 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p><span dir="ltr">© {new Date().getFullYear()} Growth Blueprint Advisory.</span> <span>{ui.footer.rights}</span></p>
          <nav aria-label={ui.footer.legalLabel}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li><Link href={routes.privacy(locale)} className="underline underline-offset-4 hover:text-gold-300">{ui.footer.privacy}</Link></li>
              <li><Link href={routes.terms(locale)} className="underline underline-offset-4 hover:text-gold-300">{ui.footer.terms}</Link></li>
            </ul>
          </nav>
        </Container>
      </div>
    </footer>
  );
}
