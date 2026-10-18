import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ShopFrame, loadShopCtx, shopCrumbs } from "@/components/shop/ShopFrame";
import { getHomeContent } from "@/content";
import { hasLocale, locales } from "@/i18n/config";
import { getShopRuntime } from "@/shop/load.ts";
import { localizeShop } from "@/shop/localize.ts";
import { buildMetadata } from "@/seo/metadata.ts";

export const dynamicParams = false; // unknown, draft or hidden slugs return 404

export async function generateStaticParams() {
  const rt = await getShopRuntime();
  const ids = localizeShop(rt.config, rt.mode, "en", rt.sectorSlugs).products.map((p) => p.id);
  return locales.flatMap((lang) => ids.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const ctx = await loadShopCtx(lang);
  const product = ctx.shop.products.find((p) => p.id === slug);
  if (!product) return {};
  return buildMetadata({ locale: lang, path: `/shop/${slug}`, title: product.title, description: product.summary, index: ctx.mode === "live" && !product.isPreview });
}

export default async function Page({ params }: PageProps<"/[lang]/shop/[slug]">) {
  const { lang, slug } = await params;
  const ctx = await loadShopCtx(lang);
  const product = ctx.shop.products.find((p) => p.id === slug);
  if (!product) notFound();
  const { data: home } = await getHomeContent(ctx.locale);
  return (
    <ShopFrame ctx={ctx} title={product.title} intro={product.summary} crumbs={shopCrumbs(ctx, [{ label: product.title }])}>
      <ProductDetail ctx={ctx} product={product} home={home} />
    </ShopFrame>
  );
}
