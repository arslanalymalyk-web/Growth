import type { AnalyticsProvider } from "./types.ts";

/**
 * No analytics provider has been selected, so none is installed and no tracking script exists in the site. When the client
 * chooses one, implement `AnalyticsProvider` here (load its script lazily inside the adapter, only from `send`).
 */
export const installedAnalyticsProvider: AnalyticsProvider | null = null;
