import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
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
import { useArticles } from "@/hooks/articles/use-articles";
import { Loader2 } from "lucide-react";

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
  const { data: articlesData, isLoading: articlesLoading } = useArticles({
    per_page: 100,
    page: 1,
  });

  // Group articles by category
  const articlesByCategory = useMemo(() => {
    if (!articlesData?.data) return {};

    const grouped: Record<string, typeof articlesData.data> = {};

    articlesData.data.forEach((article) => {
      if (article.category) {
        const categoryName = article.category.name;
        if (!grouped[categoryName]) {
          grouped[categoryName] = [];
        }
        grouped[categoryName].push(article);
      }
    });

    return grouped;
  }, [articlesData]);

  const isLoading = articlesLoading;

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

        {/* Dynamic Articles by Category */}
        {isLoading ? (
          <section className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-brand" />
          </section>
        ) : (
          Object.entries(articlesByCategory).map(
            ([categoryName, articles]) =>
              articles.length > 0 && (
                <section key={categoryName}>
                  <SectionHeader title={categoryName} />
                  <div className="hidden lg:grid grid-cols-4 gap-4">
                    {articles.slice(0, 4).map((article) => (
                      <GridCard
                        key={article.id}
                        id={article.id}
                        image={article.featured_media || IMG.player1}
                        title={article.title}
                        date={article.published_at}
                      />
                    ))}
                  </div>
                  <div className="lg:hidden space-y-3">
                    {articles.slice(0, 3).map((article) => (
                      <ReadMoreCard
                        key={article.id}
                        id={article.id}
                        image={article.featured_media || IMG.player1}
                        title={article.title}
                      />
                    ))}
                  </div>
                  {articles.length > 4 && (
                    <div className="hidden lg:flex justify-end mt-3">
                      <button className="border border-brand text-brand text-xs font-semibold px-3 py-1.5 rounded hover:bg-brand hover:text-brand-foreground transition">
                        More {categoryName}
                      </button>
                    </div>
                  )}
                </section>
              )
          )
        )}

        {/* Scores & Fixtures */}
        <section>
          <SectionHeader title="Scores & Fixtures" />
          <MatchWidget fixtures={fixtures} />
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
