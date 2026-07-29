import { useQuery } from "@tanstack/react-query";
import { articleService } from "@/services/article.service";
import { queryKeys } from "@/constants/query-keys";

export function useCategories(signal?: AbortSignal) {
  return useQuery({
    queryKey: queryKeys.articles.categories(),
    queryFn: () => articleService.listCategories({ active_only: true }, signal),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
}
