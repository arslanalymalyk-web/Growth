/**
 * Decorative line-art skyline for the footer (abstract towers and palms; not a depiction of any real building).
 * Purely visual: hidden from assistive technology.
 */
export function SkylineStrip({ className = "" }: { className?: string }) {
  const towers: [number, number, number][] = [ // [x, width, height]
    [40, 22, 40], [66, 16, 56], [86, 26, 34], [150, 20, 48], [176, 30, 70], [212, 18, 44], [236, 24, 30],
    [420, 24, 36], [450, 20, 58], [474, 28, 42], [510, 16, 30], [640, 22, 46], [668, 26, 64], [700, 20, 38],
    [880, 24, 40], [908, 18, 54], [930, 28, 34], [1060, 20, 44], [1086, 26, 60], [1116, 18, 32],
  ];
  const palms = [120, 330, 590, 800, 1000, 1160];
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 1200 80" preserveAspectRatio="xMidYMax slice" className={`h-14 w-full text-gold-400 sm:h-20 ${className}`}>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.55">
        <line x1="0" y1="79" x2="1200" y2="79" />
        {towers.map(([x, w, h]) => <rect key={x} x={x} y={79 - h} width={w} height={h} />)}
        {palms.map((x) => (
          <g key={x}>
            <path d={`M${x} 79 C${x + 2} 60 ${x - 2} 48 ${x} 36`} />
            <path d={`M${x} 36 q-14 -2 -20 8 M${x} 36 q14 -2 20 8 M${x} 36 q-10 -10 -22 -8 M${x} 36 q10 -10 22 -8 M${x} 36 q0 -10 0 -14`} />
          </g>
        ))}
      </g>
    </svg>
  );
}
