import { useMutation } from "@tanstack/react-query";

import { userService } from "@/services/user.service";
import type { ApiError } from "@/types/api";
import type { ChangeEmailPayload } from "@/types/auth";

/**
 * Requesting a change does NOT update the user's email immediately — the
 * backend sends a confirmation link to the *new* address
 * (`EmailChangeNotification`) and only applies the change once that link
 * is clicked (`verifyEmailChange` below). The old email stays active
 * until then.
 */
export function useRequestEmailChange() {
  return useMutation<null, ApiError, ChangeEmailPayload>({
    mutationFn: userService.requestEmailChange,
  });
}

/**
 * The confirmation link is `FRONTEND_URL/verify-email-change?token=...`
 * (see `EmailChangeNotification`) — a plain token in the query string,
 * not a Laravel signed URL like email verification. Posted to
 * `POST /v1/user/email/verify-change`.
 */
export function useVerifyEmailChange() {
  return useMutation<null, ApiError, { token: string }>({
    mutationFn: userService.verifyEmailChange,
  });
}
