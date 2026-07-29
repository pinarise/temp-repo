import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/lib/api-client";
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponseData,
  OAuthLoginPayload,
  OAuthLoginResponseData,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from "@/types/auth";

/**
 * Thin, purely-transport layer over `apiClient` — one function per backend
 * endpoint, fully typed, zero business logic. Business logic (what happens
 * to app state after a login succeeds, when to redirect, etc.) lives in
 * the `hooks/auth/*` layer, which is what components actually call. This
 * split keeps the service testable/mockable in isolation and keeps
 * "how do I call the API" separate from "what does the app do about it".
 */
export const authService = {
  register: (payload: RegisterPayload) =>
    apiClient.post<User>(ENDPOINTS.auth.register, payload, { auth: false }),

  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponseData>(ENDPOINTS.auth.login, payload, {
      auth: false,
    }),

  oauthLogin: (payload: OAuthLoginPayload) =>
    apiClient.post<OAuthLoginResponseData>(
      ENDPOINTS.auth.oauthLogin(payload.provider),
      payload,
      {
        auth: false,
      },
    ),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<null>(ENDPOINTS.auth.forgotPassword, payload, {
      auth: false,
    }),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post<null>(ENDPOINTS.auth.resetPassword, payload, {
      auth: false,
    }),

  logout: () => apiClient.post<null>(ENDPOINTS.auth.logout),

  logoutAllDevices: () => apiClient.post<null>(ENDPOINTS.auth.logoutAll),

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient.post<null>(ENDPOINTS.auth.changePassword, payload),

  /**
   * The verification link itself is a signed GET URL emailed to the user
   * (see `App\Notifications\VerifyEmail`) — `id`/`hash` come from that
   * link's query params, and `expires`/`signature` are forwarded as-is so
   * Laravel's signed-URL validation on the backend still checks out.
   */
  verifyEmail: (id: string, hash: string, expires: string, signature: string) =>
    apiClient.get<null>(ENDPOINTS.auth.verifyEmail(id, hash), {
      auth: false,
      query: { expires, signature },
    }),

  resendVerificationEmail: () =>
    apiClient.post<null>(ENDPOINTS.auth.resendVerification),

  getCurrentUser: (signal?: AbortSignal) =>
    apiClient.get<User>(ENDPOINTS.user.profile, { signal }),
};
