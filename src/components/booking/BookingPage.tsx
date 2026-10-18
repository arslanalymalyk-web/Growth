import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { realBooking } from "@/booking/config.ts";
import { getBookingRuntime } from "@/booking/load.ts";
import { localizeBooking } from "@/booking/localize.ts";
import type { LocalizedBooking } from "@/booking/types.ts";
import { getBookingUi, getUi } from "@/content";
import type { BookingUi } from "@/content/types";
import { hasLocale, type Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { DemoBanner } from "../scorecard/DemoBanner";
import { PageHero } from "../ui/PageHero";
import { BookingOpeningSoon } from "./BookingOpeningSoon";
import { BookingProgress } from "./BookingProgress";

type Step = "package" | "schedule" | "details" | "checkout";

/**
 * Server wrapper shared by every booking route: hero, demo banner, progress, and the opening-soon state whenever booking
 * is not live. The step view only renders in "live" or development "demo" mode.
 */
export async function BookingPage({ lang, step, title, view }: {
  lang: string;
  step: Step | null;
  title: (ui: BookingUi) => string;
  view: (bk: LocalizedBooking, ui: BookingUi, locale: Locale, isDemo: boolean) => ReactNode;
}) {
  if (!hasLocale(lang)) notFound();
  const ui = getUi(lang);
  const bui = getBookingUi(lang);
  const rt = await getBookingRuntime();
  const crumbs = [
    { label: ui.nav[0].label, href: routes.home(lang) },
    { label: ui.placeholder.booking.title, href: step === "package" ? undefined : routes.booking(lang) },
    ...(step && step !== "package" ? [{ label: bui.progress.steps[step] }] : []),
  ];
  const live = rt.mode !== "opening-soon" && rt.config;
  return (
    <>
      <PageHero ui={ui} review={bui.review} crumbs={crumbs} eyebrow={bui.hero.eyebrow} title={live ? title(bui) : bui.hero.title} intro={bui.hero.intro} />
      {rt.mode === "demo" && <DemoBanner text={bui.demo.banner} />}
      {live ? (
        <>
          {step && <BookingProgress ui={bui} current={step} />}
          {view(localizeBooking(rt.config!, lang), bui, lang, rt.mode === "demo")}
        </>
      ) : (
        <BookingOpeningSoon ui={bui} locale={lang} enquiryEmail={realBooking.enquiryEmail} issues={rt.issues} />
      )}
    </>
  );
}
