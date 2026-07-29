import { useEffect, type ReactNode } from "react";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { ApiError } from "@/types/api";

/**
 * Runs once, on app boot, and resolves the store's `restoring` status to
 * either `authenticated` or `unauthenticated` in the background:
 *
 *  - No persisted tokens at all -> unauthenticated immediately, no
 *    network call.
 *  - Tokens present -> validates them against `GET /v1/user/profile`.
 *    A 401 here transparently triggers the API client's refresh-token
 *    flow (see lib/api-client.ts); if that also fails, the client already
 *    clears the session, so this resolves to unauthenticated.
 *  - A network/timeout failure (as opposed to an auth failure) does NOT
 *    log the user out — we stay optimistically authenticated using the
 *    persisted user record, since "the network hiccuped on boot" isn't
 *    evidence the session is actually invalid.
 *
 * Deliberately does NOT block rendering of `children`: this site is
 * mostly public content (news, scores, fixtures), and this effect never
 * even runs during TanStack Start's server render — so gating the whole
 * tree on it would mean every page, public or not, server-renders as a
 * bare loading spinner. Auth-dependent chrome (navbar login/avatar) and
 * protected routes are responsible for handling `status === "restoring"`
 * themselves, scoped to just their own UI — see `guards/route-guards.ts`
 * and the protected layout in Phase 2.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const setUser = useAuthStore((s) => s.setUser);
  const markRestored = useAuthStore((s) => s.markRestored);

  useEffect(() => {
    if (status !== "restoring") return;

    let cancelled = false;
    const { accessToken, refreshToken } = useAuthStore.getState();

    if (!accessToken && !refreshToken) {
      markRestored(false);
      return;
    }

    authService
      .getCurrentUser()
      .then((user) => {
        if (cancelled) return;
        setUser(user);
        markRestored(true);
      })
      .catch((err) => {
        if (cancelled) return;

        const isNetworkIssue =
          err instanceof ApiError &&
          (err.kind === "network" || err.kind === "timeout");

        // Genuine auth failures already trigger clearSession() inside the
        // API client's refresh-failure path — markRestored(false) here is
        // a no-op safety net for that case, not the primary mechanism.
        markRestored(isNetworkIssue);
      });

    return () => {
      cancelled = true;
    };
    // Intentionally runs only on mount / when status flips back to "restoring".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return <>{children}</>;
}
