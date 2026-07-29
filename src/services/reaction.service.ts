import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/lib/api-client";
import type {
  ReactionResource,
  ReactionSummary,
  StoreReactionPayload,
} from "@/types/reaction";

export const reactionService = {
  listArticleReactions: (articleId: string, signal?: AbortSignal) =>
    apiClient.get<ReactionSummary>(ENDPOINTS.articles.reactions(articleId), { signal }),

  toggleArticleReaction: (articleId: string, payload: StoreReactionPayload) =>
    apiClient.post<ReactionResource | null>(ENDPOINTS.articles.reactions(articleId), payload),

  listCommentReactions: (commentId: string, signal?: AbortSignal) =>
    apiClient.get<ReactionSummary>(ENDPOINTS.comments.reactions(commentId), { signal }),

  toggleCommentReaction: (commentId: string, payload: StoreReactionPayload) =>
    apiClient.post<ReactionResource | null>(ENDPOINTS.comments.reactions(commentId), payload),

  deleteReaction: (reactionId: string) =>
    apiClient.delete<{ message: string }>(ENDPOINTS.reactions.delete(reactionId)),
};
