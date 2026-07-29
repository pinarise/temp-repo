import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/football/Navbar";
import {
  MobileTopTabs,
  MobileBottomNav,
} from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";

export const Route = createFileRoute("/scores-fixtures")({
  head: () => ({
    meta: [
      { title: "Football Scores & Fixtures — Football Nigeria" },
      {
        name: "description",
        content:
          "Live football scores, fixtures and results across the NPFL, domestic cups, national leagues and international competitions.",
      },
    ],
  }),
  component: ScoresFixturesPage,
});

const CATEGORIES = [
  "NFL",
  "Domestic Cups",
  "Non-League",
  "National League",
  "International",
] as const;

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

function ManUtdBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="#fff200"
        stroke="#000"
        strokeWidth="1"
      />
      <circle cx="12" cy="12" r="8" fill="#da020e" />
      <path d="M12 6l3 6-3 6-3-6z" fill="#fff200" />
    </svg>
  );
}
function ChelseaBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="#034694"
        stroke="#d4a017"
        strokeWidth="1"
      />
      <circle cx="12" cy="12" r="8" fill="#fff" />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        fontSize="6"
        fontWeight="900"
        fill="#034694"
      >
        CFC
      </text>
    </svg>
  );
}

function FixtureRow({ score, alt }: { score?: string; alt: boolean }) {
  return (
    <Link
      to="/match/$id"
      params={{ id: "1" }}
      className={cn(
        "grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-2 lg:gap-3 px-3 lg:px-5 py-2.5 text-xs lg:text-sm hover:bg-secondary/70 transition",
        alt ? "bg-secondary/50" : "bg-card",
      )}
    >
      <span className="text-right truncate">Man United</span>
      <ManUtdBadge />
      <div className="flex flex-col items-center">
        <span className="border rounded-md px-3 py-1 text-[11px] lg:text-xs font-medium bg-card min-w-[60px] text-center">
          {score ?? "20:00"}
        </span>
        {score && (
          <span className="text-[10px] text-muted-foreground mt-0.5">FT</span>
        )}
      </div>
      <ChelseaBadge />
      <span className="truncate">Chelsea</span>
    </Link>
  );
}

function ScoresFixturesPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("NFL");

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      <main className="mx-auto max-w-7xl px-4 pt-4 lg:pt-6 space-y-4 lg:space-y-5">
        {/* Title + category tabs */}
        <div className="bg-card rounded-md shadow-sm">
          <h1 className="px-4 lg:px-6 py-4 lg:py-5 text-lg lg:text-2xl font-bold">
            Football Scores &amp; Fixtures
          </h1>
          <div className="border-t border-border overflow-x-auto">
            <div className="flex gap-6 lg:gap-10 px-4 lg:px-6 min-w-max">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={cn(
                    "relative py-3 lg:py-4 text-xs lg:text-sm font-semibold whitespace-nowrap transition-colors",
                    cat === c
                      ? "text-brand"
                      : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {c}
                  {cat === c && (
                    <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-brand rounded-t" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Month + day strip */}
        <div className="bg-card rounded-md shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b">
            <div className="w-6" />
            <span className="text-sm lg:text-base font-bold tracking-wider">
              MARCH
            </span>
            <button className="text-brand">
              <Calendar className="h-5 w-5" />
            </button>
          </div>
          {/* desktop strip */}
          <div className="hidden lg:flex items-center px-2 py-3">
            <button className="p-2">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 grid grid-cols-9 text-center">
              {DAYS_DESKTOP.map((d, i) => (
                <button
                  key={i}
                  className={cn(
                    "relative py-2 text-sm",
                    d.today ? "text-brand font-bold" : "text-foreground/70",
                  )}
                >
                  <div className="text-xs">{d.d}</div>
                  <div className="text-lg font-semibold">{d.n}</div>
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
          {/* mobile strip */}
          <div className="lg:hidden flex items-center px-1 py-3">
            <button className="p-2">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 grid grid-cols-3 text-center">
              {DAYS_MOBILE.map((d, i) => (
                <button
                  key={i}
                  className={cn(
                    "relative py-1.5",
                    d.today ? "text-brand font-bold" : "text-foreground/70",
                  )}
                >
                  <div className="text-xs">{d.d}</div>
                  <div className="text-lg font-semibold">{d.n}</div>
                  {d.today && (
                    <span className="absolute left-8 right-8 bottom-0 h-0.5 bg-brand rounded" />
                  )}
                </button>
              ))}
            </div>
            <button className="p-2">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Fixtures list */}
        <div className="bg-card rounded-md shadow-sm overflow-hidden">
          <p className="text-center text-xs lg:text-sm font-bold tracking-wider py-3 border-b">
            ENGLAND - PREMIER LEAGUE
          </p>
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <FixtureRow key={i} alt={i % 2 === 1} />
            ))}
          </div>
          <p className="text-center text-xs lg:text-sm font-bold tracking-wider py-3 border-y bg-card">
            WORD CUP QUALIFIERS
          </p>
          <div>
            {Array.from({ length: 4 }).map((_, i) => (
              <FixtureRow key={i} alt={i % 2 === 1} score="3  -  4" />
            ))}
          </div>
        </div>
      </main>

      <div className="mt-8 lg:mt-12">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
}
