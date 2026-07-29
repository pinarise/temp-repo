import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { commentService } from "@/services/comment.service";
import type {
  CreateCommentPayload,
  ModerateCommentPayload,
  UpdateCommentPayload,
} from "@/types/comment";

export function useComments(articleId: string, params?: { per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.comments.list(articleId, params),
    queryFn: ({ signal }) => commentService.listComments(articleId, params, signal),
    enabled: !!articleId,
  });
}

export function useCommentDetail(commentId: string) {
  return useQuery({
    queryKey: queryKeys.comments.detail(commentId),
    queryFn: ({ signal }) => commentService.getComment(commentId, signal),
    enabled: !!commentId,
  });
}

export function useCreateComment(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => commentService.createComment(articleId, payload),
    onSuccess: () => {
      // Refresh comments for the article
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      // Invalidate the article detail to update comment count
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useUpdateComment(articleId: string, commentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCommentPayload) => commentService.updateComment(commentId, payload),
    onSuccess: () => {
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(articleId) });
      // Invalidate individual comment query if any
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.detail(commentId) });
    },
  });
}

export function useDeleteComment(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: () => {
      // Invalidate lists and details to adjust comment count
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useModerateComment(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, ...payload }: { commentId: string } & ModerateCommentPayload) =>
      commentService.moderateComment(commentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(articleId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.detail(variables.commentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}
