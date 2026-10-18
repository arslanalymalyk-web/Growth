import { validateShopConfig } from "./validate.ts";
import type { ShopConfig, ShopMode, ShopProviders, ValidationIssue } from "./types.ts";

export interface ShopModeInput {
  nodeEnv: string | undefined;
  demoFlag: string | undefined;
  /** The real, client-owned configuration (draft until approved). */
  real: ShopConfig;
  /** Installed provider adapters (all null until the client has approved accounts). */
  providers: ShopProviders;
  /** The demo fixture. Only ever loaded in development; null elsewhere. */
  demo: ShopConfig | null;
}
export interface ShopModeResult { mode: ShopMode; config: ShopConfig; issues: ValidationIssue[] }

/**
 * What the public site shows:
 *  - "live": ONLY a valid, approved, non-demo configuration whose payment, storage AND order-store providers are
 *    installed and match the configured provider ids.
 *  - "demo": only when NODE_ENV === "development" AND SHOP_DEMO === "1" (never in production).
 *  - "unavailable": everything else. Approved products may be read but cannot be bought; drafts stay hidden.
 */
export function resolveShopMode({ nodeEnv, demoFlag, real, providers, demo }: ShopModeInput): ShopModeResult {
  const issues = validateShopConfig(real);
  const check = (name: "payment" | "storage" | "orders", installed: { id: string } | null) => {
    if (!installed) issues.push({ code: `${name}-provider-not-installed`, message: `No ${name} adapter is installed.` });
    else if (installed.id !== real.providers[name]) issues.push({ code: `${name}-provider-mismatch`, message: `Installed ${name} adapter does not match the configured id.` });
  };
  check("payment", providers.payment); check("storage", providers.storage); check("orders", providers.orders);

  if (issues.length === 0) return { mode: "live", config: real, issues };
  if (nodeEnv === "development" && demoFlag === "1" && demo && demo.isDemo) return { mode: "demo", config: demo, issues };
  return { mode: "unavailable", config: real, issues };
}
