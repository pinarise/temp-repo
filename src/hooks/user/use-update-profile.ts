import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError } from "@/types/api";
import type { UpdateProfilePayload, User } from "@/types/auth";

/**
 * Backs both the account-settings profile form AND the Google-signup
 * "complete profile" onboarding step — both are the same backend
 * operation (`PUT /v1/user/profile`), just reached from different UI
 * contexts. One hook, no duplicated mutation logic.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<User, ApiError, UpdateProfilePayload>({
    mutationFn: (payload) => userService.updateProfile(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(queryKeys.auth.me(), user);
    },
  });
}
