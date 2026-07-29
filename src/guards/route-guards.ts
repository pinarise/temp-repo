import { redirect } from "@tanstack/react-router";

import { isProfileIncomplete } from "@/types/auth";
import { useAuthStore } from "@/stores/auth-store";

/**
 * IMPORTANT — SSR caveat: this app persists tokens client-side
 * (`localStorage`), which the server has no access to during TanStack
 * Start's server render, and the Zustand store is a module-level
 * singleton that must never be trusted for per-user state on the server
 * (it would leak between concurrent requests on the same server
 * instance). So every guard here is a no-op on the server and only
 * enforces on the client — meaning the very first server-rendered paint
 * of a protected route can briefly show before a client-side redirect
 * kicks in. This is an inherent trade-off of bearer-token-in-localStorage
 * auth with an SSR framework; the alternative (making this fully
 * SSR-correct) requires moving to httpOnly-cookie auth via a server-route
 * proxy — a bigger architectural change, called out separately.
 *
 * These guards check token *presence*, not validity — that's a fast,
 * synchronous heuristic (localStorage rehydrates before first paint on
 * the client). Actual validity is confirmed asynchronously by
 * `AuthProvider` and by the API client's 401/refresh handling on real
 * requests; an invalid/expired session is corrected shortly after, not
 * silently trusted forever.
 */

function hasPersistedSession(): boolean {
  const { accessToken, refreshToken } = useAuthStore.getState();
  return Boolean(accessToken || refreshToken);
}

/** Use in `beforeLoad` for any route that requires the user to be signed in. */
export function requireAuth({ location }: { location: { href: string } }) {
  if (typeof window === "undefined") return;

  if (!hasPersistedSession()) {
    throw redirect({ to: "/login", search: { redirect: location.href } });
  }
}

/** Use in `beforeLoad` for login/register/forgot-password — signed-in users shouldn't see these. */
export function requireGuest() {
  if (typeof window === "undefined") return;

  if (hasPersistedSession()) {
    throw redirect({ to: "/" });
  }
}

/**
 * Use after `requireAuth` on any route that should be blocked until the
 * Google-signup onboarding step is done. Relies on the cached user object
 * already being present (i.e. runs after `AuthProvider` has restored the
 * session) — safe to call from a route that's nested under a protected
 * layout, not from the very first route in the tree.
 */
export function requireCompleteProfile() {
  if (typeof window === "undefined") return;

  const { user } = useAuthStore.getState();

  if (user && isProfileIncomplete(user)) {
    throw redirect({ to: "/complete-profile" as "/" });
  }
}

/**
 * Use after `requireAuth` on any route restricted to a specific role.
 * Same client-only caveat as the guards above — relies on the cached
 * `user` object, so it's meant for routes nested under a protected
 * layout where `AuthProvider` has already restored the session.
 */
export function requireRole(role: string) {
  return function guard() {
    if (typeof window === "undefined") return;

    const { user } = useAuthStore.getState();

    if (!user || user.role?.name !== role) {
      throw redirect({ to: "/unauthorized" as "/" });
    }
  };
}

/** Same as `requireRole`, but for a specific permission rather than a role name. */
export function requirePermission(permission: string) {
  return function guard() {
    if (typeof window === "undefined") return;

    const { user } = useAuthStore.getState();

    if (!user || !user.permissions.includes(permission)) {
      throw redirect({ to: "/unauthorized" as "/" });
    }
  };
}
