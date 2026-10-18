import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getShopRuntime } from "@/shop/load.ts";
import { localizeShop } from "@/shop/localize.ts";
import type { LocalizedShop, ShopMode } from "@/shop/types.ts";
import { getIndustriesContent, getShopUi, getUi } from "@/content";
import type { ShopUi, UiStrings } from "@/content/types";
import { hasLocale, type Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { DemoBanner } from "../scorecard/DemoBanner";
import { PageHero } from "../ui/PageHero";
import type { Crumb } from "../ui/Breadcrumbs";

export interface ShopCtx {
  mode: ShopMode;
  shop: LocalizedShop;
  ui: ShopUi;
  siteUi: UiStrings;
  locale: Locale;
  sectorTitles: Record<string, string>;
}

/** Server-side context for every shop page. Nothing provider-related (and no file key) reaches client components. */
export async function loadShopCtx(lang: string): Promise<ShopCtx> {
  if (!hasLocale(lang)) notFound();
  const rt = await getShopRuntime();
  const industries = (await getIndustriesContent(lang)).data.items;
  return {
    mode: rt.mode,
    shop: localizeShop(rt.config, rt.mode, lang, rt.sectorSlugs),
    ui: getShopUi(lang),
    siteUi: getUi(lang),
    locale: lang,
    sectorTitles: Object.fromEntries(industries.map((i) => [i.id, i.title])),
  };
}

export function shopCrumbs(ctx: ShopCtx, tail: Crumb[] = []): Crumb[] {
  return [{ label: ctx.siteUi.nav[0].label, href: routes.home(ctx.locale) }, { label: ctx.ui.crumb, href: tail.length ? routes.shop(ctx.locale) : undefined }, ...tail];
}

/** Hero + demo banner shared by every shop page. */
export function ShopFrame({ ctx, title, intro, crumbs, children }: { ctx: ShopCtx; title: string; intro?: string; crumbs: Crumb[]; children: ReactNode }) {
  return (
    <>
      <PageHero ui={ctx.siteUi} review={ctx.ui.review} crumbs={crumbs} eyebrow={ctx.ui.hero.eyebrow} title={title} intro={intro ?? ctx.ui.hero.intro} />
      {ctx.mode === "demo" && <DemoBanner text={ctx.ui.demo.banner} />}
      {children}
    </>
  );
}
