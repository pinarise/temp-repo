import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { userService } from "@/services/user.service";
import { useAuthStatus } from "@/hooks/auth/use-auth-status";
import type { ApiError } from "@/types/api";

export function useSessions() {
  const { isAuthenticated } = useAuthStatus();

  return useQuery({
    queryKey: queryKeys.auth.sessions(),
    queryFn: ({ signal }) => userService.getSessions(signal),
    enabled: isAuthenticated,
  });
}

export function useTerminateSession() {
  const queryClient = useQueryClient();

  return useMutation<null, ApiError, string>({
    mutationFn: (sessionId) => userService.terminateSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.sessions() });
    },
  });
}
