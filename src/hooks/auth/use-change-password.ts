import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError } from "@/types/api";
import type { ChangePasswordPayload } from "@/types/auth";

/**
 * The backend revokes every token (`TokenService::revokeAllUserTokens`)
 * when a password change succeeds — including the one this very request
 * used. So a successful change effectively logs the user out everywhere;
 * we mirror that locally rather than leaving the frontend holding a
 * now-dead access token.
 */
export function useChangePassword() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation<null, ApiError, ChangePasswordPayload>({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
