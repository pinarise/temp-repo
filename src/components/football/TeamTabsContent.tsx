import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Play, Users, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMG, latestNews, npfl, videos, superEagles } from "../../constants/data";
import { GridCard, ListCard, ReadMoreCard } from "./ArticleCards";
import { VideoHero } from "./VideoCard";

/* ───────────────────────── shared ───────────────────────── */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-card rounded-md shadow-sm p-4 lg:p-6", className)}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="relative inline-block text-lg lg:text-xl font-bold text-foreground pb-1.5 mb-4">
      {children}
      <span className="absolute -bottom-px left-0 right-0 h-0.75 bg-brand rounded" />
    </h2>
  );
}

function OutlineButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="border border-brand text-brand text-xs lg:text-sm font-semibold px-4 py-2 rounded hover:bg-brand hover:text-brand-foreground transition">
      {children}
    </button>
  );
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

function FixtureRow({ time = "20:00", date }: { time?: string; date?: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_1fr] items-center gap-2 px-3 py-3 text-sm border-b last:border-b-0">
      {date ? (
        <span className="text-xs text-muted-foreground w-20">{date}</span>
      ) : (
        <span className="w-0" />
      )}
      <div className="flex items-center gap-2 justify-end min-w-0">
        <span className="font-medium truncate">Man United</span>
        <Logo label="MU" color="bg-red-600" />
      </div>
      <span className="bg-muted text-foreground text-xs font-bold px-3 py-1 rounded">{time}</span>
      <div className="flex items-center gap-2 min-w-0">
        <Logo label="CH" color="bg-blue-600" />
        <span className="font-medium truncate">Chelsea</span>
      </div>
    </div>
  );
}

/* ───────────────────────── league table ───────────────────────── */

const TABLE_ROWS = [
  { p: 1, team: "Al Alha Saudi", color: "bg-emerald-700" },
  { p: 2, team: "Al Nassr", color: "bg-yellow-500" },
  { p: 3, team: "Al-Ittihad Club", color: "bg-yellow-600", highlight: true },
  { p: 4, team: "Westham", color: "bg-yellow-400" },
  { p: 5, team: "Al-Raed", color: "bg-red-600" },
  { p: 6, team: "Aston Villa", color: "bg-yellow-500", highlight: true },
  { p: 7, team: "Al-Raed", color: "bg-red-600" },
];

function LeagueTable({
  withForm = false,
  rows = TABLE_ROWS,
}: {
  withForm?: boolean;
  rows?: typeof TABLE_ROWS;
}) {
  return (
    <div className="rounded-md overflow-hidden border">
      <div className="bg-brand text-brand-foreground text-center py-2.5 text-sm font-bold tracking-wider">
        LEAGUE TABLE
      </div>
      <div className="bg-brand-soft/60 grid grid-cols-[36px_1fr_40px_40px_40px] lg:grid-cols-[40px_1fr_60px_60px_60px_60px_60px_60px_120px] px-3 py-2 text-xs font-semibold text-foreground/80">
        <span>#</span>
        <span>Team</span>
        {withForm ? (
          <>
            <span className="hidden lg:block text-center">PL</span>
            <span className="hidden lg:block text-center">W</span>
            <span className="hidden lg:block text-center">D</span>
            <span className="text-center">L</span>
            <span className="text-center">GD</span>
            <span className="text-center">Pts</span>
            <span className="hidden lg:block text-center">FORM</span>
          </>
        ) : (
          <>
            <span className="text-center">PL</span>
            <span className="text-center">GD</span>
            <span className="text-center">Pts</span>
          </>
        )}
      </div>
      {rows.map((r) => (
        <div
          key={`${r.p}-${r.team}`}
          className={cn(
            "grid items-center px-3 py-2.5 text-sm border-t",
            withForm
              ? "grid-cols-[36px_1fr_40px_40px_40px] lg:grid-cols-[40px_1fr_60px_60px_60px_60px_60px_60px_120px]"
              : "grid-cols-[36px_1fr_40px_40px_40px]",
            r.highlight && "bg-brand-soft/40",
          )}
        >
          <span className="text-muted-foreground">{r.p}</span>
          <span className="flex items-center gap-2 min-w-0">
            <Logo label={r.team[0]} color={r.color} />
            <span className="truncate">{r.team}</span>
          </span>
          <span className="text-center">56</span>
          {withForm && (
            <>
              <span className="hidden lg:block text-center">26</span>
              <span className="hidden lg:block text-center">33</span>
              <span className="text-center">3</span>
            </>
          )}
          <span className="text-center">26</span>
          <span className="text-center font-bold">89</span>
          {withForm && (
            <span className="hidden lg:flex justify-center gap-1">
              {["D", "L", "W", "W", "W"].map((s, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-5 w-5 rounded-full grid place-items-center text-[10px] font-bold text-white",
                    s === "W"
                      ? "bg-emerald-600"
                      : s === "L"
                        ? "bg-red-600"
                        : "bg-gray-300 text-gray-700",
                  )}
                >
                  {s}
                </span>
              ))}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── OVERVIEW ───────────────────────── */

export function OverviewView() {
  return (
    <Card className="space-y-8">
      {/* Hero */}
      <div>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={IMG.celebrate}
            alt="Super Eagles"
            className="w-full h-56 lg:h-80 object-cover"
          />
          <span className="absolute top-3 left-3 bg-highlight text-highlight-foreground text-[10px] font-bold px-2 py-0.5 rounded">
            NPFL
          </span>
        </div>
        <h3 className="mt-3 font-bold text-foreground leading-snug">
          Nigeria Football Club Officially launches its websites with amazing features
        </h3>
        <a
          href="#"
          className="text-xs text-brand font-semibold mt-1 inline-flex items-center gap-1"
        >
          Read more <ChevronRight className="h-3 w-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {superEagles.slice(0, 2).map((a) => (
          <GridCard key={a.id} {...a} date="21 Jun 2025" />
        ))}
      </div>

      {/* Today's matches */}
      <div>
        <SectionTitle>Today's Matches/Next Match</SectionTitle>
        <div className="rounded-md border bg-card">
          {[1, 2, 3].map((i) => (
            <FixtureRow key={i} />
          ))}
        </div>
      </div>

      {/* Latest Scores */}
      <div>
        <SectionTitle>Latest Scores</SectionTitle>
        <div className="rounded-md border bg-card">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3 text-sm border-b last:border-b-0"
            >
              <div className="flex items-center gap-2 justify-end min-w-0">
                <span className="font-medium truncate">Man United</span>
                <Logo label="MU" color="bg-red-600" />
              </div>
              <div className="text-center">
                <div className="font-bold">3 - 4</div>
                <div className="text-[10px] text-muted-foreground">FT</div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Logo label="CH" color="bg-blue-600" />
                <span className="font-medium truncate">Chelsea</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-3">
          <OutlineButton>See More</OutlineButton>
        </div>
      </div>

      {/* Tables */}
      <div>
        <SectionTitle>Table</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="bg-brand text-brand-foreground text-center py-2 text-xs font-bold tracking-wider rounded-t">
              WORD CUP QUALIFIER
            </div>
            <LeagueTable rows={TABLE_ROWS.slice(0, 4)} />
            <div className="flex justify-center mt-3">
              <OutlineButton>View Full Table</OutlineButton>
            </div>
          </div>
          <div>
            <div className="bg-brand text-brand-foreground text-center py-2 text-xs font-bold tracking-wider rounded-t">
              AFRICA CUP OF NATIONS
            </div>
            <LeagueTable rows={TABLE_ROWS.slice(0, 4)} />
            <div className="flex justify-center mt-3">
              <OutlineButton>View Full Table</OutlineButton>
            </div>
          </div>
        </div>
      </div>

      {/* Latest News */}
      <div>
        <SectionTitle>Super Eagles Latest News</SectionTitle>
        <div className="space-y-3">
          {latestNews.slice(0, 3).map((a) => (
            <ListCard key={a.id} {...a} />
          ))}
        </div>
        <div className="flex justify-end mt-3">
          <OutlineButton>View More</OutlineButton>
        </div>
      </div>

      {/* Videos */}
      <div>
        <SectionTitle>Videos</SectionTitle>
        <VideoHero image={IMG.videoHero} title="Fans celebrating" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {videos.map((v) => (
            <ReadMoreCard key={v.id} {...v} />
          ))}
        </div>
        <div className="flex justify-end mt-3">
          <OutlineButton>Watch More Videos</OutlineButton>
        </div>
      </div>
    </Card>
  );
}

/* ───────────────────────── NEWS ───────────────────────── */

export function NewsView() {
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle>Latest Super Eagles News</SectionTitle>

        {/* big hero */}
        <a href="#" className="block rounded-lg overflow-hidden border hover:shadow-md transition">
          <div className="relative h-56 lg:h-80">
            <img src={IMG.trophy} alt="AFCON 2025" className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <span className="inline-block bg-highlight text-highlight-foreground text-[10px] font-bold px-1.5 py-0.5 rounded mb-2">
              NPFL
            </span>
            <h3 className="font-bold text-foreground leading-snug">
              35th AFCON Draw: Super Eagles in Pot A, to avoid Morocco, Senegal, Egypt, Algeria, CIV
              – The NFF
            </h3>
            <span className="text-xs text-brand font-semibold mt-2 inline-flex items-center gap-1">
              Read more <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </a>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[IMG.action, IMG.celebrate, IMG.flag, IMG.goal].map((src, i) => (
            <a
              key={i}
              href="#"
              className="block rounded-lg overflow-hidden border bg-card hover:shadow-md transition"
            >
              <img src={src} alt="AFCON" className="w-full h-44 object-cover" />
              <div className="p-3">
                <span className="inline-block bg-highlight text-highlight-foreground text-[10px] font-bold px-1.5 py-0.5 rounded mb-2">
                  NPFL
                </span>
                <h3 className="text-sm font-semibold text-foreground leading-snug">
                  Afcon 2023: Grand finale awaits between hosts Ivory Coast and Nigeria
                </h3>
                <span className="text-xs text-brand font-semibold mt-2 inline-flex items-center gap-1">
                  Read more <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>Super Eagles Latest News</SectionTitle>
        <div className="space-y-3">
          {latestNews.map((a) => (
            <a
              key={a.id}
              href="#"
              className="flex bg-card rounded-md border overflow-hidden hover:shadow-md transition"
            >
              <img src={a.image} alt={a.title} className="w-28 h-20 object-cover shrink-0" />
              <div className="p-3 min-w-0 flex-1">
                <span className="inline-block bg-highlight text-highlight-foreground text-[10px] font-bold px-1.5 py-0.5 rounded mb-1">
                  NPFL
                </span>
                <p className="text-sm font-semibold leading-snug">
                  'A BLATANT foul!' | Ref Watch analyse Colwill's barge before Nigeria equaliser
                </p>
                <p className="text-xs text-muted-foreground mt-1">{a.date}</p>
              </div>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────────── VIDEO ───────────────────────── */

export function VideoView() {
  return (
    <Card>
      <SectionTitle>Videos</SectionTitle>
      <VideoHero image={IMG.videoHero} title="Watch fans celebrate" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {[...videos, ...videos].map((v, i) => (
          <div
            key={i}
            className="relative rounded-md overflow-hidden border bg-card hover:shadow-md transition group"
          >
            <div className="relative aspect-video">
              <img
                src={v.image}
                alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute inset-0 grid place-items-center">
                <span className="h-10 w-10 rounded-full bg-white/90 grid place-items-center">
                  <Play className="h-4 w-4 text-brand fill-brand ml-0.5" />
                </span>
              </span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold leading-snug line-clamp-2">{v.title}</h3>
              <span className="text-xs text-brand font-semibold mt-1 inline-block">Read More</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center lg:justify-end mt-4">
        <OutlineButton>Watch More Videos</OutlineButton>
      </div>
    </Card>
  );
}

/* ───────────────────────── SCORES & FIXTURES ───────────────────────── */

const DAYS = [
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

export function ScoresFixturesView() {
  const [tab, setTab] = useState<"Fixtures" | "Results">("Fixtures");
  return (
    <div className="space-y-4">
      {/* Date strip */}
      <Card className="p-0! overflow-hidden">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b">
          <div className="w-6" />
          <span className="text-sm font-semibold tracking-wider">MARCH</span>
          <button className="text-brand">
            <Calendar className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center px-2 py-3">
          <button className="p-2 shrink-0">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 grid grid-cols-5 lg:grid-cols-9 gap-1 text-center">
            {DAYS.map((d, i) => (
              <button
                key={i}
                className={cn(
                  "relative py-1.5 text-xs",
                  d.today ? "text-brand font-bold" : "text-foreground",
                  i > 4 && "hidden lg:block",
                )}
              >
                <div className={cn(d.today && "font-bold")}>{d.d}</div>
                <div className="text-base font-semibold">{d.n}</div>
                {d.today && (
                  <span className="absolute left-3 right-3 bottom-0 h-0.5 bg-brand rounded" />
                )}
              </button>
            ))}
          </div>
          <button className="p-2 shrink-0">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg lg:text-xl font-bold pb-1.5 border-b-[3px] border-brand inline-block mb-5">
          Scores & Fixtures
        </h2>

        <div className="grid grid-cols-2 rounded-md border overflow-hidden mb-5">
          {(["Fixtures", "Results"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "py-2.5 text-sm font-semibold transition-colors",
                tab === t ? "bg-brand text-brand-foreground" : "bg-card text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-md border overflow-hidden">
          <div className="bg-brand-soft/60 text-center py-2 text-xs font-bold tracking-wider">
            {tab === "Fixtures" ? "WORD CUP QUALIFIERS" : "PREMIER LEAGUE RESULTS"}
          </div>
          <div className="hidden lg:block text-center font-bold py-3 border-b">
            Saturday 16th January
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <FixtureRow key={i} date="15th Mar 2025" />
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <OutlineButton>More Scores & Fixtures</OutlineButton>
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────────── TABLES ───────────────────────── */

export function TablesView() {
  const [sub, setSub] = useState<"AFRICAN CUP OF NATIONS 2025" | "WORLD CUP 2025" | "CHAN">(
    "AFRICAN CUP OF NATIONS 2025",
  );
  const SUBS = ["AFRICAN CUP OF NATIONS 2025", "WORLD CUP 2025", "CHAN"] as const;
  const fullRows = [
    ...TABLE_ROWS,
    ...TABLE_ROWS.slice(0, 5).map((r, i) => ({
      ...r,
      p: 5,
      team: "Niger Tornadoes",
      color: "bg-blue-700",
      highlight: i % 2 === 0 ? false : false,
    })),
  ];

  return (
    <Card>
      <h2 className="text-lg lg:text-xl font-bold pb-1.5 border-b-[3px] border-brand inline-block mb-4">
        Nigeria Tables
      </h2>

      <div className="border-b mb-4 overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {SUBS.map((s) => (
            <button
              key={s}
              onClick={() => setSub(s)}
              className={cn(
                "relative py-2.5 text-xs font-bold tracking-wider whitespace-nowrap",
                sub === s ? "text-brand" : "text-foreground/70",
              )}
            >
              {s}
              {sub === s && (
                <span className="absolute inset-x-0 -bottom-px h-[3px] bg-brand rounded" />
              )}
            </button>
          ))}
        </div>
      </div>

      <LeagueTable withForm rows={fullRows} />

      <div className="mt-4 rounded-md border bg-secondary/60 p-4 text-sm">
        <p className="font-semibold mb-1">Key</p>
        <ul className="list-disc list-inside text-foreground/80">
          <li>Position 1 - 2: 8th Finals</li>
        </ul>
      </div>

      <p className="text-xs text-muted-foreground mt-4">Last Updated 12th March 2025 at 14:000</p>
    </Card>
  );
}

/* ───────────────────────── SQUAD ───────────────────────── */

const PLAYERS = [
  "V. Osimhen",
  "A. Iwobi",
  "W. Ndidi",
  "K. Iheanacho",
  "A. Lookman",
  "S. Chukwueze",
  "F. Balogun",
  "T. Bassey",
  "C. Bassey",
  "A. Aina",
  "S. Awoniyi",
  "M. Sanusi",
  "A. Onyeka",
  "R. Aribo",
  "F. Anjorin",
  "J. Aribo",
];

export function SquadView() {
  return (
    <Card>
      <SectionTitle>Squad</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {PLAYERS.map((p, i) => (
          <div
            key={i}
            className="rounded-md border bg-card overflow-hidden hover:shadow-md transition"
          >
            <div className="aspect-square bg-gradient-to-br from-brand to-brand-dark grid place-items-center">
              <Users className="h-12 w-12 text-white/80" />
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground">#{i + 1}</p>
              <p className="text-sm font-semibold truncate">{p}</p>
              <p className="text-xs text-brand">Forward</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ───────────────────────── STATS ───────────────────────── */

const STATS = [
  { label: "Matches Played", value: "56" },
  { label: "Wins", value: "32" },
  { label: "Draws", value: "14" },
  { label: "Losses", value: "10" },
  { label: "Goals Scored", value: "89" },
  { label: "Goals Conceded", value: "41" },
  { label: "Clean Sheets", value: "21" },
  { label: "Yellow Cards", value: "63" },
];

export function StatsView() {
  return (
    <Card>
      <SectionTitle>Team Stats</SectionTitle>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-md border p-4 bg-card">
            <p className="text-2xl font-black text-brand">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <SectionTitle>Top Scorers</SectionTitle>
        <div className="rounded-md border divide-y">
          {PLAYERS.slice(0, 5).map((p, i) => (
            <div key={p} className="flex items-center gap-3 px-3 py-3 text-sm">
              <span className="w-6 text-muted-foreground">{i + 1}</span>
              <Logo label={p[0]} color="bg-brand" />
              <span className="flex-1 font-medium">{p}</span>
              <span className="font-bold">{20 - i * 2} goals</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ───────────────────────── TROPHIES ───────────────────────── */

const TROPHY_GROUPS = [
  {
    title: "CLUB DOMESTIC",
    rows: [
      {
        name: "Seria A",
        icon: "S",
        color: "bg-yellow-500",
        result: "WINNER 1X",
        date: "(04/09/2024 - 30/06/2025)",
      },
      {
        name: "Napoli",
        icon: "N",
        color: "bg-blue-600",
        result: "RUNNER-UP 2X",
        date: "(04/09/2024 - 30/06/2025)",
      },
    ],
  },
  {
    title: "NATIONAL",
    rows: [
      {
        name: "Seria A",
        icon: "S",
        color: "bg-yellow-500",
        result: "WINNER 1X",
        date: "2023 Côte d'Ivoire",
      },
      {
        name: "Seria A",
        icon: "S",
        color: "bg-yellow-500",
        result: "WINNER 1X",
        date: "(04/09/2024 - 30/06/2025)",
      },
      {
        name: "Napoli",
        icon: "N",
        color: "bg-blue-600",
        result: "RUNNER-UP 2X",
        date: "(04/09/2024 - 30/06/2025)",
      },
    ],
  },
];

export function TrophiesView() {
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="bg-brand text-brand-foreground px-5 py-3 text-sm font-bold tracking-wider">
        TROPHIES
      </div>
      <div className="p-4 lg:p-6 space-y-6">
        {TROPHY_GROUPS.map((g) => (
          <div key={g.title}>
            <p className="text-xs lg:text-sm font-bold tracking-wider text-foreground pb-2 border-b">
              {g.title}
            </p>
            <div className="mt-3 space-y-3">
              {g.rows.map((r, i) => (
                <div
                  key={i}
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-3 items-center gap-2 sm:gap-4 px-3 py-2 rounded-md text-sm",
                    i % 2 === 1 && "bg-secondary/60",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Logo label={r.icon} color={r.color} />
                    <span className="font-medium">{r.name}</span>
                  </div>
                  <span className="font-semibold">{r.result}</span>
                  <span className="text-foreground/80">{r.date}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ───────────────────────── INFO & ARCHIVE / VENUE ───────────────────────── */

const ARCHIVE_ROWS = [
  {
    badge: "S",
    color: "bg-yellow-400 text-black",
    name: "Seria A",
    result: "WINNER 1X",
    period: "(04/09/2024 - 30/06/2025)",
  },
  {
    badge: "N",
    color: "bg-blue-600 text-white",
    name: "Napoli",
    result: "RUNNER-UP 2X",
    period: "(04/09/2024 - 30/06/2025)",
  },
  {
    badge: "S",
    color: "bg-yellow-400 text-black",
    name: "Seria A",
    result: "WINNER 1X",
    period: "2023 Côte d'Ivoire",
  },
  {
    badge: "S",
    color: "bg-yellow-400 text-black",
    name: "Seria A",
    result: "WINNER 1X",
    period: "(04/09/2024 - 30/06/2025)",
  },
  {
    badge: "N",
    color: "bg-blue-600 text-white",
    name: "Napoli",
    result: "RUNNER-UP 2X",
    period: "(04/09/2024 - 30/06/2025)",
  },
];

export function InfoArchiveView() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              Official Website
              <a href="#" className="text-brand">
                <Info className="h-4 w-4" />
              </a>
            </h3>
            <dl className="text-sm space-y-2">
              {[
                ["Founded:", "1945"],
                ["Address:", "Olusegun Obasanjo Way Abuja"],
                ["Country:", "Nigeria"],
                ["Phone:", "+234 (9) 523 7326"],
                ["Email Address:", "nigeria_fa@yahoo.com"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-md overflow-hidden">
            <img src={IMG.stadium} alt="Stadium" className="w-full h-44 object-cover" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Stadium Info</h3>
            <dl className="text-sm space-y-2">
              {[
                ["Name:", "Abuja National Stadium"],
                ["City:", "Abuja"],
                ["Capacity:", "60291"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[90px_1fr] gap-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="bg-brand text-brand-foreground px-4 lg:px-6 py-3">
          <h3 className="text-sm font-bold tracking-wider">ARCHIVES</h3>
        </div>
        <div className="divide-y">
          {ARCHIVE_ROWS.map((r, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-1 sm:grid-cols-3 gap-2 px-4 lg:px-6 py-3 text-sm",
                i % 2 === 0 ? "bg-secondary/60" : "bg-card",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold",
                    r.color,
                  )}
                >
                  {r.badge}
                </span>
                <span>{r.name}</span>
              </div>
              <div className="font-semibold sm:text-left">{r.result}</div>
              <div className="font-semibold sm:text-left">{r.period}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
