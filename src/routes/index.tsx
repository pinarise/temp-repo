import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/football/Navbar";
import {
  MobileTopTabs,
  MobileBottomNav,
} from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { SectionHeader } from "@/components/football/SectionHeader";
import {
  HeroPollCard,
  GridCard,
  ListCard,
  ReadMoreCard,
} from "@/components/football/ArticleCards";
import { MatchWidget } from "@/components/football/MatchWidget";
import { VideoHero } from "@/components/football/VideoCard";
import {
  IMG,
  trending,
  latestNews,
  superEagles,
  npfl,
  fixtures,
  videos,
} from "@/constants/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Football Nigeria — Super Eagles, NPFL, Transfers & Videos" },
      {
        name: "description",
        content:
          "Latest Nigerian football news: Super Eagles, NPFL, AFCON qualifiers, transfers, fixtures and videos.",
      },
      { property: "og:title", content: "Football Nigeria" },
      {
        property: "og:description",
        content: "Your home for Nigerian football news.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileTopTabs />

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-10">
        {/* Trending / Hero */}
        <section>
          <div className="lg:hidden mb-4">
            <SectionHeader title="Trending Stories" />
          </div>
          <div className="space-y-4">
            <HeroPollCard
              image={IMG.poll}
              title="Nigeria Football Club Officially launches its websites with amazing features"
            />
            <div className="hidden lg:grid grid-cols-3 gap-4">
              {trending.map((a) => (
                <GridCard key={a.id} {...a} />
              ))}
              <GridCard
                id={4}
                image={IMG.car}
                title="Super Eagles Win AFCON Qualifier"
                date="21 Jun 2025"
              />
              <GridCard
                id={5}
                image={IMG.trophy}
                title="Super Eagles Win AFCON Qualifier"
                date="21 Jun 2025"
              />
            </div>
            <div className="lg:hidden space-y-3">
              {trending.map((a) => (
                <ListCard key={a.id} {...a} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section>
          <SectionHeader title="Latest News" />
          <div className="hidden lg:grid grid-cols-3 gap-4">
            {latestNews.map((a) => (
              <GridCard key={a.id} {...a} />
            ))}
          </div>
          <div className="lg:hidden space-y-3">
            {latestNews.slice(0, 3).map((a) => (
              <ListCard key={a.id} {...a} />
            ))}
          </div>
          <div className="hidden lg:flex justify-end mt-3">
            <button className="border border-brand text-brand text-xs font-semibold px-3 py-1.5 rounded hover:bg-brand hover:text-brand-foreground transition">
              More Latest News
            </button>
          </div>
        </section>

        {/* Transfers (mobile) */}
        <section className="lg:hidden">
          <SectionHeader title="Transfers" />
          <div className="space-y-3">
            {trending.map((a) => (
              <ListCard key={`t-${a.id}`} {...a} />
            ))}
          </div>
        </section>

        {/* Super Eagles */}
        <section>
          <SectionHeader title="Super Eagles" />
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {superEagles.map((a) => (
              <GridCard key={a.id} {...a} date="" />
            ))}
          </div>
          <div className="lg:hidden space-y-3">
            {superEagles.map((a) => (
              <ReadMoreCard key={a.id} {...a} />
            ))}
          </div>
        </section>

        {/* NPFL */}
        <section>
          <SectionHeader title="Nigeria Premier League" />
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {npfl.map((a) => (
              <GridCard key={a.id} {...a} date="" />
            ))}
          </div>
          <div className="lg:hidden space-y-3">
            {npfl.map((a) => (
              <ReadMoreCard key={a.id} {...a} />
            ))}
          </div>
        </section>

        {/* Scores & Fixtures */}
        <section>
          <SectionHeader title="Scores & Fixtures" />
          <MatchWidget fixtures={fixtures} />
        </section>

        {/* Featured Analysis (desktop) */}
        <section className="hidden lg:block">
          <SectionHeader title="Featured Analysis" />
          <div className="grid grid-cols-4 gap-4">
            {npfl.map((a) => (
              <ReadMoreCard key={`fa-${a.id}`} {...a} />
            ))}
          </div>
        </section>

        {/* Videos */}
        <section>
          <SectionHeader title="Videos" />
          <VideoHero image={IMG.videoHero} title="Watch fans celebrate" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {videos.map((v) => (
              <div key={v.id} className="lg:block">
                <div className="hidden lg:block">
                  <GridCard {...v} />
                </div>
                <div className="lg:hidden">
                  <ReadMoreCard {...v} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-3">
            <button className="border border-brand text-brand text-xs font-semibold px-4 py-2 rounded hover:bg-brand hover:text-brand-foreground transition">
              Watch More Videos
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
