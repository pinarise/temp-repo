import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/football/Navbar";
import {
  MobileTopTabs,
  MobileBottomNav,
} from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { MatchHero } from "@/components/football/MatchHero";
import { MatchDetailsBody } from "@/components/football/MatchDetailsTabs";

export const Route = createFileRoute("/match/$id")({
  head: () => ({
    meta: [
      { title: "Man United vs Chelsea — Football Nigeria" },
      {
        name: "description",
        content:
          "Live commentary, report, video highlights, stats, line-ups and head-to-head for Man United vs Chelsea.",
      },
    ],
  }),
  component: MatchPage,
});

function MatchPage() {
  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      <main className="mx-auto max-w-7xl px-4 pt-4 lg:pt-6 space-y-4 lg:space-y-5">
        <div className="bg-card rounded-md p-3 lg:p-4 shadow-sm">
          <MatchHero />
        </div>
        <MatchDetailsBody />
      </main>

      <div className="mt-8 lg:mt-12">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
}
