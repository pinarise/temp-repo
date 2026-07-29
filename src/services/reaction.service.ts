import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/lib/api-client";
import type {
  ReactionResource,
  ReactionSummary,
  StoreReactionPayload,
} from "@/types/reaction";

export const reactionService = {
  listArticleReactions: (articleId: string, signal?: AbortSignal) =>
    apiClient.get<ReactionSummary>(ENDPOINTS.reactions.articleReactions(articleId), { signal }),

  toggleArticleReaction: (articleId: string, payload: StoreReactionPayload) =>
    apiClient.post<ReactionResource | null>(ENDPOINTS.reactions.toggleArticleReaction(articleId), payload),

  listCommentReactions: (commentId: string, signal?: AbortSignal) =>
    apiClient.get<ReactionSummary>(ENDPOINTS.reactions.commentReactions(commentId), { signal }),

  toggleCommentReaction: (commentId: string, payload: StoreReactionPayload) =>
    apiClient.post<ReactionResource | null>(ENDPOINTS.reactions.toggleCommentReaction(commentId), payload),

  deleteReaction: (reactionId: string) =>
    apiClient.delete<{ message: string }>(ENDPOINTS.reactions.delete(reactionId)),
};
