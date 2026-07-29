import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import type { ApiError } from "@/types/api";
import type { RegisterPayload, User } from "@/types/auth";

/**
 * Registration does NOT log the user in — the backend requires email
 * verification before `login()` will succeed (see
 * `AuthenticationService::login()`'s `hasVerifiedEmail()` check) — so this
 * hook intentionally does not touch the auth store. The register page
 * should route to a "check your email" screen on success, not the
 * dashboard.
 */
export function useRegister() {
  return useMutation<User, ApiError, RegisterPayload>({
    mutationFn: authService.register,
  });
}
