import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError } from "@/types/api";
import type { LoginPayload, LoginResponseData } from "@/types/auth";

export function useLogin() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<LoginResponseData, ApiError, LoginPayload>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setSession({ user: data.user, tokens: data.tokens });
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
    },
  });
}
