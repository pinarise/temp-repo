import { useAuthStore } from "@/stores/auth-store";

export function useAuthStatus() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);

  return {
    status,
    user,
    isRestoring: status === "restoring",
    isAuthenticated: status === "authenticated",
  };
}
