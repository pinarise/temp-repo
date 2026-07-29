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
  TeamsPageTabs,
  type TeamTab,
} from "@/components/football/TeamsPageTabs";
import {
  OverviewView,
  NewsView,
  VideoView,
  ScoresFixturesView,
  TablesView,
  SquadView,
  StatsView,
  TrophiesView,
  InfoArchiveView,
} from "@/components/football/TeamTabsContent";

export const Route = createFileRoute("/super-eagles")({
  head: () => ({
    meta: [
      { title: "Super Eagles — Football Nigeria" },
      {
        name: "description",
        content:
          "Super Eagles team news, fixtures, results, squad, stats, trophies and archive.",
      },
    ],
  }),
  component: SuperEaglesPage,
});

function SuperEaglesPage() {
  const [tab, setTab] = useState<TeamTab>("OVERVIEW");

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      <div className="hidden lg:block mx-auto max-w-7xl px-4 pt-6">
        <Breadcrumb
          items={[{ label: "Football", href: "/" }, { label: "Super Eagles" }]}
        />
      </div>
      <div className="lg:hidden bg-secondary px-4 py-4">
        <Breadcrumb
          items={[{ label: "Football", href: "/" }, { label: "Super Eagles" }]}
        />
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-2 lg:pt-4 space-y-4 lg:space-y-6">
        <AirtelAd />

        <div className="bg-card rounded-md shadow-sm">
          <div className="px-4 lg:px-6 py-4 lg:py-5">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">
              Super Eagles
            </h1>
          </div>
          <TeamsPageTabs active={tab} onChange={setTab} />
        </div>

        {tab === "OVERVIEW" && <OverviewView />}
        {tab === "NEWS" && <NewsView />}
        {tab === "VIDEO" && <VideoView />}
        {tab === "SCORES & FIXTURES" && <ScoresFixturesView />}
        {tab === "TABLES" && <TablesView />}
        {tab === "SQUAD" && <SquadView />}
        {tab === "STATS" && <StatsView />}
        {tab === "TROPHIES" && <TrophiesView />}
        {tab === "INFO & ARCHIVE" && <InfoArchiveView />}

        <div className="lg:hidden pt-2">
          <Link to="/" className="text-xs text-brand">
            ← Back to home
          </Link>
        </div>
      </main>

      <div className="mt-8 lg:mt-16">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
}
