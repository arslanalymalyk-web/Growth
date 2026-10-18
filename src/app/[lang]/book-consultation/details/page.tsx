import type { Metadata } from "next";
import { BookingPage } from "@/components/booking/BookingPage";
import { DetailsStep } from "@/components/booking/DetailsStep";
import { getBookingUi } from "@/content";
import { hasLocale, siteUrl } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/book-consultation/details">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { metadataBase: new URL(siteUrl()), title: `${getBookingUi(lang).details.title} | Growth Blueprint Advisory`, robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps<"/[lang]/book-consultation/details">) {
  const { lang } = await params;
  return <BookingPage lang={lang} step="details" title={(u) => u.details.title} view={(bk, ui, locale) => <DetailsStep bk={bk} ui={ui} locale={locale} />} />;
}
