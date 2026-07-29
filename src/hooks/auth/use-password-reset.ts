import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import type { ApiError } from "@/types/api";
import type { ForgotPasswordPayload, ResetPasswordPayload } from "@/types/auth";

export function useForgotPassword() {
  return useMutation<null, ApiError, ForgotPasswordPayload>({
    mutationFn: authService.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation<null, ApiError, ResetPasswordPayload>({
    mutationFn: authService.resetPassword,
  });
}
