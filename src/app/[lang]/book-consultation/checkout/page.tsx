import type { Metadata } from "next";
import { BookingPage } from "@/components/booking/BookingPage";
import { CheckoutStep } from "@/components/booking/CheckoutStep";
import { getBookingUi } from "@/content";
import { hasLocale, siteUrl } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/book-consultation/checkout">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { metadataBase: new URL(siteUrl()), title: `${getBookingUi(lang).checkout.title} | Growth Blueprint Advisory`, robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps<"/[lang]/book-consultation/checkout">) {
  const { lang } = await params;
  return <BookingPage lang={lang} step="checkout" title={(u) => u.checkout.title} view={(bk, ui, locale, isDemo) => <CheckoutStep bk={bk} ui={ui} locale={locale} isDemo={isDemo} />} />;
}
