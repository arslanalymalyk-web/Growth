/** Persistent, unmissable marker shown on every screen when the development-only demo fixture is active. */
export function DemoBanner({ text }: { text: string }) {
  return (
    <p role="note" className="border-y-2 border-dashed border-gold-700 bg-gold-300/30 px-5 py-3 text-center text-sm font-semibold text-navy-950">
      {text}
    </p>
  );
}
