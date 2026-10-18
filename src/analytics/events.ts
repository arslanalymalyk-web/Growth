import { hasLocale } from "../i18n/config.ts";
import type { AnalyticsEventName } from "./types.ts";

/** Maps a link target to a privacy-safe event, or null. Used by ButtonLink to mark key calls to action. */
export function eventForHref(href: string): AnalyticsEventName | null {
  const path = href.split(/[?#]/)[0].replace(/\/$/, "");
  const parts = path.split("/").filter(Boolean);
  if (parts.length && hasLocale(parts[0])) parts.shift();
  const [a, b, c] = parts;
  if (a === "book-consultation" && parts.length === 1) return "booking_cta_click";
  if (a === "readiness-scorecard" && b === "assessment" && parts.length === 2) return "scorecard_start";
  if (a === "shop" && b !== "order" && b !== "demo-checkout" && (parts.length === 1 || (parts.length === 2) || (parts.length === 3 && c === "checkout"))) return "shop_cta_click";
  return null;
}

/** Page path without the language prefix, query or hash (never includes order ids or anything personal). */
export function pageKey(pathname: string): string {
  const parts = pathname.split(/[?#]/)[0].split("/").filter(Boolean);
  if (parts.length && hasLocale(parts[0])) parts.shift();
  return `/${parts.join("/")}`;
}
