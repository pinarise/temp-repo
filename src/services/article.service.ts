import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/lib/api-client";
import { getMockArticle, getAllMockArticles } from "@/lib/mock-articles";
import type {
  Article,
  Category,
  CreateArticlePayload,
  LaravelPagination,
  ListArticlesParams,
  Tag,
  UpdateArticlePayload,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateTagPayload,
  UpdateTagPayload,
} from "@/types/article";

export const articleService = {
  // Articles
  listArticles: async (params?: ListArticlesParams, signal?: AbortSignal) => {
    try {
      return await apiClient.get<LaravelPagination<Article>>(ENDPOINTS.articles.list, {
        query: params as Record<string, string | number | boolean | undefined | null>,
        signal,
      });
    } catch (error) {
      console.log("[v0] listArticles API failed, falling back to mock data");
      // Fallback to mock articles
      const articles = getAllMockArticles();
      return {
        data: articles,
        current_page: 1,
        per_page: articles.length,
        total: articles.length,
        from: 1,
        to: articles.length,
        last_page: 1,
      } as LaravelPagination<Article>;
    }
  },

  getArticle: async (id: string, signal?: AbortSignal): Promise<Article> => {
    try {
      return await apiClient.get<Article>(ENDPOINTS.articles.get(id), { signal });
    } catch (error) {
      console.log("[v0] getArticle API failed for", id, ", falling back to mock data");
      // Fallback to mock article by slug or id
      const article = getMockArticle(id);
      if (article) {
        return article;
      }
      throw new Error(`Article not found: ${id}`);
    }
  },

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

  // Categories
  listCategories: (
    params?: { active_only?: boolean; per_page?: number },
    signal?: AbortSignal
  ) =>
    apiClient.get<Category[]>(ENDPOINTS.categories.list, {
      query: params as Record<string, string | number | boolean | undefined | null>,
      signal,
    }),

  getCategory: (id: string, signal?: AbortSignal) =>
    apiClient.get<Category>(ENDPOINTS.categories.get(id), { signal }),

  createCategory: (payload: CreateCategoryPayload) =>
    apiClient.post<Category>(ENDPOINTS.categories.create, payload),

  updateCategory: (id: string, payload: UpdateCategoryPayload) =>
    apiClient.put<Category>(ENDPOINTS.categories.update(id), payload),

  deleteCategory: (id: string) =>
    apiClient.delete<null>(ENDPOINTS.categories.delete(id)),

  // Tags
  listTags: (
    params?: { search?: string; per_page?: number; page?: number },
    signal?: AbortSignal
  ) =>
    apiClient.get<LaravelPagination<Tag>>(ENDPOINTS.tags.list, {
      query: params as Record<string, string | number | boolean | undefined | null>,
      signal,
    }),

  getTag: (id: string, signal?: AbortSignal) =>
    apiClient.get<Tag>(ENDPOINTS.tags.get(id), { signal }),

  createTag: (payload: CreateTagPayload) =>
    apiClient.post<Tag>(ENDPOINTS.tags.create, payload),

  updateTag: (id: string, payload: UpdateTagPayload) =>
    apiClient.put<Tag>(ENDPOINTS.tags.update(id), payload),

  deleteTag: (id: string) =>
    apiClient.delete<null>(ENDPOINTS.tags.delete(id)),
};
