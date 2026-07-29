import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/types/api";

/**
 * Retry policy shared by every query in the app:
 *  - Never retry validation/auth/not-found errors (4xx) — retrying a 422
 *    or 404 just wastes a round trip, the response won't change.
 *  - Never retry a cancelled request (superseded query, component
 *    unmounted mid-fetch).
 *  - Do retry network/timeout/5xx failures, up to 2 times, with
 *    TanStack Query's default exponential backoff.
 * Mutations are NOT covered by this — they default to zero retries
 * (TanStack Query's own default), since retrying a POST/PATCH/DELETE
 * automatically risks duplicate side effects (e.g. double-charging,
 * double-creating a resource) unless the endpoint is known idempotent.
 */
function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;

  if (error instanceof ApiError) {
    return (
      error.kind === "network" ||
      error.kind === "timeout" ||
      error.kind === "server"
    );
  }

  // Unknown/non-ApiError failures (shouldn't normally happen, since
  // api-client normalizes everything) — don't retry blindly.
  return false;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: shouldRetryQuery,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
