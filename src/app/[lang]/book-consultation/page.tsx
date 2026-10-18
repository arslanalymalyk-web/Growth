import type { Metadata } from "next";
import { BookingPage } from "@/components/booking/BookingPage";
import { PackageChooser } from "@/components/booking/PackageChooser";
import { getBookingUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { buildMetadata } from "@/seo/metadata.ts";
import { featureIndexing } from "@/seo/state.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/book-consultation">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const ui = getBookingUi(lang);
  const index = (await featureIndexing()).booking;
  return buildMetadata({ locale: lang, path: "/book-consultation", title: ui.meta.title, description: ui.meta.description, index });
}

export default async function Page({ params }: PageProps<"/[lang]/book-consultation">) {
  const { lang } = await params;
  return <BookingPage lang={lang} step="package" title={(u) => u.hero.title} view={(bk, ui, locale, isDemo) => <PackageChooser bk={bk} ui={ui} locale={locale} isDemo={isDemo} />} />;
}
