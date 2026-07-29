

// lucide doesn't ship Whistle in all versions; fallback via inline svg if needed
function WhistleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a6 6 0 0 0 11.3 2.8L21 17v-4l-6.7-2.2A6 6 0 0 0 3 12Z" />
      <circle cx="9" cy="12" r="1.5" />
    </svg>
  );
}

export function MatchHero() {
  return (
    <div className="relative overflow-hidden rounded-md text-white shadow-md"
      style={{
        background:
          "linear-gradient(125deg, #0b6b3a 0%, #0a5a32 35%, #0e7a44 60%, #0a5a32 100%)",
      }}
    >
      {/* diagonal sheen */}
      <div className="pointer-events-none absolute inset-0 opacity-20"
        style={{ background: "repeating-linear-gradient(115deg, transparent 0 80px, rgba(255,255,255,0.06) 80px 160px)" }}
      />
      <div className="relative px-4 lg:px-8 pt-4 lg:pt-5 pb-4">
        <p className="text-center text-xs lg:text-sm">
          Venue: <span className="font-semibold">Old Trafford Stadium</span>
        </p>

        {/* Mobile layout: crest on top, name below */}
        <div className="mt-4 grid grid-cols-3 items-start gap-2 lg:hidden">
          <div className="flex flex-col items-center text-center">
            <ManUtdCrest className="h-14 w-14" />
            <p className="mt-2 text-sm font-semibold">Man United</p>
            <div className="mt-1 text-[11px] text-white/85 space-y-0.5">
              <p>R Jiménez (55')</p>
              <p>H Wilson (81')</p>
            </div>
          </div>
          <div className="flex flex-col items-center pt-3">
            <span className="text-[10px] bg-black/30 rounded px-3 py-1 mb-2">FT</span>
            <div className="flex items-center gap-2">
              <span className="grid place-items-center h-9 w-9 rounded bg-white/95 text-foreground text-xl font-bold">0</span>
              <span className="grid place-items-center h-9 w-9 rounded bg-white/95 text-foreground text-xl font-bold">0</span>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <ChelseaCrest className="h-14 w-14" />
            <p className="mt-2 text-sm font-semibold">Chelsea</p>
            <div className="mt-1 text-[11px] text-white/85 space-y-0.5">
              <p>R Jiménez (55')</p>
              <p>H Wilson (81')</p>
            </div>
          </div>
        </div>

        {/* Desktop layout: name | crest | score | crest | name */}
        <div className="hidden lg:grid mt-6 grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-8">
          <p className="text-2xl font-semibold text-right">Man United</p>
          <ManUtdCrest className="h-20 w-20" />
          <div className="flex flex-col items-center">
            <span className="text-xs bg-black/30 rounded px-3 py-1 mb-2">FT</span>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-12 w-12 rounded bg-white/95 text-foreground text-3xl font-bold">0</span>
              <span className="grid place-items-center h-12 w-12 rounded bg-white/95 text-foreground text-3xl font-bold">0</span>
            </div>
          </div>
          <ChelseaCrest className="h-20 w-20" />
          <p className="text-2xl font-semibold">Chelsea</p>
        </div>

        {/* desktop scorers under */}
        <div className="hidden lg:grid grid-cols-2 gap-x-32 mt-3 text-xs text-white/85">
          <div className="text-center space-y-0.5">
            <p>R Jiménez (55')</p>
            <p>H Wilson (81')</p>
          </div>
          <div className="text-center space-y-0.5">
            <p>R Jiménez (55')</p>
            <p>H Wilson (81')</p>
          </div>
        </div>

        <div className="mt-4 lg:mt-5 border-t border-white/15 pt-3 flex items-center justify-between text-[11px] lg:text-xs">
          <span className="font-semibold">Tue 20 May 2025 · Premier League</span>
          <span className="inline-flex items-center gap-1.5">
            <WhistleIcon className="h-4 w-4" />
            Adnan Deniz Kayatepe (Turkiye)
          </span>
        </div>
      </div>
    </div>
  );
}

function ManUtdCrest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="30" fill="#fff200" stroke="#000" strokeWidth="2" />
      <circle cx="32" cy="32" r="24" fill="#da020e" />
      <path d="M32 14 L40 32 L32 50 L24 32 Z" fill="#fff200" stroke="#000" />
      <text x="32" y="36" textAnchor="middle" fontSize="9" fontWeight="900" fill="#000">MU</text>
    </svg>
  );
}

function ChelseaCrest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="30" fill="#034694" stroke="#d4a017" strokeWidth="2" />
      <circle cx="32" cy="32" r="22" fill="#fff" />
      <text x="32" y="38" textAnchor="middle" fontSize="14" fontWeight="900" fill="#034694">CFC</text>
    </svg>
  );
}

