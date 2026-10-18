import type { BookingProviders } from "./types.ts";

/**
 * PROVIDER ADAPTERS. None are installed: the client has not chosen or approved a calendar provider or a payment
 * gateway, and no client-owned accounts exist. To connect them later:
 *   - implement CalendarProvider and PaymentProvider (types.ts) in server-only modules, reading secrets from server
 *     environment variables (never NEXT_PUBLIC_*, never committed),
 *   - export them here, and set `providers.calendar` / `providers.payment` in config.ts to the same ids.
 * Payment MUST use the provider's hosted checkout page (createCheckoutSession returns a URL); never build card fields.
 */
export const installedProviders: BookingProviders = { calendar: null, payment: null };
