"use server";

import { getShopRuntime } from "./load.ts";
import { issueDownloadLink, prepareProductCheckout, type FlowResult } from "./flow.ts";
import type { Locale } from "./types.ts";

/**
 * Server actions. They carry NO personal data: only a product id, an opaque payment-session id and a locale. Buyer
 * details never leave the browser in this stage.
 */
export async function startProductCheckout(input: { productId: string; locale: Locale }): Promise<FlowResult<{ checkoutUrl: string }>> {
  const rt = await getShopRuntime();
  return prepareProductCheckout({ mode: rt.mode, config: rt.config, providers: rt.providers, sectorSlugs: rt.sectorSlugs }, input);
}

/** Issues a fresh short-lived signed download link for a payment the provider has verified as paid. */
export async function requestDownloadLink(input: { session: string; locale: Locale }): Promise<FlowResult<{ url: string; expiresAt: string; expiresInSeconds: number }>> {
  const rt = await getShopRuntime();
  return issueDownloadLink({ mode: rt.mode, config: rt.config, providers: rt.providers, sectorSlugs: rt.sectorSlugs }, input);
}
