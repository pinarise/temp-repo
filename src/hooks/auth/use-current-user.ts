import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Fetches the authenticated user's profile. Disabled entirely while the
 * auth store hasn't finished restoring or has no token — prevents an
 * unauthenticated request firing on every route that happens to use this
 * hook.
 */
export function useCurrentUser() {
  const status = useAuthStore((s) => s.status);

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: ({ signal }) => authService.getCurrentUser(signal),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });
}
