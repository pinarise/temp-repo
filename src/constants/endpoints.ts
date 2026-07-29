/**
 * Every backend route the frontend calls, in one place — mirrors
 * `routes/api.php` on the Laravel backend. Paths are relative to
 * `env.apiBaseUrl` (which already includes `/api`), so these start at
 * `/v1/...`.
 */
export const ENDPOINTS = {
  auth: {
    register: "/v1/auth/register",
    login: "/v1/auth/login",
    oauthLogin: (provider: string) => `/v1/auth/oauth/${provider}`,
    forgotPassword: "/v1/auth/forgot-password",
    resetPassword: "/v1/auth/reset-password",
    refresh: "/v1/auth/refresh",
    logout: "/v1/auth/logout",
    logoutAll: "/v1/auth/logout-all",
    changePassword: "/v1/auth/change-password",
    verifyEmail: (id: string, hash: string) =>
      `/v1/auth/verify-email/${id}/${hash}`,
    resendVerification: "/v1/auth/email/verification-notification",
  },
  user: {
    profile: "/v1/user/profile",
    changeEmail: "/v1/user/email/change",
    verifyEmailChange: "/v1/user/email/verify-change",
    deleteAccount: "/v1/user/account",
    sessions: "/v1/user/sessions",
    terminateSession: (sessionId: string) => `/v1/user/sessions/${sessionId}`,
  },
  categories: {
    list: "/v1/categories",
    get: (id: string) => `/v1/categories/${id}`,
    create: "/v1/categories",
    update: (id: string) => `/v1/categories/${id}`,
    delete: (id: string) => `/v1/categories/${id}`,
  },
  tags: {
    list: "/v1/tags",
    get: (id: string) => `/v1/tags/${id}`,
    create: "/v1/tags",
    update: (id: string) => `/v1/tags/${id}`,
    delete: (id: string) => `/v1/tags/${id}`,
  },
  articles: {
    list: "/v1/articles",
    get: (id: string) => `/v1/articles/${id}`,
    create: "/v1/articles",
    update: (id: string) => `/v1/articles/${id}`,
    delete: (id: string) => `/v1/articles/${id}`,
    submitReview: (id: string) => `/v1/articles/${id}/submit-review`,
    requestChanges: (id: string) => `/v1/articles/${id}/request-changes`,
    publish: (id: string) => `/v1/articles/${id}/publish`,
    schedule: (id: string) => `/v1/articles/${id}/schedule`,
    comments: (id: string) => `/v1/articles/${id}/comments`,
    reactions: (id: string) => `/v1/articles/${id}/reactions`,
  },
  comments: {
    list: (articleId: string) => `/v1/articles/${articleId}/comments`,
    get: (id: string) => `/v1/comments/${id}`,
    create: (articleId: string) => `/v1/articles/${articleId}/comments`,
    update: (id: string) => `/v1/comments/${id}`,
    delete: (id: string) => `/v1/comments/${id}`,
    moderate: (id: string) => `/v1/comments/${id}/moderate`,
    reactions: (id: string) => `/v1/comments/${id}/reactions`,
  },
  reactions: {
    articleReactions: (articleId: string) => `/v1/articles/${articleId}/reactions`,
    toggleArticleReaction: (articleId: string) => `/v1/articles/${articleId}/reactions`,
    commentReactions: (commentId: string) => `/v1/comments/${commentId}/reactions`,
    toggleCommentReaction: (commentId: string) => `/v1/comments/${commentId}/reactions`,
    delete: (id: string) => `/v1/reactions/${id}`,
  },
} as const;
