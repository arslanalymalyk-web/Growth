import Link from "next/link";
import type { BookingUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { Container } from "../ui/Section";

/** Shown when a step is opened without the previous steps' selections (e.g. a direct visit or a reload). */
export function StepGuard({ ui, locale }: { ui: BookingUi; locale: Locale }) {
  return (
    <Container className="py-12">
      <div className="max-w-2xl border border-dashed border-ivory-300 p-6">
        <h2 className="text-2xl text-navy-900">{ui.guard.title}</h2>
        <p className="mt-2 text-ink-muted">{ui.guard.body}</p>
        <p className="mt-6">
          <Link href={routes.booking(locale)} className="inline-flex min-h-12 items-center justify-center bg-gold-400 px-6 py-3 text-sm font-semibold text-navy-950 hover:bg-gold-300">{ui.guard.cta}</Link>
        </p>
      </div>
    </Container>
  );
}
