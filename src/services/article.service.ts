import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/lib/api-client";
import type {
  Article,
  Category,
  CreateArticlePayload,
  LaravelPagination,
  ListArticlesParams,
  Tag,
  UpdateArticlePayload,
} from "@/types/article";

export const articleService = {
  listArticles: (params?: ListArticlesParams, signal?: AbortSignal) =>
    apiClient.get<LaravelPagination<Article>>(ENDPOINTS.articles.list, {
      query: params as Record<string, string | number | boolean | undefined | null>,
      signal,
    }),

  getArticle: (id: string, signal?: AbortSignal) =>
    apiClient.get<Article>(ENDPOINTS.articles.get(id), { signal }),

  createArticle: (payload: CreateArticlePayload) =>
    apiClient.post<Article>(ENDPOINTS.articles.create, payload),

  updateArticle: (id: string, payload: UpdateArticlePayload) =>
    apiClient.put<Article>(ENDPOINTS.articles.update(id), payload),

  deleteArticle: (id: string) =>
    apiClient.delete<null>(ENDPOINTS.articles.delete(id)),

  submitReview: (id: string) =>
    apiClient.post<Article>(ENDPOINTS.articles.submitReview(id)),

  requestChanges: (id: string, notes: string) =>
    apiClient.post<Article>(ENDPOINTS.articles.requestChanges(id), { notes }),

  publish: (id: string) =>
    apiClient.post<Article>(ENDPOINTS.articles.publish(id)),

  schedule: (id: string, publishAt: string) =>
    apiClient.post<Article>(ENDPOINTS.articles.schedule(id), { publish_at: publishAt }),

  listCategories: (params?: { active_only?: boolean; per_page?: number }, signal?: AbortSignal) =>
    apiClient.get<Category[]>(ENDPOINTS.categories.list, {
      query: params as Record<string, string | number | boolean | undefined | null>,
      signal,
    }),

  listTags: (params?: { search?: string; per_page?: number; page?: number }, signal?: AbortSignal) =>
    apiClient.get<LaravelPagination<Tag>>(ENDPOINTS.tags.list, {
      query: params as Record<string, string | number | boolean | undefined | null>,
      signal,
    }),
};
