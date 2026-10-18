import { FILE_EXTENSIONS, type Locale, type Product, type Result, type ShopConfig, type ShopMode, type ShopProviders } from "./types.ts";
import { productState } from "./rules.ts";

/** Server-side flows, written against the provider interfaces so they can be tested with stubs. They carry NO personal data. */
export type FlowErrorCode = "unavailable" | "invalid-request" | "not-enabled" | "not-paid" | "not-found" | "limit-reached" | "provider-error";
export interface FlowError { code: FlowErrorCode; message: string }
export type FlowResult<T> = { ok: true; value: T } | { ok: false; error: FlowError };
const fail = (code: FlowErrorCode, message: string): { ok: false; error: FlowError } => ({ ok: false, error: { code, message } });
const fromProvider = <T>(r: Result<T>): { ok: false; error: FlowError } | null => (r.ok ? null : fail(r.error.code === "unavailable" ? "unavailable" : "provider-error", r.error.message));

export interface FlowDeps { mode: ShopMode; config: ShopConfig; providers: ShopProviders; sectorSlugs: string[] }
const isLocale = (v: unknown): v is Locale => v === "en" || v === "ar";

/**
 * Prepares the handoff to the provider's hosted checkout. In this stage it can run only in the development demo (the
 * simulated provider) and sends NO buyer details: a placeholder address is used. A live checkout, which would create a
 * provider session with the buyer's email, must be added only after the client approves the providers and the processing,
 * so it intentionally returns "not-enabled".
 */
export async function prepareProductCheckout(d: FlowDeps, input: { productId: string; locale: Locale }): Promise<FlowResult<{ checkoutUrl: string }>> {
  if (d.mode === "unavailable" || !d.providers.payment) return fail("unavailable", "The shop is not available.");
  if (d.mode !== "demo") return fail("not-enabled", "Live checkout is not enabled in this stage.");
  const product = d.config.products.find((p) => p.id === input?.productId);
  if (!product || !isLocale(input.locale) || productState(product, d.mode, d.sectorSlugs) === "hidden") return fail("invalid-request", "Invalid request.");
  const r = await d.providers.payment.createCheckoutSession({
    productId: product.id,
    orderRef: "demo-order",
    returnUrls: { success: "", pending: "", failed: "" },
    locale: input.locale,
    customer: { email: "demo@example.invalid" },
  });
  const e = fromProvider(r);
  return e ?? { ok: true, value: { checkoutUrl: (r as { ok: true; value: { checkoutUrl: string } }).value.checkoutUrl } };
}

/**
 * Order-validated download: payment must be VERIFIED paid by the provider, the order store must say which product it
 * bought, the product must be purchasable, the per-order limit must not be exhausted, and only then does the private
 * storage issue a fresh short-lived signed link. The file key never reaches the browser.
 */
export async function issueDownloadLink(d: FlowDeps, input: { session: string; locale: Locale }): Promise<FlowResult<{ url: string; expiresAt: string; expiresInSeconds: number }>> {
  const { payment, storage, orders } = d.providers;
  if (d.mode === "unavailable" || !payment || !storage || !orders) return fail("unavailable", "The shop is not available.");
  if (typeof input?.session !== "string" || input.session.length === 0 || input.session.length > 200 || !isLocale(input.locale)) return fail("invalid-request", "Invalid request.");

  const status = await payment.getCheckoutStatus(input.session);
  const se = fromProvider(status);
  if (se) return se;
  if (!status.ok || status.value !== "paid") return fail("not-paid", "Payment has not been verified.");

  const order = await orders.getBySession(input.session);
  const oe = fromProvider(order);
  if (oe) return oe;
  if (!order.ok || !order.value) return fail("not-found", "No order found.");

  const product: Product | undefined = d.config.products.find((p) => p.id === order.value!.productId);
  if (!product?.file || productState(product, d.mode, d.sectorSlugs) === "hidden") return fail("not-found", "Product not found.");

  const max = d.config.delivery.maxDownloadsPerOrder;
  if (max !== null && order.value.downloadsUsed >= max) return fail("limit-reached", "Download limit reached.");
  const ttl = d.config.delivery.linkValiditySeconds;
  if (ttl === null) return fail("unavailable", "Delivery is not configured.");

  const link = await storage.createSignedDownload({ fileKey: product.file.key, expiresInSeconds: ttl, filename: `${product.id}.${FILE_EXTENSIONS[product.file.format]}`, orderRef: order.value.orderRef });
  const le = fromProvider(link);
  if (le) return le;
  const rec = await orders.recordDownload(order.value.orderRef);
  const re = fromProvider(rec);
  if (re) return re;
  const v = (link as { ok: true; value: { url: string; expiresAt: string } }).value;
  return { ok: true, value: { url: v.url, expiresAt: v.expiresAt, expiresInSeconds: ttl } };
}
