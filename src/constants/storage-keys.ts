/**
 * Every localStorage key the app writes, in one place. Prevents silent key
 * collisions and makes "what do we persist client-side" auditable at a
 * glance — relevant here since we're storing bearer tokens client-side
 * (see the auth-store.ts doc comment for the security trade-off).
 */
export const STORAGE_KEYS = {
  /** Persisted Zustand auth slice: { accessToken, refreshToken, user }. */
  AUTH: "fn.auth.v1",
} as const;
