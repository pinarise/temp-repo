import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import type { ApiError } from "@/types/api";

export interface VerifyEmailParams {
  id: string;
  hash: string;
  expires: string;
  signature: string;
}

export function useVerifyEmail() {
  return useMutation<null, ApiError, VerifyEmailParams>({
    mutationFn: ({ id, hash, expires, signature }) =>
      authService.verifyEmail(id, hash, expires, signature),
  });
}

/** Requires the user to still be authenticated — see routes/api.php, this
 * endpoint sits behind `auth:api`. If they're logged out (e.g. never
 * verified so couldn't log in), direct them to contact support or
 * re-register instead of surfacing this. */
export function useResendVerificationEmail() {
  return useMutation<null, ApiError, void>({
    mutationFn: authService.resendVerificationEmail,
  });
}
