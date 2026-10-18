import type { BookingUi } from "@/content/types";
import { fill } from "@/i18n/format";
import { Container } from "../ui/Section";

type Step = "package" | "schedule" | "details" | "checkout";
const order: Step[] = ["package", "schedule", "details", "checkout"];

/** Four-step progress. Labels collapse to numbers on narrow screens (the current step name is always in the text above). */
export function BookingProgress({ ui, current }: { ui: BookingUi; current: Step }) {
  const idx = order.indexOf(current);
  const name = ui.progress.steps[current];
  return (
    <Container className="pt-8">
      <nav aria-label={ui.progress.label}>
        <p className="text-sm font-semibold text-navy-900">{fill(ui.progress.stepOf, { current: idx + 1, total: order.length, name })}</p>
        <div role="progressbar" aria-label={ui.progress.label} aria-valuemin={1} aria-valuemax={order.length} aria-valuenow={idx + 1} aria-valuetext={name} className="mt-3 h-2 bg-ivory-300">
          <div className="h-full bg-gold-500" style={{ width: `${((idx + 1) / order.length) * 100}%` }} />
        </div>
        <ol className="mt-4 flex flex-wrap gap-2 text-xs">
          {order.map((s, i) => (
            <li key={s} aria-current={i === idx ? "step" : undefined} className={`flex min-h-8 items-center gap-2 border px-2 ${i === idx ? "border-navy-900 bg-navy-900 text-ivory-50" : i < idx ? "border-gold-500 text-navy-900" : "border-ivory-300 text-ink-muted"}`}>
              <span aria-hidden="true">{i + 1}</span>
              <span className="hidden sm:inline">{ui.progress.steps[s]}</span>
              <span className="sr-only sm:hidden">{ui.progress.steps[s]}</span>
            </li>
          ))}
        </ol>
      </nav>
    </Container>
  );
}
