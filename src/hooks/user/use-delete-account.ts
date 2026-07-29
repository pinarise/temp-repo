import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError } from "@/types/api";

export interface DeleteAccountPayload {
  password: string;
  reason?: string;
  confirmation: "DELETE";
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation<null, ApiError, DeleteAccountPayload>({
    mutationFn: (payload) => userService.deleteAccount(payload),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
