import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-cormorant", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--font-plex-arabic", display: "swap" });

export const metadata: Metadata = { title: "404 | Growth Blueprint Advisory", robots: { index: false, follow: false } };

/**
 * Shown for any URL that matches no page. The language of the visitor is unknown here, so both languages are shown.
 * Arabic text is DRAFT copy pending professional review, like all other Arabic copy.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${plexArabic.variable}`}>
      <body className="min-h-dvh bg-ivory-100">
        <main id="main" className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
          <p className="eyebrow text-gold-700">404</p>
          <section lang="en" dir="ltr" aria-labelledby="nf-en" className="mt-3">
            <h1 id="nf-en" className="text-4xl text-navy-900 sm:text-5xl">Page not found</h1>
            <p className="mt-4 text-lg text-ink-muted">The page you are looking for may have moved, or it may not exist.</p>
            <p className="mt-6"><Link href="/en" className="font-semibold text-navy-900 underline underline-offset-4">Go to the English homepage</Link></p>
          </section>
          <hr className="my-10 border-ivory-300" />
          <section lang="ar" dir="rtl" aria-labelledby="nf-ar">
            <h2 id="nf-ar" className="text-3xl text-navy-900 sm:text-4xl">الصفحة غير موجودة</h2>
            <p className="mt-4 text-lg text-ink-muted">ربما نُقلت الصفحة التي تبحث عنها أو أنها غير موجودة.</p>
            <p className="mt-6"><Link href="/ar" className="font-semibold text-navy-900 underline underline-offset-4">الانتقال إلى الصفحة الرئيسية بالعربية</Link></p>
          </section>
        </main>
      </body>
    </html>
  );
}
