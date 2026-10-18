import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic, Inter, Noto_Naskh_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AnalyticsEvents } from "@/components/analytics/AnalyticsEvents";
import { NewsletterSignup } from "@/components/contact/NewsletterSignup";
import { getContactUi, getTranslatedArticleSlugs, getUi } from "@/content";
import { getContactRuntime } from "@/contact/load.ts";
import { localizeContact } from "@/contact/localize.ts";
import { hasLocale, localeMeta, locales, siteUrl } from "@/i18n/config";
import "../globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-cormorant", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["500", "600", "700"], variable: "--font-naskh", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--font-plex-arabic", display: "swap" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0d1f38" };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

// Safe default: noindex. Pages opt in through buildMetadata() (src/seo/metadata.ts), which still requires the deployment-level launch switch.
export const metadata: Metadata = { metadataBase: new URL(siteUrl()), robots: { index: false, follow: false } };

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const ui = getUi(lang);
  const articleSlugs = await getTranslatedArticleSlugs();
  const { dir, htmlLang } = localeMeta[lang];
  const news = (await getContactRuntime()).newsletter;
  const newsletterSlot = news.mode === "unavailable" ? null : (
    <NewsletterSignup mode={news.mode} ui={getContactUi(lang)} locale={lang} consentText={localizeContact(news.config, lang).terms.newsletterConsent} variant="footer" />
  );

  return (
    <html lang={htmlLang} dir={dir} className={`${cormorant.variable} ${inter.variable} ${naskh.variable} ${plexArabic.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-navy-950">
          {ui.skipToContent}
        </a>
        <SiteHeader ui={ui} locale={lang} articleSlugs={articleSlugs} />
        <AnalyticsEvents />
        <main id="main">{children}</main>
        <SiteFooter ui={ui} locale={lang} articleSlugs={articleSlugs} newsletterSlot={newsletterSlot} />
      </body>
    </html>
  );
}
