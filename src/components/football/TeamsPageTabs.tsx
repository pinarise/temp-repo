import { cn } from "@/lib/utils";

export const TEAM_TABS = [
  "OVERVIEW",
  "NEWS",
  "VIDEO",
  "SCORES & FIXTURES",
  "TABLES",
  "SQUAD",
  "STATS",
  "TROPHIES",
  "INFO & ARCHIVE",
] as const;
export type TeamTab = (typeof TEAM_TABS)[number];

export function TeamsPageTabs({ active, onChange }: { active: TeamTab; onChange: (t: TeamTab) => void }) {
  return (
    <div className="border-b border-border overflow-x-auto scrollbar-thin">
      <div className="flex gap-6 lg:gap-8 px-4 lg:px-6 min-w-max">
        {TEAM_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              "relative py-3 lg:py-4 text-[11px] lg:text-xs font-bold tracking-wider whitespace-nowrap transition-colors",
              active === tab ? "text-brand" : "text-foreground/70 hover:text-foreground",
            )}
          >
            {tab}
            {active === tab && (
              <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-brand rounded-t" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
