import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/football/Navbar";
import {
  MobileTopTabs,
  MobileBottomNav,
} from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { Breadcrumb } from "@/components/football/Breadcrumb";
import { AirtelAd } from "@/components/football/AirtelAd";
import {
  CompetitionTabs,
  type CompTab,
  CompNewsView,
  CompVideoView,
  CompScoresView,
  CompTableView,
  CompTeamsView,
} from "@/components/football/CompetitionContent";

const COMPETITION_NAMES: Record<string, string> = {
  afcon: "Africa Cup of Nations Qualifying (AFCON)",
  "world-cup": "FIFA World Cup Qualifying",
  npfl: "Nigeria Professional Football League",
  chan: "African Nations Championship",
};

export const Route = createFileRoute("/competitions/$slug")({
  head: ({ params }) => {
    const name = COMPETITION_NAMES[params.slug] ?? "Competition";
    return {
      meta: [
        { title: `${name} — Football Nigeria` },
        {
          name: "description",
          content: `${name}: news, video, scores, fixtures, tables and teams.`,
        },
      ],
    };
  },
  component: CompetitionPage,
});

function CompetitionPage() {
  const { slug } = Route.useParams();
  const name = COMPETITION_NAMES[slug] ?? "Competition";
  const [tab, setTab] = useState<CompTab>("NEWS");
  const heading =
    tab === "NEWS" ? `${name} News` : tab === "VIDEO" ? `${name} Watch` : name;

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      <div className="mx-auto max-w-7xl px-4 pt-4 lg:pt-6">
        <Breadcrumb
          items={[{ label: "Football", href: "/" }, { label: "Competitions" }]}
        />
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-4 space-y-4 lg:space-y-5">
        <AirtelAd />

        <div className="bg-card rounded-md shadow-sm">
          <div className="px-4 lg:px-6 py-4 lg:py-5">
            <h1 className="text-lg lg:text-2xl font-bold text-foreground">
              {heading}
            </h1>
          </div>
          <CompetitionTabs active={tab} onChange={setTab} />
        </div>

        {tab === "NPFL" && <CompNewsView />}
        {tab === "NEWS" && <CompNewsView />}
        {tab === "VIDEO" && <CompVideoView />}
        {tab === "SCORES & FIXTURES" && <CompScoresView />}
        {tab === "TABLE" && <CompTableView />}
        {tab === "TEAMS" && <CompTeamsView />}

        <div className="lg:hidden pt-2">
          <Link to="/" className="text-xs text-brand">
            ← Back to home
          </Link>
        </div>
      </main>

      <div className="mt-8 lg:mt-12">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
}
