type Fixture = { home: string; homeLogo: string; away: string; awayLogo: string; time: string };

function TeamLogo({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${color}`}>
      {label}
    </span>
  );
}

export function MatchWidget({ fixtures, title = "ENGLAND - PREMIER LEAGUE" }: { fixtures: Fixture[]; title?: string }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="px-4 py-3 border-b text-center text-xs font-semibold text-muted-foreground tracking-wider">
        {title}
      </div>
      <div className="divide-y">
        {fixtures.map((f, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 justify-end min-w-0">
              <span className="font-medium truncate">{f.home}</span>
              <TeamLogo label={f.homeLogo} color="bg-red-600" />
            </div>
            <span className="bg-muted text-foreground text-xs font-bold px-3 py-1 rounded-full">{f.time}</span>
            <div className="flex items-center gap-2 min-w-0">
              <TeamLogo label={f.awayLogo} color="bg-blue-600" />
              <span className="font-medium truncate">{f.away}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 flex justify-center border-t">
        <button className="border border-brand text-brand text-sm font-semibold px-4 py-2 rounded hover:bg-brand hover:text-brand-foreground transition">
          All Scores & Fixtures
        </button>
      </div>
    </div>
  );
}
