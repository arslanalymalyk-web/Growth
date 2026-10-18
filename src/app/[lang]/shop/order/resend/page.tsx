import type { Metadata } from "next";
import { ResendForm } from "@/components/shop/ResendForm";
import { ShopFrame, loadShopCtx, shopCrumbs } from "@/components/shop/ShopFrame";
import { ShopUnavailable } from "@/components/shop/ShopUnavailable";
import { getShopUi } from "@/content";
import { hasLocale, siteUrl } from "@/i18n/config";
import { getShopRuntime } from "@/shop/load.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/order/resend">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { metadataBase: new URL(siteUrl()), title: `${getShopUi(lang).resend.title} | Growth Blueprint Advisory`, robots: { index: false, follow: false } };
}

export default async function Page({ params }: PageProps<"/[lang]/shop/order/resend">) {
  const { lang } = await params;
  const ctx = await loadShopCtx(lang);
  const rt = await getShopRuntime();
  const crumbs = shopCrumbs(ctx, [{ label: ctx.ui.resend.title }]);
  return (
    <ShopFrame ctx={ctx} title={ctx.mode === "unavailable" ? ctx.ui.hero.title : ctx.ui.resend.title} crumbs={crumbs}>
      {ctx.mode === "unavailable" ? <ShopUnavailable ui={ctx.ui} locale={ctx.locale} issues={rt.issues} /> : <ResendForm ui={ctx.ui} locale={ctx.locale} isDemo={ctx.mode === "demo"} />}
    </ShopFrame>
  );
}
