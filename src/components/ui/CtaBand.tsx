import { ButtonLink } from "./Button";
import { Section, SectionHeading } from "./Section";

interface Props {
  id?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

/** Closing call-to-action band, editable from content data. */
export function CtaBand({ id = "cta-title", eyebrow, title, body, primary, secondary }: Props) {
  return (
    <Section labelledBy={id} tone="navy" className="relative isolate overflow-hidden !py-14 sm:!py-16">
      <div aria-hidden="true" className="lattice absolute inset-0 -z-10 opacity-60" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeading id={id} tone="dark" eyebrow={eyebrow ?? ""} title={title} intro={body} />
        <div className="flex shrink-0 flex-col gap-3 self-start sm:flex-row lg:self-center">
          <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
          {secondary ? <ButtonLink href={secondary.href} variant="outline-light">{secondary.label}</ButtonLink> : null}
        </div>
      </div>
    </Section>
  );
}
