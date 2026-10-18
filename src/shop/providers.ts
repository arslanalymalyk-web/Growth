import type { ShopProviders } from "./types.ts";

/**
 * SHOP PROVIDER ADAPTERS. None are installed: the client has not chosen or approved a payment gateway, private file
 * storage or order store, and no client-owned accounts exist. To connect them later:
 *   - implement ShopPaymentProvider (hosted checkout only), FileStorageProvider (private bucket, signed short-lived URLs)
 *     and OrderRepository in server-only modules, reading secrets from server environment variables (never NEXT_PUBLIC_*),
 *   - export them here and set `providers.*` in config.ts to the same ids.
 * Paid files must live in private storage. They must never be placed in public/ or exposed as permanent URLs.
 */
export const installedShopProviders: ShopProviders = { payment: null, storage: null, orders: null };
