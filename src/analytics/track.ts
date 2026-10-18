import { analyticsConfig } from "./config.ts";
import { getAnalyticsConsent } from "./consent.ts";
import { createAnalytics } from "./core.ts";
import { pageKey } from "./events.ts";
import { installedAnalyticsProvider } from "./providers.ts";
import type { AnalyticsEventName } from "./types.ts";
import { hasLocale } from "../i18n/config.ts";

/** The site-wide gate, built from the (currently empty) configuration. */
export const analytics = createAnalytics({
  provider: installedAnalyticsProvider,
  configuredProviderId: analyticsConfig.providerId,
  policy: analyticsConfig.consentPolicy,
  consent: getAnalyticsConsent,
});

/** Browser-side hook. A no-op until analytics is configured and consent behaviour is satisfied. Sends only name, language and page path. */
export function track(name: AnalyticsEventName): void {
  if (typeof document === "undefined" || !analytics.isActive()) return;
  const lang = document.documentElement.lang;
  if (!hasLocale(lang)) return;
  analytics.track({ name, locale: lang, page: pageKey(location.pathname) });
}
