import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { TokenPair, User } from "@/types/auth";

/**
 * SECURITY NOTE — bearer tokens are persisted to `localStorage`.
 *
 * The Laravel backend issues JWT access/refresh tokens as JSON in the
 * response body (not httpOnly Sanctum cookies), which is a deliberate
 * backend design choice supporting non-browser clients too. Storing them
 * client-side is the consistent counterpart to that, but it does mean a
 * successful XSS attack can exfiltrate both tokens. Mitigations already in
 * place: short-lived access tokens (`JWT_TTL`, default 60 min) limit the
 * exposure window, and the refresh token is rotated on every use
 * (`TokenService::rotateRefreshToken`) so a stolen-then-superseded refresh
 * token stops working. If this needs hardening further, the next step
 * would be a TanStack Start server-route proxy that keeps the refresh
 * token in an httpOnly cookie server-side — a larger change, not done
 * here since it's a different architecture, not an incremental one.
 */

export type AuthStatus = "restoring" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  /**
   * `restoring` is the initial state on every fresh page load — the
   * `AuthProvider` resolves it to `authenticated`/`unauthenticated` before
   * the app renders anything that depends on auth. See providers/auth-provider.tsx.
   */
  status: AuthStatus;

  setSession: (params: { user?: User; tokens: TokenPair }) => void;
  setUser: (user: User) => void;
  clearSession: () => void;
  markRestored: (authenticated: boolean) => void;
}

/**
 * `localStorage` doesn't exist during TanStack Start's server render. This
 * storage adapter no-ops on the server and defers to real `localStorage`
 * in the browser, so `persist` never throws during SSR.
 */
const ssrSafeStorage: StateStorage = {
  getItem: (name) =>
    typeof window === "undefined" ? null : window.localStorage.getItem(name),
  setItem: (name, value) => {
    if (typeof window !== "undefined") window.localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window !== "undefined") window.localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: "restoring",

      setSession: ({ user, tokens }) =>
        set((state) => ({
          user: user ?? state.user,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          status: "authenticated",
        })),

      setUser: (user) => set({ user }),

      clearSession: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          status: "unauthenticated",
        }),

      markRestored: (authenticated) =>
        set({ status: authenticated ? "authenticated" : "unauthenticated" }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => ssrSafeStorage),
      // `status` is intentionally excluded — every fresh load must
      // re-derive it via AuthProvider rather than trusting stale storage,
      // since the persisted access token may have expired while the tab
      // was closed.
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

/** Convenience selector — avoids importing the whole store in components that only need this. */
export const selectIsAuthenticated = (state: AuthState) =>
  state.status === "authenticated";
