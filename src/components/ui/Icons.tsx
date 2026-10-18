import type { IconName } from "@/content/types";

const paths: Record<IconName, React.ReactNode> = {
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="m16 16 5 5" /></>),
  document: (<><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 15h5M10 18h3" /></>),
  network: (<><rect x="9" y="3" width="6" height="5" /><rect x="3" y="16" width="6" height="5" /><rect x="15" y="16" width="6" height="5" /><path d="M12 8v4M6 16v-4h12v4" /></>),
  gear: (<><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>),
  users: (<><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15.5 14.2c3 0 5.5 1.9 5.5 5.3" /></>),
  chart: (<><path d="M4 20h16" /><rect x="5" y="12" width="3.5" height="8" /><rect x="10.5" y="8" width="3.5" height="12" /><rect x="16" y="4" width="3.5" height="16" /></>),
  leaf: (<><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19c3-5 6-8 10-10" /></>),
  nodes: (<><circle cx="12" cy="12" r="2.5" /><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="m6.5 7.5 3.5 3M17.5 7.5 14 10.5M6.5 16.5l3.5-3M17.5 16.5 14 13.5" /></>),
  door: (<><path d="M6 21V4l10 2v15" /><path d="M3 21h18M13 12.5v.5" /></>),
  check: (<path d="m5 12.5 4.5 4.5L19 7.5" />),
  person: (<><circle cx="12" cy="8" r="3.5" /><path d="M5 21c0-4 3-7 7-7s7 3 7 7" /></>),
  chat: (<path d="M4 5h16v11H11l-4 4v-4H4z" />),
  flag: (<><path d="M6 21V4" /><path d="M6 5h11l-2 4 2 4H6" /></>),
};

export function Icon({ name, className = "size-8" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}

/** Directional arrow: points to the inline-end side, so it flips automatically in RTL. */
export function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${className} rtl:-scale-x-100`} aria-hidden="true" focusable="false">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-6" aria-hidden="true" focusable="false">
      {open ? <path d="M5 5l14 14M19 5 5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

/** Breadcrumb separator: points to the inline-end side, so it flips automatically in RTL. */
export function ChevronIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${className} rtl:-scale-x-100`} aria-hidden="true" focusable="false">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}
