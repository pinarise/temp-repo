import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/lib/api-client";
import type {
  ChangeEmailPayload,
  Session,
  UpdateProfilePayload,
  User,
  VerifyEmailChangePayload,
} from "@/types/auth";

/**
 * Fetching the current user's profile lives in `auth.service.ts`
 * (`authService.getCurrentUser`) — both `AuthProvider`'s session
 * restoration and `useCurrentUser` depend on that one function. Not
 * duplicated here even though `GET /v1/user/profile` is arguably "user"
 * territory, to avoid two independent call sites for the same endpoint
 * drifting apart.
 */
export const userService = {
  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.put<User>(ENDPOINTS.user.profile, payload),

  requestEmailChange: (payload: ChangeEmailPayload) =>
    apiClient.post<null>(ENDPOINTS.user.changeEmail, payload),

  verifyEmailChange: (payload: VerifyEmailChangePayload) =>
    apiClient.post<null>(ENDPOINTS.user.verifyEmailChange, payload),

  deleteAccount: (payload: {
    password: string;
    reason?: string;
    confirmation: "DELETE";
  }) => apiClient.delete<null>(ENDPOINTS.user.deleteAccount, payload),

  getSessions: (signal?: AbortSignal) =>
    apiClient.get<Session[]>(ENDPOINTS.user.sessions, { signal }),

  terminateSession: (sessionId: string) =>
    apiClient.delete<null>(ENDPOINTS.user.terminateSession(sessionId)),
};
