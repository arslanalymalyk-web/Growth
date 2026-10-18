import { getShopRuntime } from "@/shop/load.ts";
import { deriveOrderState, type OrderRoute } from "@/shop/rules.ts";
import type { PaymentStatus } from "@/shop/types.ts";
import { OrderStatusView } from "./OrderStatusView";
import { ShopFrame, loadShopCtx, shopCrumbs } from "./ShopFrame";
import { ShopUnavailable } from "./ShopUnavailable";

type Search = Promise<{ session?: string | string[] }>;
const key = (s: string) => (s === "checkout-expired" ? "checkoutExpired" : s) as "confirmed" | "pending" | "failed" | "cancelled" | "checkoutExpired" | "unverified";

/**
 * Shared by the order-return routes. Payment is verified server-side with the provider (getCheckoutStatus) and the order
 * store says which product it bought; the URL alone can never produce "confirmed". `searchParams` is only awaited when the
 * shop is live/demo, so the unavailable build stays static.
 */
export async function OrderStatusPage({ lang, route, searchParams }: { lang: string; route: OrderRoute; searchParams: Search }) {
  const ctx = await loadShopCtx(lang);
  const rt = await getShopRuntime();
  const crumbs = shopCrumbs(ctx, [{ label: ctx.ui.order.pageTitle.split("|")[0].trim() }]);
  if (ctx.mode === "unavailable") {
    return <ShopFrame ctx={ctx} title={ctx.ui.hero.title} crumbs={crumbs}><ShopUnavailable ui={ctx.ui} locale={ctx.locale} issues={rt.issues} /></ShopFrame>;
  }
  let status: PaymentStatus | "no-session" = "no-session";
  let productId: string | null = null;
  let session: string | null = null;
  const raw = (await searchParams).session;
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s && s.length <= 200 && rt.providers.payment) {
    session = s;
    const r = await rt.providers.payment.getCheckoutStatus(s);
    status = r.ok ? r.value : "unknown";
    if (rt.providers.orders) {
      const o = await rt.providers.orders.getBySession(s);
      productId = o.ok && o.value ? o.value.productId : null;
    }
  }
  const state = deriveOrderState(route, status);
  const product = ctx.shop.products.find((p) => p.id === productId) ?? null;
  return (
    <ShopFrame ctx={ctx} title={ctx.ui.order[key(state)].title} crumbs={crumbs}>
      <OrderStatusView state={state} ui={ctx.ui} locale={ctx.locale} isDemo={ctx.mode === "demo"} product={product} session={state === "confirmed" ? session : null} />
    </ShopFrame>
  );
}
