import { hasLocale } from "../i18n/config.ts";
import { analyticsEvents, type AnalyticsEvent, type AnalyticsProvider, type ConsentPolicy, type ConsentState } from "./types.ts";

const PAGE = /^\/[a-z0-9\-/]{0,119}$/; // a clean path only: no query, hash, @, spaces or ids

/** Returns a safe event or null. Anything unexpected is dropped, never repaired or forwarded. */
export function sanitizeEvent(e: unknown): AnalyticsEvent | null {
  if (!e || typeof e !== "object") return null;
  const { name, locale, page } = e as Record<string, unknown>;
  if (typeof name !== "string" || !(analyticsEvents as readonly string[]).includes(name)) return null;
  if (typeof locale !== "string" || !hasLocale(locale)) return null;
  if (typeof page !== "string" || !PAGE.test(page)) return null;
  return { name: name as AnalyticsEvent["name"], locale, page };
}

export interface AnalyticsDeps {
  provider: AnalyticsProvider | null;
  /** The provider id the client configured; must match the installed adapter. */
  configuredProviderId: string | null;
  policy: ConsentPolicy | null;
  consent: () => ConsentState;
}

/**
 * The gate. Active ONLY when a provider is selected AND installed (ids match) AND the consent requirement is defined AND,
 * where consent is required, it has been granted. Otherwise track() does nothing: no buffering, no network, no storage.
 */
export function createAnalytics(deps: AnalyticsDeps) {
  const isActive = () => {
    if (!deps.provider || !deps.configuredProviderId || deps.provider.id !== deps.configuredProviderId) return false;
    if (deps.policy === null) return false;
    return deps.policy === "not-required" || deps.consent() === "granted";
  };
  return {
    isActive,
    track(raw: unknown): boolean {
      if (!isActive()) return false;
      const event = sanitizeEvent(raw);
      if (!event) return false;
      try { deps.provider!.send(event); } catch { return false; }
      return true;
    },
  };
}
