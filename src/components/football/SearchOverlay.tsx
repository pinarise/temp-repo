import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useArticles } from "@/hooks/articles/use-articles";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const { data: searchResults, isLoading } = useArticles(
    debouncedQuery
      ? {
          search: debouncedQuery,
          per_page: 5,
          status: "published",
        }
      : undefined
  );

  // If there's no query, we don't display results
  const articles = debouncedQuery ? searchResults?.data ?? [] : [];

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm dark:bg-background/95 animate-in fade-in duration-200">
      <div className="mx-auto max-w-3xl px-4 pt-10 lg:pt-16">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, categories, or news..."
                className="w-full rounded-full bg-white dark:bg-card shadow-md px-5 py-3 lg:py-4 pr-12 text-sm lg:text-base text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-brand dark:focus:ring-brand"
              />
              {isLoading ? (
                <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-brand" />
              ) : (
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              )}
            </div>

            {debouncedQuery && (
              <div className="mt-6 space-y-4">
                <div className="border-b pb-2">
                  <span className="inline-block text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Search Results ({articles.length})
                  </span>
                </div>

                {articles.length > 0 ? (
                  <div className="divide-y max-h-[60vh] overflow-y-auto pr-2">
                    {articles.map((article) => (
                      <Link
                        key={article.id}
                        to="/articles/$id"
                        params={{ id: article.slug }}
                        onClick={onClose}
                        className="flex gap-4 py-3 hover:bg-muted/50 rounded-lg px-2 transition-colors group"
                      >
                        <div className="w-16 h-12 bg-muted rounded overflow-hidden shrink-0">
                          <img
                            src={
                              article.featured_media ||
                              "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"
                            }
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-foreground group-hover:text-brand transition line-clamp-1">
                            {article.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {article.excerpt || "Read the full story..."}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  !isLoading && (
                    <div className="py-8 text-center text-muted-foreground text-sm">
                      No articles found for "{debouncedQuery}".
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close search"
            className="rounded-full border border-border text-muted-foreground p-2 hover:bg-muted hover:text-foreground transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
