/**
 * Single source of truth for every TanStack Query key in the app.
 *
 * Using factory functions (rather than hand-writing `["user", "me"]`
 * inline at every call site) means:
 *  - invalidation stays correct as the app grows (`queryKeys.auth.all` for
 *    "invalidate everything auth-related" vs `queryKeys.auth.me()` for one
 *    specific query),
 *  - there is exactly one place to change a key's shape, and
 *  - TypeScript can infer the key shape for `queryClient.setQueryData`.
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
    sessions: () => [...queryKeys.auth.all, "sessions"] as const,
  },
  articles: {
    all: ["articles"] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.articles.all, "list", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.articles.all, "detail", id] as const,
    categories: () => [...queryKeys.articles.all, "categories"] as const,
    tags: (params?: Record<string, unknown>) => [...queryKeys.articles.all, "tags", params ?? {}] as const,
  },
  comments: {
    all: ["comments"] as const,
    list: (articleId: string, params?: Record<string, unknown>) => [...queryKeys.comments.all, "list", articleId, params ?? {}] as const,
    detail: (id: string) => [...queryKeys.comments.all, "detail", id] as const,
  },
  reactions: {
    all: ["reactions"] as const,
    article: (articleId: string) => [...queryKeys.reactions.all, "article", articleId] as const,
    comment: (commentId: string) => [...queryKeys.reactions.all, "comment", commentId] as const,
  },
} as const;
