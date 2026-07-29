import type { ReactNode } from "react";

import {
  useHasAllPermissions,
  useHasAnyPermission,
  useHasAnyRole,
  useHasPermission,
  useHasRole,
} from "@/hooks/auth/use-authorization";

interface GuardProps {
  children: ReactNode;
  /** Rendered instead of `children` when the check fails. Defaults to nothing. */
  fallback?: ReactNode;
}

/** Renders `children` only if the current user has this exact permission. */
export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: GuardProps & { permission: string }) {
  const allowed = useHasPermission(permission);
  return <>{allowed ? children : fallback}</>;
}

/** Renders `children` if the current user has ANY of the given permissions. */
export function AnyPermissionGuard({
  permissions,
  children,
  fallback = null,
}: GuardProps & { permissions: string[] }) {
  const allowed = useHasAnyPermission(permissions);
  return <>{allowed ? children : fallback}</>;
}

/** Renders `children` only if the current user has ALL of the given permissions. */
export function AllPermissionsGuard({
  permissions,
  children,
  fallback = null,
}: GuardProps & { permissions: string[] }) {
  const allowed = useHasAllPermissions(permissions);
  return <>{allowed ? children : fallback}</>;
}

/** Renders `children` only if the current user's role matches exactly. */
export function RoleGuard({
  role,
  children,
  fallback = null,
}: GuardProps & { role: string }) {
  const allowed = useHasRole(role);
  return <>{allowed ? children : fallback}</>;
}

/** Renders `children` if the current user's role is ANY of the given roles. */
export function AnyRoleGuard({
  roles,
  children,
  fallback = null,
}: GuardProps & { roles: string[] }) {
  const allowed = useHasAnyRole(roles);
  return <>{allowed ? children : fallback}</>;
}
