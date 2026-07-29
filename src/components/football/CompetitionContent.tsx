import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMG, latestNews, videos } from "../../constants/data";

/* ---------- shared ---------- */
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-card rounded-md shadow-sm", className)}>{children}</div>;
}

function Logo({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
        color,
      )}
    >
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="relative inline-block text-xl lg:text-2xl font-bold text-foreground pb-1.5 mb-5">
      {children}
      <span className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-brand rounded" />
    </h2>
  );
}

/* ---------- tabs ---------- */
export const COMP_TABS = ["NPFL", "NEWS", "VIDEO", "SCORES & FIXTURES", "TABLE", "TEAMS"] as const;
export type CompTab = (typeof COMP_TABS)[number];

export function CompetitionTabs({
  active,
  onChange,
}: {
  active: CompTab;
  onChange: (t: CompTab) => void;
}) {
  return (
    <div className="border-b border-border overflow-x-auto">
      <div className="flex gap-6 lg:gap-8 px-4 lg:px-6 min-w-max">
        {COMP_TABS.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={cn(
              "relative py-3 lg:py-4 text-[11px] lg:text-xs font-bold tracking-wider whitespace-nowrap transition-colors",
              active === t ? "text-brand" : "text-foreground/70 hover:text-foreground",
            )}
          >
            {t === "TEAMS" ? (
              <span className="inline-flex items-center gap-1">
                TEAMS <ChevronRight className="h-3 w-3 rotate-90" />
              </span>
            ) : (
              t
            )}
            {active === t && (
              <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-brand rounded-t" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Standings sidebar ---------- */
function StandingsGroup({ name }: { name: string }) {
  return (
    <div>
      <div className="bg-brand-soft/60 grid grid-cols-[1fr_repeat(6,28px)] items-center px-3 py-1.5 text-[11px] font-semibold">
        <span>{name}</span>
        {["GP", "W", "D", "L", "GD", "P"].map((h) => (
          <span key={h} className="text-center text-muted-foreground">
            {h}
          </span>
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_repeat(6,28px)] items-center px-3 py-1.5 text-[11px] border-t"
        >
          <span className="flex items-center gap-1.5 min-w-0">
            <Logo label="A" color="bg-emerald-700" />
            <span className="truncate">Al Alha Saudi</span>
          </span>
          {[56, 26, 33, 3, 2, 89].map((v, j) => (
            <span key={j} className="text-center">
              {v}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function StandingsSidebar() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-brand text-brand-foreground text-center py-2.5 text-xs font-bold tracking-wider">
        AFCON QUALIFYING STANDINGS
      </div>
      <StandingsGroup name="Group A" />
      <StandingsGroup name="Group B" />
      <StandingsGroup name="Group C" />
      <div className="p-3 flex justify-end border-t">
        <button className="border border-brand text-brand text-xs font-semibold px-4 py-1.5 rounded">
          Full Table
        </button>
      </div>
    </Card>
  );
}

/* ---------- Featured matches ---------- */
function FeaturedMatchCard() {
  return (
    <div className="bg-card rounded-md border p-4 min-w-[260px]">
      <p className="text-xs font-bold tracking-wider">MEN'S SENIOR</p>
      <p className="text-[10px] text-muted-foreground tracking-wider mb-3">MEN'S SENIOR CAF</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>18:00</span>
        <span>TUESDAY 11TH FEB</span>
      </div>
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Logo label="N" color="bg-emerald-700" />
          Nigeria
        </span>
        <span className="text-muted-foreground">vs</span>
        <span className="inline-flex items-center gap-1.5">
          Ghana <span>🇬🇭</span>
        </span>
      </div>
    </div>
  );
}

export function FeaturedMatches() {
  return (
    <div>
      <SectionTitle>Featured Matches</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <FeaturedMatchCard key={i} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-3 mt-5">
        <button className="h-8 w-8 rounded-full border grid place-items-center text-muted-foreground">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs text-muted-foreground">○ ○ ○</span>
        <button className="h-8 w-8 rounded-full bg-foreground text-background grid place-items-center">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Scores & Results strip (mobile bottom) ---------- */
export function ScoresResultsStrip() {
  return (
    <div>
      <SectionTitle>Scores &amp; Results</SectionTitle>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => (
          <FeaturedMatchCard key={i} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-3 mt-5">
        <button className="h-8 w-8 rounded-full border grid place-items-center text-muted-foreground">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs text-muted-foreground">○ ○ ○</span>
        <button className="h-8 w-8 rounded-full bg-foreground text-background grid place-items-center">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------- News article card ---------- */
function NewsCard({ image, big = false }: { image: string; big?: boolean }) {
  return (
    <a
      href="#"
      className="block bg-card rounded-md border overflow-hidden hover:shadow-md transition"
    >
      <img
        src={image}
        alt=""
        className={cn("w-full object-cover", big ? "h-56 lg:h-72" : "h-44 lg:h-56")}
      />
      <div className="border-l-[3px] border-highlight pl-3 m-3">
        <span className="inline-block bg-highlight text-highlight-foreground text-[10px] font-bold px-1.5 py-0.5 rounded mb-1">
          NPL
        </span>
        <h3 className="text-sm font-semibold leading-snug">
          {big
            ? "35th AFCON Draw: Super Eagles in Pot A, to avoid Morocco, Senegal, Egypt, Algeria, CIV – The NFF"
            : "Afcon 2023: Grand finale awaits between hosts Ivory Coast and Nigeria"}
        </h3>
      </div>
      <a
        href="#"
        className="text-xs text-foreground font-medium mx-3 mb-3 inline-flex items-center gap-1"
      >
        Read more <span aria-hidden>→</span>
      </a>
    </a>
  );
}

/* ---------- NEWS VIEW ---------- */
export function CompNewsView() {
  const images = [IMG.trophy, IMG.celebrate, IMG.player1, IMG.action, IMG.stadium];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* main news list */}
        <div>
          <SectionTitle>News</SectionTitle>
          <div className="space-y-5">
            {images.map((src, i) => (
              <NewsCard key={i} image={src} big={i === 0} />
            ))}
          </div>
        </div>
        {/* sidebar */}
        <aside className="space-y-6">
          <StandingsSidebar />
        </aside>
      </div>
      <FeaturedMatches />
    </div>
  );
}

/* ---------- VIDEO VIEW (desktop = 2-col grid, mobile = list w/ thumbnail-left) ---------- */
function VideoTile({ image }: { image: string }) {
  return (
    <a
      href="#"
      className="block bg-card rounded-md border overflow-hidden hover:shadow-md transition"
    >
      <div className="relative aspect-video">
        <img src={image} alt="" className="w-full h-full object-cover" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="h-10 w-10 rounded-full bg-white/90 grid place-items-center">
            <Play className="h-4 w-4 text-brand fill-brand ml-0.5" />
          </span>
        </span>
      </div>
      <div className="border-l-[3px] border-highlight pl-3 m-3">
        <span className="inline-block bg-highlight text-highlight-foreground text-[10px] font-bold px-1.5 py-0.5 rounded mb-1">
          NPL
        </span>
        <h3 className="text-sm font-semibold leading-snug">
          Afcon 2023: Grand finale awaits between hosts Ivory Coast and Nigeria
        </h3>
      </div>
      <span className="text-xs text-foreground font-medium mx-3 mb-3 inline-flex items-center gap-1">
        Read more <span>→</span>
      </span>
    </a>
  );
}

function VideoListRow({ image }: { image: string }) {
  return (
    <a
      href="#"
      className="flex bg-card rounded-md border overflow-hidden hover:shadow-md transition"
    >
      <div className="relative w-32 h-24 shrink-0">
        <img src={image} alt="" className="w-full h-full object-cover" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="h-8 w-8 rounded-full bg-white/90 grid place-items-center">
            <Play className="h-3.5 w-3.5 text-brand fill-brand ml-0.5" />
          </span>
        </span>
      </div>
      <div className="p-3 min-w-0 flex-1">
        <span className="inline-block bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mb-1">
          NPL
        </span>
        <p className="text-sm font-semibold leading-snug border-l-[3px] border-highlight pl-2">
          Afcon 2023: Grand finale awaits between hosts Ivory Coast and Nigeria
        </p>
        <span className="text-xs text-foreground font-medium mt-1 inline-flex items-center gap-1">
          Read more <span>→</span>
        </span>
      </div>
    </a>
  );
}

export function CompVideoView() {
  const tiles = [...videos, ...videos, ...videos].slice(0, 6).map((v) => v.image);
  return (
    <div className="space-y-8">
      {/* desktop title */}
      <div>
        <SectionTitle>Video</SectionTitle>
        {/* desktop grid */}
        <div className="hidden lg:grid grid-cols-2 gap-5">
          {tiles.map((img, i) => (
            <VideoTile key={i} image={img} />
          ))}
        </div>
        {/* mobile list */}
        <div className="lg:hidden space-y-3">
          {tiles.slice(0, 5).map((img, i) => (
            <VideoListRow key={i} image={img} />
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <FeaturedMatches />
      </div>
      <div className="lg:hidden">
        <ScoresResultsStrip />
      </div>
    </div>
  );
}

/* ---------- SCORES & FIXTURES VIEW ---------- */
const DAYS_DESKTOP = [
  { d: "Fri", n: 16 },
  { d: "Fri", n: 16 },
  { d: "Fri", n: 16 },
  { d: "Sat", n: 16 },
  { d: "Today", n: 16, today: true },
  { d: "Sun", n: 16 },
  { d: "Fri", n: 16 },
  { d: "Fri", n: 16 },
  { d: "Fri", n: 16 },
];
const DAYS_MOBILE = [
  { d: "Sat", n: 16 },
  { d: "Today", n: 16, today: true },
  { d: "Sun", n: 16 },
];

function FixtureLine() {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-3 px-4 py-3 text-sm border-b last:border-b-0">
      <span className="text-right truncate">Man United</span>
      <Logo label="M" color="bg-red-600" />
      <span className="border rounded px-3 py-1 text-xs">20:00</span>
      <Logo label="C" color="bg-blue-600" />
      <span className="truncate">Chelsea</span>
    </div>
  );
}

export function CompScoresView() {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b">
          <div className="w-6" />
          <span className="text-sm font-semibold tracking-wider">MARCH</span>
          <button className="text-brand">
            <Calendar className="h-5 w-5" />
          </button>
        </div>
        {/* desktop */}
        <div className="hidden lg:flex items-center px-2 py-3">
          <button className="p-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 grid grid-cols-9 text-center">
            {DAYS_DESKTOP.map((d, i) => (
              <button
                key={i}
                className={cn("relative py-1.5 text-xs", d.today ? "text-brand font-bold" : "")}
              >
                <div>{d.d}</div>
                <div className="text-base font-semibold">{d.n}</div>
                {d.today && (
                  <span className="absolute left-3 right-3 bottom-0 h-0.5 bg-brand rounded" />
                )}
              </button>
            ))}
          </div>
          <button className="p-2">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        {/* mobile */}
        <div className="lg:hidden flex items-center px-2 py-3">
          <button className="p-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 grid grid-cols-3 text-center">
            {DAYS_MOBILE.map((d, i) => (
              <button
                key={i}
                className={cn("relative py-1.5 text-xs", d.today ? "text-brand font-bold" : "")}
              >
                <div>{d.d}</div>
                <div className="text-base font-semibold">{d.n}</div>
                {d.today && (
                  <span className="absolute left-6 right-6 bottom-0 h-0.5 bg-brand rounded" />
                )}
              </button>
            ))}
          </div>
          <button className="p-2">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Card>

      <Card>
        <div className="text-center font-bold py-4 border-b">Saturday 16th January</div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <FixtureLine key={i} />
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- TABLE VIEW ---------- */
const COMPETITIONS = [
  "All",
  "Friendlies",
  "CAF Africa Cup of Nations",
  "Africa Cup of Nations Qualification",
  "CAF World Cup Qualifiers",
  "African Nations Championship Qualification",
];

const GROUPS = ["GROUP A", "GROUP B", "GROUP C", "GROUP D", "GROUP E", "GROUP F"];

function GroupTable({ name }: { name: string }) {
  const teams = [
    { p: 1, name: "Cameroon", flag: "🇨🇲", gd: "+21", gdColor: "text-emerald-600" },
    { p: 2, name: "Nigeria", flag: "🇳🇬", gd: "-1", gdColor: "text-red-600" },
    { p: 3, name: "Egypt", flag: "🇪🇬", gd: "0", gdColor: "text-foreground" },
    { p: 4, name: "Algeria", flag: "🇩🇿", gd: "-1", gdColor: "text-red-600" },
  ];
  return (
    <div className="rounded-md overflow-hidden bg-card border">
      {/* desktop */}
      <div className="hidden lg:grid bg-brand-soft/70 grid-cols-[40px_1fr_repeat(8,52px)] items-center px-4 py-3 text-xs font-bold">
        <span>{name.split(" ")[0]}</span>
        <span>{name.split(" ")[1]}</span>
        {["GP", "W", "D", "L", "E", "A", "GD", "Pts"].map((h) => (
          <span key={h} className="text-center text-muted-foreground">
            {h}
          </span>
        ))}
      </div>
      {/* mobile */}
      <div className="lg:hidden grid bg-brand-soft/70 grid-cols-[32px_1fr_repeat(5,36px)] items-center px-3 py-2 text-[11px] font-bold">
        <span>{name.split(" ")[0]}</span>
        <span>{name.split(" ")[1]}</span>
        {["GP", "W", "D", "GD", "Pts"].map((h) => (
          <span key={h} className="text-center text-muted-foreground">
            {h}
          </span>
        ))}
      </div>
      {teams.map((t) => (
        <div key={t.p}>
          {/* desktop row */}
          <div className="hidden lg:grid grid-cols-[40px_1fr_repeat(8,52px)] items-center px-4 py-2.5 text-sm border-t">
            <span>{t.p}</span>
            <span className="flex items-center gap-2">
              <span>{t.flag}</span>
              {t.name}
            </span>
            <span className="text-center">56</span>
            <span className="text-center">26</span>
            <span className="text-center">33</span>
            <span className="text-center">3</span>
            <span className="text-center">2</span>
            <span className="text-center">2</span>
            <span className={cn("text-center font-medium", t.gdColor)}>{t.gd}</span>
            <span className="text-center font-bold">89</span>
          </div>
          {/* mobile row */}
          <div className="lg:hidden grid grid-cols-[32px_1fr_repeat(5,36px)] items-center px-3 py-2 text-xs border-t">
            <span>{t.p}</span>
            <span className="flex items-center gap-1.5 min-w-0">
              <span>{t.flag}</span>
              <span className="truncate">{t.name}</span>
            </span>
            <span className="text-center">56</span>
            <span className="text-center">26</span>
            <span className="text-center">2</span>
            <span className={cn("text-center font-medium", t.gdColor)}>{t.gd}</span>
            <span className="text-center font-bold">89</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompTableView() {
  const [comp, setComp] = useState("All");
  return (
    <div className="space-y-4">
      <Card className="p-4 lg:p-5">
        <p className="text-xs font-bold tracking-wider mb-3">COMPETITIONS:</p>
        <div className="flex flex-wrap gap-2">
          {COMPETITIONS.map((c) => (
            <button
              key={c}
              onClick={() => setComp(c)}
              className={cn(
                "text-xs lg:text-sm px-4 py-1.5 rounded-full border whitespace-nowrap transition",
                comp === c
                  ? "bg-brand text-brand-foreground border-brand"
                  : "bg-card text-foreground border-border hover:border-brand",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {GROUPS.map((g) => (
          <GroupTable key={g} name={g} />
        ))}
      </div>

      <Card className="p-4 lg:p-5 text-xs lg:text-sm">
        <p className="text-right font-bold tracking-wider mb-2">GLOSSARY</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1.5 text-muted-foreground">
          <span>
            <b className="text-foreground">GP:</b> Games Played
          </span>
          <span>
            <b className="text-foreground">L:</b> Losses
          </span>
          <span>
            <b className="text-foreground">GD:</b> Games Difference
          </span>
          <span>
            <b className="text-foreground">W:</b> Wins
          </span>
          <span>
            <b className="text-foreground">F:</b> Goals For
          </span>
          <span>
            <b className="text-foreground">P:</b> Points
          </span>
          <span>
            <b className="text-foreground">D:</b> Draws
          </span>
          <span>
            <b className="text-foreground">A:</b> Goals Against
          </span>
        </div>
      </Card>
    </div>
  );
}

/* ---------- TEAMS VIEW ---------- */
export function CompTeamsView() {
  const teams = [
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Cameroon", flag: "🇨🇲" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "Algeria", flag: "🇩🇿" },
    { name: "Senegal", flag: "🇸🇳" },
    { name: "Morocco", flag: "🇲🇦" },
    { name: "Ivory Coast", flag: "🇨🇮" },
    { name: "Ghana", flag: "🇬🇭" },
  ];
  return (
    <Card className="p-4 lg:p-6">
      <SectionTitle>Teams</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {teams.map((t) => (
          <a
            key={t.name}
            href="#"
            className="flex items-center gap-3 p-3 border rounded-md hover:border-brand transition"
          >
            <span className="text-2xl">{t.flag}</span>
            <span className="text-sm font-semibold">{t.name}</span>
          </a>
        ))}
      </div>
    </Card>
  );
}

/* unused-but-kept imports trick */
void latestNews;
