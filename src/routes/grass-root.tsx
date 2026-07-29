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
import { IMG, trending, npfl } from "@/constants/data";

export const Route = createFileRoute("/grass-root")({
  head: () => ({
    meta: [
      { title: "Grass Root Football — Football Nigeria" },
      {
        name: "description",
        content:
          "Grass root football news, fixtures and stories across Nigeria.",
      },
    ],
  }),
  component: GrassRootPage,
});

const flagCards = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 100,
  image: IMG.flag,
  title: "Super Eagles Win AFCON Qualifier",
  date: "21 Jun 2025",
}));

function GrassRootPage() {
  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6 lg:space-y-8">
        {/* Desktop title */}
        <div className="hidden lg:block">
          <SectionHeader title="Grass Root Football" />
        </div>
        {/* Mobile title */}
        <div className="lg:hidden">
          <SectionHeader title="Local Trending News" />
        </div>

        {/* Hero */}
        <HeroPollCard
          image={IMG.poll}
          title="Nigeria Football Club Officially launches its websites with amazing features"
        />

        {/* Mobile list */}
        <div className="lg:hidden space-y-3">
          {trending.map((a) => (
            <ListCard key={a.id} {...a} />
          ))}
        </div>

        {/* Desktop trending row */}
        <div className="hidden lg:grid grid-cols-3 gap-5">
          {trending.map((a) => (
            <GridCard key={a.id} {...a} />
          ))}
        </div>

        {/* Mobile NPL section */}
        <div className="lg:hidden">
          <SectionHeader title="Nigeria Premier League" />
          <div className="space-y-3">
            {npfl.map((a) => (
              <ReadMoreCard key={a.id} {...a} />
            ))}
          </div>
        </div>

        {/* Desktop flag row */}
        <div className="hidden lg:grid grid-cols-3 gap-5">
          {flagCards.map((a) => (
            <GridCard key={a.id} {...a} />
          ))}
        </div>

        {/* Mobile Transfers */}
        <div className="lg:hidden">
          <SectionHeader title="Transfers" />
          <div className="space-y-3">
            {trending.map((a) => (
              <ListCard key={`t-${a.id}`} {...a} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
