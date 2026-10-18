import Link from "next/link";
import type { UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";

/** Text-only wordmark of the company name. The official logo file has not been supplied yet. */
export function Wordmark({ ui, locale, tone = "dark" }: { ui: UiStrings; locale: Locale; tone?: "dark" | "light" }) {
  return (
    <Link href={routes.home(locale)} dir="ltr" className="inline-flex flex-col leading-none" aria-label={`${ui.brandName} ${ui.brandDescriptor}`}>
      <span className={`font-sans text-[0.95rem] font-semibold uppercase tracking-[0.16em] ${tone === "dark" ? "text-ivory-50" : "text-navy-900"}`}>
        {ui.brandName}
      </span>
      <span className="mt-1 font-sans text-[0.62rem] font-medium uppercase tracking-[0.4em] text-gold-400">{ui.brandDescriptor}</span>
    </Link>
  );
}
