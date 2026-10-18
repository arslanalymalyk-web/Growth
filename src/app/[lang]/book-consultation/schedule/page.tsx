import type { Metadata } from "next";
import { BookingPage } from "@/components/booking/BookingPage";
import { ScheduleStep } from "@/components/booking/ScheduleStep";
import { getBookingUi } from "@/content";
import { hasLocale, siteUrl } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/book-consultation/schedule">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { metadataBase: new URL(siteUrl()), title: `${getBookingUi(lang).schedule.title} | Growth Blueprint Advisory`, robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps<"/[lang]/book-consultation/schedule">) {
  const { lang } = await params;
  return <BookingPage lang={lang} step="schedule" title={(u) => u.schedule.title} view={(bk, ui, locale) => <ScheduleStep bk={bk} ui={ui} locale={locale} />} />;
}
