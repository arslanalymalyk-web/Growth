import type { Locale } from "../i18n/config.ts";

/**
 * Default social-sharing image. NULL until the client supplies approved imagery (none exists in the project), so no
 * og:image / twitter:image is emitted and no placeholder is presented as a brand asset. When supplied, put the file in
 * /public and set { url: "/social-share.png", alt: { en, ar } } (1200x630 recommended).
 */
export const siteSocial: { image: { url: string; alt: Record<Locale, string> } | null } = { image: null };
