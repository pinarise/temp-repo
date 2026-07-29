import { BookOpen, RefreshCw } from "lucide-react";

export function NoArticlesEmptyState() {
  return (
    <section className="py-20">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-brand/10 p-4">
          <BookOpen className="w-12 h-12 text-brand" />
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-bold text-foreground">
            No Articles Available
          </h3>
          <p className="text-muted-foreground">
            We're currently working on bringing you the latest football news and updates. Check back soon!
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-brand-foreground font-semibold rounded-lg hover:bg-brand/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm font-semibold text-brand mb-2">
              Super Eagles
            </div>
            <p className="text-xs text-muted-foreground">
              Latest national team updates
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm font-semibold text-brand mb-2">
              NPFL
            </div>
            <p className="text-xs text-muted-foreground">
              Nigeria Premier League coverage
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm font-semibold text-brand mb-2">
              Transfers
            </div>
            <p className="text-xs text-muted-foreground">
              Breaking transfer news
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EmptySearchResults() {
  return (
    <section className="py-16">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-muted p-3">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            No Results Found
          </h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </div>
      </div>
    </section>
  );
}
