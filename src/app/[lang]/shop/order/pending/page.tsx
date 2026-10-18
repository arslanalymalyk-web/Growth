import type { Metadata } from "next";
import { OrderStatusPage } from "@/components/shop/OrderStatusPage";
import { getShopUi } from "@/content";
import { hasLocale, siteUrl } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/order/pending">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { metadataBase: new URL(siteUrl()), title: getShopUi(lang).order.pageTitle, robots: { index: false, follow: false } };
}

export default async function Page({ params, searchParams }: PageProps<"/[lang]/shop/order/pending">) {
  const { lang } = await params;
  return <OrderStatusPage lang={lang} route="pending" searchParams={searchParams} />;
}
