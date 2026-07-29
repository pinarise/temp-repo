import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { articleService } from "@/services/article.service";
import type {
  CreateArticlePayload,
  ListArticlesParams,
  UpdateArticlePayload,
} from "@/types/article";

export function useArticles(params?: ListArticlesParams) {
  return useQuery({
    queryKey: queryKeys.articles.list(params),
    queryFn: ({ signal }) => articleService.listArticles(params, signal),
  });
}

export function useArticleDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(id),
    queryFn: ({ signal }) => articleService.getArticle(id, signal),
    enabled: !!id,
  });
}

export function useCategories(params?: { active_only?: boolean; per_page?: number }) {
  return useQuery({
    queryKey: queryKeys.articles.categories(),
    queryFn: ({ signal }) => articleService.listCategories(params, signal),
    staleTime: 5 * 60 * 1000, // Categories change infrequently
  });
}

export function useTags(params?: { search?: string; per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.articles.tags(params),
    queryFn: ({ signal }) => articleService.listTags(params, signal),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateArticlePayload) => articleService.createArticle(payload),
    onSuccess: () => {
      // Invalidate articles lists so new draft shows up
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useUpdateArticle(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateArticlePayload) => articleService.updateArticle(id, payload),
    onSuccess: (updatedArticle) => {
      // Update article detail cache
      queryClient.setQueryData(queryKeys.articles.detail(id), updatedArticle);
      queryClient.setQueryData(queryKeys.articles.detail(updatedArticle.slug), updatedArticle);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articleService.deleteArticle(id),
    onSuccess: (_, id) => {
      // Remove detail cache
      queryClient.removeQueries({ queryKey: queryKeys.articles.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useSubmitArticleReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articleService.submitReview(id),
    onSuccess: (updatedArticle) => {
      queryClient.setQueryData(queryKeys.articles.detail(updatedArticle.id), updatedArticle);
      queryClient.setQueryData(queryKeys.articles.detail(updatedArticle.slug), updatedArticle);
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useRequestArticleChanges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      articleService.requestChanges(id, notes),
    onSuccess: (updatedArticle) => {
      queryClient.setQueryData(queryKeys.articles.detail(updatedArticle.id), updatedArticle);
      queryClient.setQueryData(queryKeys.articles.detail(updatedArticle.slug), updatedArticle);
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function usePublishArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articleService.publish(id),
    onSuccess: (updatedArticle) => {
      queryClient.setQueryData(queryKeys.articles.detail(updatedArticle.id), updatedArticle);
      queryClient.setQueryData(queryKeys.articles.detail(updatedArticle.slug), updatedArticle);
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useScheduleArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, publishAt }: { id: string; publishAt: string }) =>
      articleService.schedule(id, publishAt),
    onSuccess: (updatedArticle) => {
      queryClient.setQueryData(queryKeys.articles.detail(updatedArticle.id), updatedArticle);
      queryClient.setQueryData(queryKeys.articles.detail(updatedArticle.slug), updatedArticle);
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}
