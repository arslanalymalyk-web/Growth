"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { ButtonLink } from "../ui/Button";
import { MenuIcon } from "../ui/Icons";
import { Container } from "../ui/Section";
import { LanguageSwitch } from "./LanguageSwitch";
import { Wordmark } from "./Wordmark";

export function SiteHeader({ ui, locale, articleSlugs }: { ui: UiStrings; locale: Locale; articleSlugs: string[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const navLinks = ui.nav.map((item) => (
    <li key={item.id}>
      <Link
        href={routes.nav(locale, item)}
        onClick={() => setOpen(false)}
        className="block py-3 text-[0.95rem] text-ivory-50/90 hover:text-gold-300 lg:py-1 lg:text-[0.8rem]"
      >
        {item.label}
      </Link>
    </li>
  ));

  return (
    <header className="sticky top-0 z-40 border-b border-ivory-50/10 bg-navy-900 text-ivory-50">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Wordmark ui={ui} locale={locale} />

        <nav aria-label={ui.navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-7">{navLinks}</ul>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <LanguageSwitch locale={locale} label={ui.languageLabel} articleSlugs={articleSlugs} />
          <ButtonLink href={routes.booking(locale)} className="!min-h-10 !px-4 !py-2 !text-xs">{ui.bookConsultation}</ButtonLink>
        </div>

        <button
          type="button"
          className="-me-2 inline-flex size-12 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? ui.menuClose : ui.menuOpen}
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon open={open} />
        </button>
      </Container>

      {open && (
        <div id="mobile-menu" className="border-t border-ivory-50/10 bg-navy-900 lg:hidden">
          <Container className="pb-6 pt-2">
            <nav aria-label={ui.navLabel}>
              <ul className="divide-y divide-ivory-50/10">{navLinks}</ul>
            </nav>
            <div className="mt-4 flex flex-col gap-5">
              <LanguageSwitch locale={locale} label={ui.languageLabel} articleSlugs={articleSlugs} />
              <ButtonLink href={routes.booking(locale)} className="w-full">{ui.bookConsultation}</ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
