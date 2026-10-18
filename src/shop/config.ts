import type { ShopConfig } from "./types.ts";

/**
 * THE REAL SECTOR-BRIEF SHOP CONFIGURATION: DRAFT / EMPTY.
 *
 * The client has not supplied any brief, description, price, currency, licence terms, refund policy, payment gateway or
 * file-storage provider. Do not invent them. There are intentionally NO products here. When the client supplies approved
 * material:
 *   1. add each brief (bilingual copy, price in minor units + ISO currency, sector, preview image, file metadata with a
 *      PRIVATE storage key, licence and refund terms), reviewed and approved per product (status "published"),
 *      either here or in the client's Sanity project (products are content; orders and buyers are never stored there),
 *   2. decide delivery.linkValiditySeconds (short-lived) and maxDownloadsPerOrder,
 *   3. paste client-approved purchase terms, purchase-communications notice, optional marketing consent and privacy notice,
 *   4. create client-owned payment, private-storage and order-store accounts, install the adapters in providers.ts and set
 *      providers.*, then mark review approved and status "approved".
 * Until validateShopConfig() is clean AND all three providers are installed, the shop stays "unavailable".
 */
export const realShop: ShopConfig = {
  id: "sector-brief-shop",
  version: "0.0.0-draft",
  status: "draft",
  isDemo: false,
  review: { en: "draft", ar: "draft" },
  approval: null,
  products: [],
  delivery: { method: "signed-link", linkValiditySeconds: null, maxDownloadsPerOrder: null },
  terms: { purchaseTerms: null, purchaseCommunications: null, marketingConsent: null, privacy: null },
  providers: { payment: null, storage: null, orders: null },
};
