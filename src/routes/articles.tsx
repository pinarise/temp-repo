import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Search, ChevronLeft, ChevronRight, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { Navbar } from "@/components/football/Navbar";
import { MobileTopTabs, MobileBottomNav } from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { Breadcrumb } from "@/components/football/Breadcrumb";
import { GridCard } from "@/components/football/ArticleCards";
import { useArticles, useCategories } from "@/hooks/articles/use-articles";
import { cn } from "@/lib/utils";
import type { ArticleStatus } from "@/types/article";

const articlesSearchSchema = z.object({
  page: z.number().catch(1).optional(),
  search: z.string().catch("").optional(),
  category_id: z.string().catch("").optional(),
  tag_ids: z.string().catch("").optional(),
  status: z.enum(["draft", "editorial_review", "changes_requested", "published", "scheduled"]).optional(),
  sort: z.string().catch("latest").optional(),
});

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "All Articles — Football Nigeria" },
      {
        name: "description",
        content: "Browse and search all Nigerian football articles, match reviews, news, and analysis.",
      },
    ],
  }),
  validateSearch: articlesSearchSchema,
  component: ArticlesListPage,
});

function ArticlesListPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  
  const page = searchParams.page ?? 1;
  const search = searchParams.search ?? "";
  const category_id = searchParams.category_id ?? "";
  const status = searchParams.status;
  const sort = searchParams.sort ?? "latest";

  const [searchInput, setSearchInput] = useState(search);

  // Sync state with url search param
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const { data: articlesData, isLoading, isPlaceholderData } = useArticles({
    page,
    search: search || undefined,
    category_id: category_id || undefined,
    status: status,
    per_page: 9,
  });

  const { data: categories } = useCategories({ active_only: true });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      search: (prev) => ({ ...prev, search: searchInput, page: 1 }),
    });
  };

  const handleCategorySelect = (catId: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        category_id: catId === category_id ? undefined : catId,
        page: 1,
      }),
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  const articles = articlesData?.data ?? [];
  const lastPage = articlesData?.last_page ?? 1;

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      <div className="mx-auto max-w-7xl px-4 pt-4 lg:pt-6">
        <Breadcrumb items={[{ label: "Football", href: "/" }, { label: "News & Articles" }]} />
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-4 space-y-6 lg:space-y-8">
        <div className="bg-card rounded-xl p-4 lg:p-6 shadow-sm border space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-3xl font-extrabold text-foreground tracking-tight">
                Football Nigeria Articles
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Explore the latest updates, breaking news, match commentaries, and detailed reports.
              </p>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-xs">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-full bg-secondary px-4 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-brand"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Categories Filter */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">
              <Filter className="h-3 w-3" /> Categories
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategorySelect("")}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border font-semibold transition-all",
                  !category_id
                    ? "bg-brand text-brand-foreground border-brand shadow-sm"
                    : "bg-secondary text-foreground hover:bg-muted"
                )}
              >
                All News
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border font-semibold transition-all",
                    category_id === cat.id
                      ? "bg-brand text-brand-foreground border-brand shadow-sm"
                      : "bg-secondary text-foreground hover:bg-muted"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden border animate-pulse space-y-4">
                <div className="aspect-[16/10] bg-muted w-full" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-1/4 pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <GridCard
                  key={article.id}
                  id={article.id}
                  slug={article.slug}
                  title={article.title}
                  image={article.featured_media ?? undefined}
                  date={article.published_at ? new Date(article.published_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }) : undefined}
                />
              ))}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={page <= 1 || isPlaceholderData}
                  onClick={() => handlePageChange(page - 1)}
                  className="p-2 border rounded-md bg-card hover:bg-secondary disabled:opacity-50 transition"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold">
                  Page {page} of {lastPage}
                </span>
                <button
                  disabled={page >= lastPage || isPlaceholderData}
                  onClick={() => handlePageChange(page + 1)}
                  className="p-2 border rounded-md bg-card hover:bg-secondary disabled:opacity-50 transition"
                  aria-label="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-xl p-12 border text-center space-y-3">
            <p className="text-lg font-semibold text-muted-foreground">No articles found</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              We couldn't find any articles matching your filters. Try clearing your search or category selection.
            </p>
            <button
              onClick={() => {
                setSearchInput("");
                navigate({ search: {} });
              }}
              className="mt-2 inline-flex items-center justify-center bg-brand text-brand-foreground rounded-md px-4 py-2 text-sm font-semibold hover:bg-brand/90 transition shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <div className="mt-12">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
}
