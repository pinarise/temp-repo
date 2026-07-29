import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Play,
  Facebook,
  Twitter,
  Mail,
  Link as LinkIcon,
  ThumbsUp,
  ThumbsDown,
  Star,
} from "lucide-react";
import { IMG } from "../../constants/data";

export const MATCH_TABS_DESKTOP = ["COMMENTARY", "STATS", "TEAM"] as const;
export const MATCH_TABS_MOBILE = [
  "COMMENTARY",
  "REPORT",
  "TABLES",
  "LINE-UPS",
  "MATCH STATS",
  "HEAD TO HEAD",
] as const;
export type MatchTab = (typeof MATCH_TABS_DESKTOP)[number] | (typeof MATCH_TABS_MOBILE)[number];

export function MatchTabs({
  active,
  onChange,
}: {
  active: MatchTab;
  onChange: (t: MatchTab) => void;
}) {
  return (
    <div className="border-b border-border bg-card">
      {/* Mobile tabs */}
      <div className="lg:hidden flex gap-6 px-4 overflow-x-auto min-w-0">
        {MATCH_TABS_MOBILE.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={cn(
              "relative py-3 text-[11px] font-bold tracking-wider whitespace-nowrap transition-colors",
              active === t ? "text-brand" : "text-foreground/70 hover:text-foreground",
            )}
          >
            {t}
            {active === t && (
              <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-brand rounded-t" />
            )}
          </button>
        ))}
      </div>
      {/* Desktop tabs */}
      <div className="hidden lg:flex gap-10 px-6">
        {MATCH_TABS_DESKTOP.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={cn(
              "relative py-4 text-xs font-bold tracking-wider whitespace-nowrap transition-colors",
              active === t ? "text-brand" : "text-foreground/70 hover:text-foreground",
            )}
          >
            {t}
            {active === t && (
              <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-brand rounded-t" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- COMMENTARY ---------- */
function CommentaryItem({
  withVideo = false,
  title = "Nigeria Team News",
}: {
  withVideo?: boolean;
  title?: string;
}) {
  return (
    <article className="flex gap-3 lg:gap-5">
      <div className="shrink-0 pl-1">
        <div className="border-l-[3px] border-brand pl-2 text-[10px] lg:text-xs leading-tight text-muted-foreground">
          <p>1h ago</p>
          <p className="font-semibold text-foreground">13:00</p>
        </div>
      </div>
      <div className="flex-1 min-w-0 pb-6 border-b border-border last:border-b-0">
        <h3 className="text-sm lg:text-base font-bold mb-2">{title}</h3>
        <div className="relative rounded overflow-hidden mb-2">
          <img
            src={withVideo ? IMG.videoHero : IMG.action}
            alt=""
            className="w-full h-44 lg:h-52 object-cover"
          />
          {withVideo && (
            <span className="absolute inset-0 grid place-items-center">
              <span className="h-10 w-10 rounded-full bg-white/90 grid place-items-center">
                <Play className="h-4 w-4 text-brand fill-brand ml-0.5" />
              </span>
            </span>
          )}
        </div>
        <p className="text-sm font-semibold">Hello!</p>
        <p className="text-sm text-foreground/80 mt-1">
          Nigeria came mightily close to ending that wait under coach Amadu ith two European
          Championship finals but the FA cup.
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-muted-foreground text-xs">
            <button className="inline-flex items-center gap-1.5">
              <ThumbsUp className="h-4 w-4" />
              Likes
            </button>
            <button className="inline-flex items-center gap-1.5">
              <ThumbsDown className="h-4 w-4" />
              Likes
            </button>
          </div>
          <div className="flex items-center gap-3 text-foreground/80">
            <Facebook className="h-4 w-4" />
            <Twitter className="h-4 w-4" />
            <Mail className="h-4 w-4" />
            <LinkIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function CommentaryView() {
  return (
    <div className="space-y-6">
      <CommentaryItem />
      <CommentaryItem />
      <CommentaryItem withVideo title="Eric confident Nigeria will Qualify for World Cup" />
    </div>
  );
}

/* ---------- REPORT ---------- */
function ReportBlock({ video = false }: { video?: boolean }) {
  return (
    <div className="space-y-3">
      <div className="relative rounded overflow-hidden max-w-2xl">
        <img
          src={video ? IMG.videoHero : IMG.action}
          alt=""
          className="w-full h-48 lg:h-56 object-cover"
        />
        {video && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="h-12 w-12 rounded-full bg-white/90 grid place-items-center">
              <Play className="h-5 w-5 text-brand fill-brand ml-0.5" />
            </span>
          </span>
        )}
      </div>
      <p className="text-sm font-semibold">Lorem ipsum dolor sit amet consectetur.</p>
      <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl">
        Mi mi mattis id augue sed. Ac vehicula viverra convallis est praesent vitae duis porttitor
        ultrices. Adipiscing faucibus quis turpis sagittis quisque at. Consectetur venenatis vitae
        sed purus. Et magna morbi bibendum nunc est. Risus tellus ultrices fames viverra ante. Ac
        magna sit consectetur et neque. Purus cum a aliquet leo mi non tempus. Velit semper pulvinar
        pulvinar viverra faucibus eget sodales. Risus quam malesuada consectetur fermentum nullam ut
        fames urna fringilla. Nisi diam cras sagittis nisi tristique. Aliquam sed leo massa et
        netus. Pellentesque tortor ac viverra viverra arcu erat nec. Dui lectus nisi tincidunt
        ornare.
      </p>
      <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl">
        Fermentum orci varius lacinia sit. Tellus semper nibh ac curabitur. Orci eu feugiat
        ultricies pellentesque. Sed ut sed arcu non a morbi cursus suscipit. Cursus ac ut magna urna
        massa. Neque non habitasse consequat sed blandit suspendisse non tellus velit. Vulputate
        ornare cursus tristique sed ultricies condimentum. Dictum ultricies tempus volutpat faucibus
        risus risus quam.
      </p>
    </div>
  );
}

export function ReportView() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <ReportBlock />
      <ReportBlock video />

      <div className="rounded-md overflow-hidden border bg-card">
        <div className="bg-gradient-to-r from-[#0b6b3a] to-[#0a5a32] text-white px-5 py-4">
          <p className="text-center text-xs">Player of the Match</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-lg font-bold">Victor Oshimen</p>
            <p className="inline-flex items-center gap-1 font-bold">
              <Star className="h-4 w-4 fill-white" /> 7.9
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-10 border-b text-sm">
          <button className="py-2 text-foreground/70">Nigeria</button>
          <button className="py-2 text-brand font-semibold border-b-2 border-brand">Ghana</button>
        </div>
        <div className="divide-y">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="px-4 py-2.5">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span>12 Musa Ahmed</span>
                <span className="font-semibold">6.03</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-brand" style={{ width: "60%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- VIDEO ---------- */
function VideoTile() {
  return (
    <a
      href="#"
      className="block bg-card rounded-md border overflow-hidden hover:shadow-md transition"
    >
      <div className="relative aspect-video">
        <img src={IMG.videoHero} alt="" className="w-full h-full object-cover" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="h-12 w-12 rounded-full bg-white/90 grid place-items-center">
            <Play className="h-5 w-5 text-brand fill-brand ml-0.5" />
          </span>
        </span>
      </div>
      <p className="p-3 text-sm font-semibold leading-snug">
        Fulham 2-1 Chelsea | Premier League highlights
      </p>
    </a>
  );
}

export function VideoView() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <VideoTile key={i} />
      ))}
    </div>
  );
}

/* ---------- STATS (Match Stats - side-by-side comparison) ---------- */
const STAT_ROWS = [
  "Possession %",
  "Total Shots",
  "On Target",
  "Off Taget",
  "Blocked",
  "Passing %",
  "Clear-Cut Chances",
  "Corner Kicks",
  "Offsides",
  "Tackles %",
  "Aerial Duels %",
  "Saves",
  "Fouls Committed",
  "Fouls Won",
  "Yellow Cards",
  "Red Cards",
];

function StatRow({ label }: { label: string }) {
  return (
    <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3 px-3 lg:px-5 py-2 text-xs lg:text-sm">
      <span className="font-semibold">56%</span>
      <div>
        <p className="text-center font-medium mb-1.5">{label}</p>
        <div className="grid grid-cols-2 gap-1">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden flex justify-end">
            <div className="h-full bg-brand" style={{ width: "56%" }} />
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-foreground/70" style={{ width: "44%" }} />
          </div>
        </div>
      </div>
      <span className="font-semibold text-right">44%</span>
    </div>
  );
}

export function MatchStatsView() {
  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <div className="bg-brand text-brand-foreground px-4 py-3 text-xs lg:text-sm font-bold tracking-wider">
        MATCH STATISTICS
      </div>
      <div className="px-4 lg:px-5 py-4 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2 font-semibold">
          <span className="h-7 w-7 rounded-full bg-red-600 grid place-items-center text-white text-[10px] font-bold">
            MU
          </span>
          Man United
        </span>
        <span className="inline-flex items-center gap-2 font-semibold">
          Chelsea
          <span className="h-7 w-7 rounded-full bg-blue-700 grid place-items-center text-white text-[10px] font-bold">
            CH
          </span>
        </span>
      </div>
      <div className="divide-y">
        {STAT_ROWS.map((r) => (
          <StatRow key={r} label={r} />
        ))}
      </div>
    </div>
  );
}

/* ---------- TABLES (Premier League full standings) ---------- */
type FormResult = "W" | "L" | "D";

function FormBadge({ r }: { r: FormResult }) {
  const cls =
    r === "W"
      ? "bg-green-500 text-white"
      : r === "L"
        ? "bg-red-500 text-white"
        : "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-grid place-items-center h-5 w-5 rounded-full text-[10px] font-bold",
        cls,
      )}
    >
      {r}
    </span>
  );
}

const STANDINGS = [
  {
    team: "Rivers United",
    initial: "R",
    color: "bg-blue-100 text-blue-700",
    form: ["D", "L", "W", "W", "W"] as FormResult[],
  },
  {
    team: "Remo Stars",
    initial: "R",
    color: "bg-yellow-100 text-yellow-700",
    form: ["D", "L", "D", "L", "D"] as FormResult[],
  },
  {
    team: "Shooting Stars",
    initial: "S",
    color: "bg-amber-100 text-amber-700",
    form: ["D", "L", "W", "L", "D"] as FormResult[],
  },
  {
    team: "Ikorodu City",
    initial: "I",
    color: "bg-orange-100 text-orange-700",
    form: ["D", "L", "D", "L", "D"] as FormResult[],
  },
  {
    team: "Niger Tornadoes",
    initial: "N",
    color: "bg-indigo-100 text-indigo-700",
    form: ["D", "L", "W", "L", "D"] as FormResult[],
  },
  {
    team: "Niger Tornadoes",
    initial: "N",
    color: "bg-indigo-100 text-indigo-700",
    form: ["W", "L", "D", "D", "D"] as FormResult[],
  },
  {
    team: "Niger Tornadoes",
    initial: "N",
    color: "bg-indigo-100 text-indigo-700",
    form: ["D", "L", "D", "L", "D"] as FormResult[],
  },
  {
    team: "Niger Tornadoes",
    initial: "N",
    color: "bg-indigo-100 text-indigo-700",
    form: ["D", "L", "L", "L", "D"] as FormResult[],
  },
  {
    team: "Niger Tornadoes",
    initial: "N",
    color: "bg-indigo-100 text-indigo-700",
    form: ["W", "L", "L", "L", "D"] as FormResult[],
  },
  {
    team: "Niger Tornadoes",
    initial: "N",
    color: "bg-indigo-100 text-indigo-700",
    form: ["W", "W", "L", "D", "D"] as FormResult[],
  },
  {
    team: "Niger Tornadoes",
    initial: "N",
    color: "bg-indigo-100 text-indigo-700",
    form: ["D", "L", "W", "L", "D"] as FormResult[],
  },
  {
    team: "Niger Tornadoes",
    initial: "N",
    color: "bg-indigo-100 text-indigo-700",
    form: ["D", "L", "D", "L", "D"] as FormResult[],
  },
];

export function TablesView() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card overflow-hidden">
        <div className="bg-brand text-brand-foreground px-4 py-2.5 text-center text-xs lg:text-sm font-bold tracking-wider">
          PREMIER LEAGUE TABLE
        </div>

        {/* Desktop full table */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[40px_minmax(160px,1fr)_40px_40px_40px_40px_40px_44px_140px] items-center gap-2 px-4 py-2 text-[11px] font-semibold text-muted-foreground bg-secondary/60">
            <span>#</span>
            <span>Team</span>
            <span className="text-center">PL</span>
            <span className="text-center">W</span>
            <span className="text-center">D</span>
            <span className="text-center">L</span>
            <span className="text-center">GD</span>
            <span className="text-center">Pts</span>
            <span className="text-center">FORM</span>
          </div>
          {STANDINGS.map((s, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-[40px_minmax(160px,1fr)_40px_40px_40px_40px_40px_44px_140px] items-center gap-2 px-4 py-2.5 text-sm border-t",
                i % 2 === 1 && "bg-brand-soft/40",
              )}
            >
              <span className="text-muted-foreground">
                {i === 0 ? "1." : i === 1 ? "2." : i === 2 ? "3." : i === 3 ? "4." : "5."}
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-6 w-6 rounded-full grid place-items-center text-[10px] font-bold",
                    s.color,
                  )}
                >
                  {s.initial}
                </span>
                <span className="truncate">{s.team}</span>
              </span>
              <span className="text-center">56</span>
              <span className="text-center">26</span>
              <span className="text-center">33</span>
              <span className="text-center">3</span>
              <span className="text-center">2</span>
              <span className="text-center font-bold">89</span>
              <span className="flex items-center justify-center gap-1">
                {s.form.map((r, k) => (
                  <FormBadge key={k} r={r} />
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile condensed (Team / PL / GD / Pts) */}
        <div className="md:hidden">
          <div className="grid grid-cols-[28px_1fr_44px_44px_44px] items-center gap-2 px-3 py-2 text-[11px] font-semibold text-muted-foreground bg-secondary/60">
            <span></span>
            <span>Team</span>
            <span className="text-center">PL</span>
            <span className="text-center">GD</span>
            <span className="text-center">Pts</span>
          </div>
          {STANDINGS.slice(0, 11).map((s, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-[28px_1fr_44px_44px_44px] items-center gap-2 px-3 py-3 text-sm border-t",
                i % 2 === 1 && "bg-brand-soft/40",
              )}
            >
              <span className="text-muted-foreground">{i + 1}</span>
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className={cn(
                    "h-6 w-6 rounded-full grid place-items-center text-[10px] font-bold shrink-0",
                    s.color,
                  )}
                >
                  {s.initial}
                </span>
                <span className="truncate">{s.team}</span>
              </span>
              <span className="text-center">56</span>
              <span className="text-center">26</span>
              <span className="text-center font-bold">89</span>
            </div>
          ))}
        </div>

        {/* Legends */}
        <div className="border-t bg-secondary/40 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold mb-2">Qualification/Relegation</p>
            <ul className="space-y-1.5 text-foreground/80">
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-blue-500" />
                UEFA Champions League Group State
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-yellow-400" />
                Europa League Group State
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-red-500" />
                Relegation
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Last 5 Matches</p>
            <ul className="space-y-1.5 text-foreground/80">
              <li className="flex items-center gap-2">
                <FormBadge r="W" />
                Win
              </li>
              <li className="flex items-center gap-2">
                <FormBadge r="D" />
                Draw
              </li>
              <li className="flex items-center gap-2">
                <FormBadge r="L" />
                Loss
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- LINE-UPS / TEAM ---------- */
function CrestMU({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="15" fill="#fff200" stroke="#000" strokeWidth="1" />
      <circle cx="16" cy="16" r="11" fill="#da020e" />
      <text x="16" y="20" textAnchor="middle" fontSize="8" fontWeight="900" fill="#000">
        MU
      </text>
    </svg>
  );
}
function CrestCH({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="15" fill="#034694" stroke="#d4a017" strokeWidth="1" />
      <circle cx="16" cy="16" r="10" fill="#fff" />
      <text x="16" y="19" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#034694">
        CFC
      </text>
    </svg>
  );
}

const PLAYERS = ["Mohamed Salah", "Haaland E.", "Thiago I.", "Semenyo A.", "Calvert-Lewin D."];

function TeamLineupCard({
  name,
  crest,
  crestSide = "left",
}: {
  name: string;
  crest: "MU" | "CH";
  crestSide?: "left" | "right";
}) {
  const CrestEl =
    crest === "MU" ? <CrestMU className="h-7 w-7" /> : <CrestCH className="h-7 w-7" />;
  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <div
        className={cn(
          "bg-secondary/70 px-4 py-3 flex items-center gap-2.5",
          crestSide === "right" && "flex-row-reverse",
        )}
      >
        {CrestEl}
        <p className="font-semibold">{name}</p>
      </div>
      <div className="px-4 pt-3 pb-1 text-sm font-semibold">Player Names</div>
      <ul className="divide-y">
        {PLAYERS.map((p, i) => (
          <li key={`s-${i}`} className="px-4 py-2.5 text-sm flex gap-3">
            <span className="text-muted-foreground w-6">23</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <div className="px-4 pt-3 pb-1 text-sm font-semibold">Substitutes</div>
      <ul className="divide-y">
        {PLAYERS.map((p, i) => (
          <li key={`b-${i}`} className="px-4 py-2.5 text-sm flex gap-3">
            <span className="text-muted-foreground w-6">23</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LineupsView() {
  return (
    <div className="space-y-5">
      <div className="rounded-md overflow-hidden">
        <div className="bg-brand text-brand-foreground px-4 py-2.5 text-xs font-bold tracking-wider">
          LINE-UPS
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TeamLineupCard name="Man United" crest="MU" crestSide="left" />
        <TeamLineupCard name="Chelsea" crest="CH" crestSide="right" />
      </div>

      <div className="bg-card/50 pt-2">
        <p className="font-bold text-sm mb-2">Match Officials</p>
        <dl className="text-sm space-y-1.5">
          <div>
            <span className="font-semibold">Referee:</span> Alejandro José Hernández Hernández
          </div>
          <div>
            <span className="font-semibold">Video Assistant Referee:</span> César Soto Grado
          </div>
          <div>
            <span className="font-semibold">Assistant Referee 1:</span> José Enrique Naranjo Pérez
          </div>
          <div>
            <span className="font-semibold">Assistant Referee 2:</span> Diego Sánchez Rojo
          </div>
          <div>
            <span className="font-semibold">Fourth Official:</span> Alejandro Muñiz Ruiz
          </div>
          <div>
            <span className="font-semibold">Assistant VAR Official:</span> Valentín Pizarro Gómez
          </div>
        </dl>
      </div>
    </div>
  );
}

export function TeamView() {
  return <LineupsView />;
}

/* ---------- HEAD TO HEAD (Team Form) ---------- */
function H2HMatchRow({ result }: { result: FormResult }) {
  return (
    <div className="grid grid-cols-[88px_1fr_36px] items-center gap-3 px-3 py-2.5 text-xs lg:text-sm border-t first:border-t-0">
      <span className="text-muted-foreground">
        29.011. <span className="font-semibold text-foreground">14:00</span>
      </span>
      <div className="grid grid-cols-[1fr_28px] gap-2">
        <div className="space-y-0.5">
          <p className="font-semibold">Shooting Stars</p>
          <p className="text-muted-foreground">Eyimba</p>
        </div>
        <div className="text-right space-y-0.5">
          <p>3</p>
          <p>1</p>
        </div>
      </div>
      <div className="justify-self-end">
        <FormBadge r={result} />
      </div>
    </div>
  );
}

function H2HBlock({ title, results }: { title: string; results: FormResult[] }) {
  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <div className="bg-brand text-brand-foreground px-3 py-2 text-xs font-bold tracking-wider">
        {title}
      </div>
      <div className="flex items-center gap-5 px-3 py-2 text-xs border-b">
        <button className="font-semibold text-brand border-b-2 border-brand pb-0.5">All</button>
        <button className="text-foreground/70">Home</button>
        <button className="text-foreground/70">Away</button>
      </div>
      <div>
        {results.map((r, i) => (
          <H2HMatchRow key={i} result={r} />
        ))}
      </div>
    </div>
  );
}

export function HeadToHeadView() {
  const previous: FormResult[] = ["W", "L", "W", "D", "W"];
  const nigeria: FormResult[] = ["W", "L", "W", "D", "W"];
  const ghana: FormResult[] = ["W", "W", "W", "W", "W"];

  return (
    <div className="space-y-5">
      {/* Team Form Summary */}
      <div className="rounded-md border bg-card overflow-hidden">
        <div className="bg-brand text-brand-foreground px-4 py-2.5 text-center text-xs lg:text-sm font-bold tracking-wider">
          TEAM FORM
        </div>
        <div className="px-4 pt-3 flex items-center gap-5 text-[11px] font-semibold tracking-wider">
          <button className="text-foreground border-b-2 border-foreground pb-1">
            PREVIOUS MEETINGS
          </button>
          <button className="text-foreground/60 pb-1">ALL COMPETITIONS</button>
        </div>
        <div className="px-4 py-4">
          <div className="rounded-full border px-3 py-2.5 grid grid-cols-[auto_1fr_1fr_1fr_auto] items-center gap-2 lg:gap-4">
            <CrestMU className="h-7 w-7" />
            <div className="flex flex-col items-center">
              <span className="px-3 lg:px-5 py-1 rounded-full bg-red-500 text-white text-sm font-bold min-w-[56px] text-center">
                4
              </span>
              <span className="text-[11px] text-muted-foreground mt-1">Wins</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="px-3 lg:px-5 py-1 rounded-full bg-muted text-foreground text-sm font-bold min-w-[56px] text-center">
                4
              </span>
              <span className="text-[11px] text-muted-foreground mt-1">Draws</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="px-3 lg:px-5 py-1 rounded-full bg-blue-600 text-white text-sm font-bold min-w-[56px] text-center">
                14
              </span>
              <span className="text-[11px] text-muted-foreground mt-1">Wins</span>
            </div>
            <CrestCH className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Previous meetings (full width) */}
      <H2HBlock title="PREVIOUS MEETINGS" results={previous} />

      {/* Nigeria / Ghana side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <H2HBlock title="NIGERIA" results={nigeria} />
        <H2HBlock title="GHANA" results={ghana} />
      </div>
    </div>
  );
}

/* ---------- NEWS ---------- */
function NewsCard() {
  return (
    <a
      href="#"
      className="block rounded-md border bg-card overflow-hidden hover:shadow-md transition"
    >
      <img src={IMG.celebrate} alt="" className="w-full h-44 object-cover" />
      <div className="p-4">
        <h3 className="text-sm lg:text-base font-bold leading-snug">
          World Cup Qualifier: Eric Chelle Invites Eagles Legends To Inspire Players
        </h3>
        <div className="mt-3 inline-block">
          <span className="text-xs font-semibold text-brand border-b border-brand pb-0.5">
            Read More
          </span>
        </div>
      </div>
    </a>
  );
}

export function NewsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <NewsCard key={i} />
      ))}
    </div>
  );
}

/* ---------- Tab Switcher Map ---------- */
export function MatchTabsContent({ tab }: { tab: MatchTab }) {
  switch (tab) {
    case "COMMENTARY":
      return <CommentaryView />;
    case "REPORT":
      return <ReportView />;
    case "STATS":
      // Desktop STATS view = match stats + team form + previous meetings + Nigeria/Ghana
      return (
        <div className="space-y-5">
          <MatchStatsView />
          <HeadToHeadView />
        </div>
      );
    case "MATCH STATS":
      return <MatchStatsView />;
    case "TABLES":
      return <TablesView />;
    case "LINE-UPS":
      return <LineupsView />;
    case "HEAD TO HEAD":
      return <HeadToHeadView />;
    case "TEAM":
      return <TeamView />;
  }
}

export function MatchDetailsBody() {
  const [tab, setTab] = useState<MatchTab>("COMMENTARY");
  return (
    <div className="space-y-4 lg:space-y-5">
      <div className="bg-card rounded-md shadow-sm">
        <MatchTabs active={tab} onChange={setTab} />
      </div>
      <MatchTabsContent tab={tab} />
    </div>
  );
}
