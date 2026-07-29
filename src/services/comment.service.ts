import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/lib/api-client";
import type {
  CommentResource,
  CreateCommentPayload,
  ListCommentsResponse,
  ModerateCommentPayload,
  UpdateCommentPayload,
} from "@/types/comment";

export const commentService = {
  listComments: (articleId: string, params?: { per_page?: number; page?: number }, signal?: AbortSignal) =>
    apiClient.get<ListCommentsResponse>(ENDPOINTS.articles.comments(articleId), {
      query: params as Record<string, string | number | boolean | undefined | null>,
      signal,
    }),

  getComment: (id: string, signal?: AbortSignal) =>
    apiClient.get<CommentResource>(ENDPOINTS.comments.get(id), { signal }),

  createComment: (articleId: string, payload: CreateCommentPayload) =>
    apiClient.post<CommentResource>(ENDPOINTS.articles.comments(articleId), payload),

  updateComment: (id: string, payload: UpdateCommentPayload) =>
    apiClient.put<CommentResource>(ENDPOINTS.comments.update(id), payload),

  deleteComment: (id: string) =>
    apiClient.delete<{ message: string }>(ENDPOINTS.comments.delete(id)),

  moderateComment: (id: string, payload: ModerateCommentPayload) =>
    apiClient.post<CommentResource>(ENDPOINTS.comments.moderate(id), payload),
};
