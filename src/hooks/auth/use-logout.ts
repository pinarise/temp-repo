import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: authService.logout,
    // Clear local session regardless of whether the network call
    // succeeded — an expired/revoked token will 401 on this very call,
    // and the user's intent ("log me out") should win either way. Losing
    // connectivity mid-logout shouldn't leave someone stuck "logged in"
    // on a device they were trying to sign out of.
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });
}

export function useLogoutAllDevices() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: authService.logoutAllDevices,
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
