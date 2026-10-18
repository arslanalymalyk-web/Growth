import { industrySlugs } from "../content/catalog.ts";
import { realShop } from "./config.ts";
import { resolveShopMode, type ShopModeResult } from "./mode.ts";
import { installedShopProviders } from "./providers.ts";
import { fetchProductsFromSanity } from "./sanity.ts";
import type { ShopConfig, ShopProviders } from "./types.ts";

export interface ShopRuntime extends ShopModeResult {
  /** Server-only. NEVER pass to client components. */
  providers: ShopProviders;
  sectorSlugs: string[];
  demo: { copy: typeof import("./demo.ts").demoCheckoutCopy; fileText: string; secret: string } | null;
}

/**
 * Server-side loader. The demo fixture (fake products, checkout, storage and file) is imported ONLY when
 * NODE_ENV === "development"; the check is inlined at build time, so it is dead-code-eliminated from production bundles.
 */
export async function getShopRuntime(): Promise<ShopRuntime> {
  let demo: ShopConfig | null = null;
  let demoProviders: ShopProviders | null = null;
  let demoExtras: ShopRuntime["demo"] = null;
  if (process.env.NODE_ENV === "development") {
    const m = await import("./demo.ts");
    demo = m.demoShop;
    demoProviders = { payment: m.demoPayment, storage: m.demoStorage, orders: m.demoOrders };
    demoExtras = { copy: m.demoCheckoutCopy, fileText: m.demoFileText, secret: m.DEMO_SIGNING_SECRET };
  }
  // Products may come from the client's Sanity project when configured; everything else stays in code.
  let real = realShop;
  try {
    const products = await fetchProductsFromSanity();
    if (products) real = { ...realShop, products };
  } catch (error) {
    console.warn("[shop] Sanity request failed; using in-code (empty) catalogue.", error);
  }
  const result = resolveShopMode({ nodeEnv: process.env.NODE_ENV, demoFlag: process.env.SHOP_DEMO, real, providers: installedShopProviders, demo });
  const isDemo = result.mode === "demo" && demoProviders;
  return { ...result, providers: isDemo ? demoProviders! : installedShopProviders, sectorSlugs: industrySlugs, demo: isDemo ? demoExtras : null };
}
