import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Calendar, Clock, User, Share2, Loader2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/football/Navbar";
import { MobileTopTabs, MobileBottomNav } from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { Breadcrumb } from "@/components/football/Breadcrumb";
import { CommentThread } from "@/components/football/CommentThread";
import { useArticleDetail, useArticles } from "@/hooks/articles/use-articles";
import { useArticleReactions, useToggleArticleReaction } from "@/hooks/reactions/use-reactions";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ReactionType } from "@/types/reaction";

export const Route = createFileRoute("/articles/$id")({
  head: ({ loaderData }) => {
    return {
      meta: [
        { title: "Article Details — Football Nigeria" },
        {
          name: "description",
          content: "Read the latest Nigerian football updates, analysis, and news.",
        },
      ],
    };
  },
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  // 1. Fetch Article details
  const { data: article, isLoading: isArticleLoading, error: articleError, refetch: refetchArticle } = useArticleDetail(id);

  // 2. Fetch Reactions (only enabled if article is successfully loaded)
  const { data: reactions, isLoading: isReactionsLoading } = useArticleReactions(article?.id || "");
  const toggleReactionMutation = useToggleArticleReaction(article?.id || "");

  // 3. Fetch Related Articles (same category, first 4 items)
  const { data: relatedArticlesData, isLoading: isRelatedLoading } = useArticles({
    category_id: article?.category?.id || undefined,
    per_page: 4,
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article?.title || "Football Nigeria",
          text: article?.excerpt || "Check out this article on Football Nigeria!",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  const handleReactionClick = (type: ReactionType) => {
    if (!isAuthenticated) {
      toast.error("Please log in to react to articles.", {
        action: {
          label: "Login",
          onClick: () => {
            router.navigate({
              to: "/login",
              search: { redirect: window.location.pathname },
            });
          },
        },
      });
      return;
    }
    toggleReactionMutation.mutate(type, {
      onError: (err: any) => {
        toast.error(err.message || "Failed to update reaction.");
      },
    });
  };

  // Filter out the current article from the related list
  const relatedArticles = (relatedArticlesData?.data ?? []).filter(
    (item) => item.id !== article?.id && item.slug !== article?.slug
  ).slice(0, 3);

  // ---- LOADING STATE ----
  if (isArticleLoading) {
    return (
      <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
        <Navbar />
        <MobileTopTabs />
        <div className="mx-auto max-w-7xl px-4 pt-4 lg:pt-6">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        </div>
        <main className="mx-auto max-w-4xl px-4 pt-6 space-y-6">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="aspect-video w-full bg-muted rounded-xl animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
          </div>
        </main>
        <div className="mt-12">
          <Footer />
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  // ---- ERROR STATE ----
  if (articleError || !article) {
    return (
      <div className="min-h-screen bg-secondary pb-24 lg:pb-0 flex flex-col">
        <Navbar />
        <MobileTopTabs />
        <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h1 className="text-xl font-bold text-foreground">Failed to load article</h1>
          <p className="text-sm text-muted-foreground">
            {articleError?.message || "The article you are looking for does not exist or has been removed."}
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              to="/articles"
              className="px-4 py-2 border rounded-md text-sm font-semibold bg-card hover:bg-secondary transition"
            >
              Back to Articles
            </Link>
            <button
              onClick={() => refetchArticle()}
              className="px-4 py-2 bg-brand text-brand-foreground rounded-md text-sm font-semibold hover:bg-brand/90 transition"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  // Reaction types configuration
  const reactionTypesList: { type: ReactionType; emoji: string; label: string }[] = [
    { type: "like", emoji: "👍", label: "Like" },
    { type: "love", emoji: "❤️", label: "Love" },
    { type: "wow", emoji: "😮", label: "Wow" },
    { type: "sad", emoji: "😢", label: "Sad" },
    { type: "angry", emoji: "😡", label: "Angry" },
  ];

  const userReactionType = reactions?.user_reaction?.reaction_type;

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 pt-4 lg:pt-6">
        <Breadcrumb
          items={[
            { label: "Football", href: "/" },
            { label: "News", href: "/articles" },
            { label: article.category?.name || "Articles", href: article.category ? `/articles?category_id=${article.category.id}` : "/articles" },
            { label: article.title },
          ]}
        />
      </div>

      {/* Main Layout */}
      <main className="mx-auto max-w-7xl px-4 pt-4 lg:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Article content & Comments */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            <article className="bg-card rounded-xl p-4 lg:p-6 shadow-sm border space-y-6 overflow-hidden">
              
              {/* Header Info */}
              <div className="space-y-3">
                {article.category && (
                  <Link
                    to="/articles"
                    search={{ category_id: article.category.id }}
                    className="inline-block bg-brand/10 text-brand text-xs font-bold px-2.5 py-1 rounded"
                  >
                    {article.category.name}
                  </Link>
                )}
                <h1 className="text-xl lg:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-sm lg:text-base text-muted-foreground font-medium border-l-2 border-brand/50 pl-3">
                    {article.excerpt}
                  </p>
                )}

                {/* Author & Timestamp */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground pt-1 border-t border-border/50">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <User className="h-3.5 w-3.5 text-brand" />
                    <span>{article.author.full_name}</span>
                  </div>
                  {article.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(article.published_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {article.reading_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.reading_time} min read</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border bg-muted shadow-2xs relative">
                <img
                  src={article.featured_media || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <div
                className="prose max-w-none text-foreground leading-relaxed text-sm lg:text-base space-y-4 pt-2"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Reactions & Sharing Section */}
              <div className="border-t border-b border-border/50 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                
                {/* Reactions bar */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Reactions ({reactions?.total_reactions ?? 0})
                  </span>
                  
                  {isReactionsLoading ? (
                    <div className="flex items-center gap-2 py-1">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Loading reactions...</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {reactionTypesList.map(({ type, emoji, label }) => {
                        const count = reactions?.counts?.[type] ?? 0;
                        const isActive = userReactionType === type;
                        return (
                          <button
                            key={type}
                            onClick={() => handleReactionClick(type)}
                            disabled={toggleReactionMutation.isPending}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 disabled:opacity-75",
                              isActive
                                ? "bg-brand text-brand-foreground border-brand shadow-2xs"
                                : "bg-secondary text-foreground hover:bg-muted border-border"
                            )}
                            title={label}
                          >
                            <span>{emoji}</span>
                            <span>{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Share Button */}
                <div className="sm:self-end">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 border bg-card hover:bg-secondary text-xs font-bold px-4 py-2 rounded-lg shadow-2xs transition w-full sm:w-auto justify-center"
                  >
                    <Share2 className="h-3.5 w-3.5 text-brand" /> Share Story
                  </button>
                </div>

              </div>

            </article>

            {/* Comments Thread Section */}
            <div className="bg-card rounded-xl p-4 lg:p-6 shadow-sm border">
              <CommentThread articleId={article.id} allowComments={article.allow_comments} />
            </div>

          </div>

          {/* Right Column: Sidebar (Related articles) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Related news card block */}
            <div className="bg-card rounded-xl p-4 lg:p-5 shadow-sm border space-y-4">
              <h3 className="font-extrabold text-base lg:text-lg border-b-2 border-brand pb-1.5">
                Related Stories
              </h3>

              {isRelatedLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-24 h-16 bg-muted rounded shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : relatedArticles.length > 0 ? (
                <div className="space-y-4">
                  {relatedArticles.map((item) => (
                    <div key={item.id} className="group relative flex gap-3 transition">
                      <div className="w-24 h-16 rounded overflow-hidden border shrink-0 bg-muted">
                        <img
                          src={item.featured_media || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&q=80"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to="/articles/$id"
                          params={{ id: item.slug || item.id }}
                          className="text-xs font-semibold text-foreground leading-snug line-clamp-2 hover:text-brand transition"
                        >
                          {item.title}
                        </Link>
                        {item.published_at && (
                          <span className="text-[10px] text-muted-foreground mt-1 block">
                            {new Date(item.published_at).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No related articles found.</p>
              )}
            </div>

            {/* Quick Links / Help Promo */}
            <div className="bg-brand text-brand-foreground rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-15 select-none text-9xl font-black translate-x-1/4 translate-y-1/4 leading-none">
                🦅
              </div>
              <h4 className="font-extrabold text-sm uppercase tracking-wider">Fan Club Nigeria</h4>
              <p className="text-xs opacity-90 leading-relaxed">
                Join our newsletter list and get matches alerts, exclusive analysis, and player statistics sent direct to your email box.
              </p>
              <div className="pt-1 flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-brand-foreground text-foreground px-3 py-1.5 rounded-md text-xs placeholder:text-muted-foreground outline-none w-full max-w-[160px]"
                />
                <button
                  onClick={() => toast.success("Subscribed successfully!")}
                  className="bg-card text-brand text-xs font-bold px-3 py-1.5 rounded-md hover:bg-secondary transition shrink-0"
                >
                  Join
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer & Navigation */}
      <div className="mt-12">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
}
