import { useAuthStatus } from "@/hooks/auth/use-auth-status";

/**
 * Backed by `user.permissions` — the combined role + direct-grant
 * permission names from `UserResource`. Prefer this over `useHasRole`
 * where possible: guarding on a specific permission ("users.ban") rather
 * than a role name ("admin") means a backend role/permission
 * reassignment takes effect immediately, with no frontend deploy needed.
 */
export function useHasPermission(permission: string): boolean {
  const { user } = useAuthStatus();
  return Boolean(user?.permissions.includes(permission));
}

export function useHasAnyPermission(permissions: string[]): boolean {
  const { user } = useAuthStatus();
  if (!user) return false;
  return permissions.some((p) => user.permissions.includes(p));
}

export function useHasAllPermissions(permissions: string[]): boolean {
  const { user } = useAuthStatus();
  if (!user) return false;
  return permissions.every((p) => user.permissions.includes(p));
}

export function useHasRole(role: string): boolean {
  const { user } = useAuthStatus();
  return user?.role?.name === role;
}

export function useHasAnyRole(roles: string[]): boolean {
  const { user } = useAuthStatus();
  if (!user?.role) return false;
  return roles.includes(user.role.name);
}
