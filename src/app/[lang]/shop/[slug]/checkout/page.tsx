import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { ShopFrame, loadShopCtx, shopCrumbs } from "@/components/shop/ShopFrame";
import { ShopUnavailable } from "@/components/shop/ShopUnavailable";
import { getShopUi } from "@/content";
import { hasLocale, locales, siteUrl } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { getShopRuntime } from "@/shop/load.ts";
import { localizeShop } from "@/shop/localize.ts";

export const dynamicParams = false;

export async function generateStaticParams() {
  const rt = await getShopRuntime();
  const ids = localizeShop(rt.config, rt.mode, "en", rt.sectorSlugs).products.map((p) => p.id);
  return locales.flatMap((lang) => ids.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/[slug]/checkout">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { metadataBase: new URL(siteUrl()), title: `${getShopUi(lang).checkout.title} | Growth Blueprint Advisory`, robots: { index: false, follow: false }, alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) } };
}

export default async function Page({ params }: PageProps<"/[lang]/shop/[slug]/checkout">) {
  const { lang, slug } = await params;
  const ctx = await loadShopCtx(lang);
  const product = ctx.shop.products.find((p) => p.id === slug);
  if (!product) notFound();
  const rt = await getShopRuntime();
  const crumbs = shopCrumbs(ctx, [{ label: product.title, href: routes.product(ctx.locale, product.id) }, { label: ctx.ui.checkout.title }]);
  // A product that is visible but not purchasable (providers not configured) never gets a checkout form.
  const buyable = product.state === "purchasable" || product.state === "preview";
  return (
    <ShopFrame ctx={ctx} title={buyable ? ctx.ui.checkout.title : ctx.ui.hero.title} crumbs={crumbs}>
      {buyable ? <CheckoutForm product={product} ui={ctx.ui} locale={ctx.locale} terms={ctx.shop.terms} /> : <ShopUnavailable ui={ctx.ui} locale={ctx.locale} issues={rt.issues} />}
    </ShopFrame>
  );
}
