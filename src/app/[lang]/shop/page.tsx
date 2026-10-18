import type { Metadata } from "next";
import { Catalogue } from "@/components/shop/Catalogue";
import { ShopFrame, loadShopCtx, shopCrumbs } from "@/components/shop/ShopFrame";
import { getHomeContent, getShopUi } from "@/content";
import { hasLocale } from "@/i18n/config";
import { getShopRuntime } from "@/shop/load.ts";
import { buildMetadata } from "@/seo/metadata.ts";
import { featureIndexing } from "@/seo/state.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/shop">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const ui = getShopUi(lang);
  const index = (await featureIndexing()).shop;
  return buildMetadata({ locale: lang, path: "/shop", title: ui.meta.title, description: ui.meta.description, index });
}

export default async function Page({ params }: PageProps<"/[lang]/shop">) {
  const { lang } = await params;
  const ctx = await loadShopCtx(lang);
  const rt = await getShopRuntime();
  const { data: home } = await getHomeContent(ctx.locale);
  return (
    <ShopFrame ctx={ctx} title={ctx.ui.hero.title} crumbs={shopCrumbs(ctx)}>
      <Catalogue ctx={ctx} home={home} issues={rt.issues} />
    </ShopFrame>
  );
}
