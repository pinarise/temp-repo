import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { FullScreenLoader } from "@/components/shared/FullScreenLoader";
import { useAuthStatus } from "@/hooks/auth/use-auth-status";

/**
 * Use as the `component` of a protected pathless layout route (Phase 2),
 * e.g. wrapping `/dashboard`, `/account-settings`, etc. Complements
 * `guards/route-guards.ts`'s `requireAuth` (a synchronous, token-presence
 * check in `beforeLoad`) by also handling the async part: while
 * `AuthProvider` is still validating the persisted token, this shows a
 * scoped loading state instead of flashing protected content; if
 * validation ultimately fails, it redirects to `/login`.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isRestoring, isAuthenticated } = useAuthStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRestoring && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: window.location.href } });
    }
  }, [isRestoring, isAuthenticated, navigate]);

  if (isRestoring || !isAuthenticated) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}
