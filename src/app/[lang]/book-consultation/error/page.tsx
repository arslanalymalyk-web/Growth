import type { Metadata } from "next";
import { StatusPage } from "@/components/booking/StatusPage";
import { getBookingUi } from "@/content";
import { hasLocale, siteUrl } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/book-consultation/error">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { metadataBase: new URL(siteUrl()), title: getBookingUi(lang).status.pageTitle, robots: { index: false, follow: false } };
}

export default async function Page({ params, searchParams }: PageProps<"/[lang]/book-consultation/error">) {
  const { lang } = await params;
  return <StatusPage lang={lang} route="error" searchParams={searchParams} />;
}
