import type { ApproachStep } from "@/content/types";
import { Icon } from "../ui/Icons";

/** Five-step journey used on the homepage and the services overview. */
export function ApproachSteps({ steps }: { steps: ApproachStep[] }) {
  return (
    <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
      {steps.map((step, i) => (
        <li
          key={step.id}
          className={`relative flex gap-4 lg:flex-col lg:items-center lg:text-center ${i < steps.length - 1 ? "lg:after:absolute lg:after:top-5 lg:after:h-px lg:after:w-[calc(100%-2.5rem)] lg:after:bg-gold-500/60 lg:after:content-[''] lg:after:start-[calc(50%+1.75rem)]" : ""}`}
        >
          <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-400 font-semibold text-navy-950">{i + 1}</span>
          <span className="hidden text-gold-500 lg:block"><Icon name={step.icon} className="size-9 shrink-0" /></span>
          <div>
            <h3 className="text-2xl text-navy-900"><span className="sr-only">{i + 1}. </span>{step.title}</h3>
            <p className="mt-1 text-sm text-ink-muted">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
