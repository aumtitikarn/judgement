/** ด้านหลังไพ่ ใช้ทั้งในสำรับให้เลือกและตอนพลิกเปิด */
export function CardBack({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-xl border border-gold-400/30 bg-linear-to-br from-deck-700 via-deck-800 to-deck-950 ${className}`}
    >
      <svg
        viewBox="0 0 120 200"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="cb-glow" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#f0d89b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f0d89b" stopOpacity="0" />
          </radialGradient>
          <mask id="cb-moon">
            <rect x="-20" y="-20" width="40" height="40" fill="white" />
            <circle cx="6.5" cy="-2.5" r="11" fill="black" />
          </mask>
          <pattern id="cb-grid" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="none" stroke="#e2bd6b" strokeOpacity="0.16" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="120" height="200" fill="url(#cb-grid)" />
        <rect width="120" height="200" fill="url(#cb-glow)" />
        <rect x="5" y="5" width="110" height="190" rx="7" fill="none" stroke="#e2bd6b" strokeOpacity="0.5" strokeWidth="1" />
        <rect x="9" y="9" width="102" height="182" rx="5" fill="none" stroke="#e2bd6b" strokeOpacity="0.22" strokeWidth="0.5" />
        <g transform="translate(60 100)">
          <circle r="22" fill="none" stroke="#f0d89b" strokeOpacity="0.55" strokeWidth="0.9" />
          <circle r="15" fill="none" stroke="#f0d89b" strokeOpacity="0.3" strokeWidth="0.6" />
          <circle r="12.5" fill="#f0d89b" fillOpacity="0.85" mask="url(#cb-moon)" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="0"
              y1="-27"
              x2="0"
              y2="-32"
              stroke="#f0d89b"
              strokeOpacity="0.45"
              strokeWidth="0.8"
              transform={`rotate(${angle})`}
            />
          ))}
        </g>
        <g fill="#f7e7bf" fillOpacity="0.75">
          <circle cx="30" cy="42" r="1.1" />
          <circle cx="88" cy="56" r="0.9" />
          <circle cx="24" cy="150" r="0.9" />
          <circle cx="94" cy="146" r="1.1" />
          <circle cx="60" cy="28" r="1.3" />
          <circle cx="60" cy="172" r="1.3" />
        </g>
      </svg>
    </div>
  );
}
