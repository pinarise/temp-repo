/** Mirrors `App\Enums\UserStatus`. */
export type UserStatus = "active" | "suspended" | "banned" | "deleted";

/** Mirrors the `role` relation as shaped in `UserResource::toArray()`. */
export interface Role {
  id: string;
  name: string;
  display_name: string;
}

/**
 * Mirrors `App\Http\Resources\UserResource::toArray()` exactly — field
 * names are kept in the backend's snake_case rather than remapped to
 * camelCase, so there is never a translation layer to keep in sync.
 */
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  username: string | null;
  phone_number: string | null;
  country: string | null;
  avatar: string | null;
  role: Role | null;
  /** Combined role + direct-grant permission names — see `UserResource::toArray()`. */
  permissions: string[];
  /**
   * Every way this account can log in, e.g. `["email"]`, `["google"]`, or
   * `["email", "google"]` for an account with both. Derived server-side
   * from whether `password` is set plus any linked OAuth providers — see
   * `User::authMethods()`. Use this (not an assumption) to decide
   * whether to show "change password" vs. "set a password", or which
   * OAuth providers are already linked.
   */
  auth_methods: AuthMethod[];
  status: UserStatus;
  email_verified: boolean;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * True when the backend has indicated this account still needs
 * onboarding (e.g. a Google sign-up that hasn't supplied phone/country
 * yet). The current backend always requires these at signup, but a
 * Google-originated account can be created without them (see
 * `OAuthService::authenticate()`), which is exactly the case the
 * "Complete Profile" flow exists to catch.
 */
export function isProfileIncomplete(user: User): boolean {
  return !user.phone_number || !user.country || !user.username;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
  expires_at: string;
}

// ---- Request payloads -----------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
  device_name?: string;
  remember?: boolean;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  username?: string;
  password: string;
  password_confirmation: string;
  terms_accepted: boolean;
}

export type OAuthProvider = "google" | "apple" | "facebook" | "github" | "microsoft" | "x";

/** "email" (password login) plus every `OAuthProvider` — matches `User::authMethods()` on the backend. */
export type AuthMethod = "email" | OAuthProvider;

export interface OAuthLoginPayload {
  provider: OAuthProvider;
  token: string;
  device_name?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  username?: string;
  phone_number?: string;
  country?: string;
  bio?: string;
}

/**
 * Payload for the Google-signup "Complete Profile" onboarding step. These
 * are exactly the fields `isProfileIncomplete()` checks for, plus the
 * password fields are intentionally absent — a Google-originated account
 * has no password to set here.
 */
export interface CompleteProfilePayload {
  username: string;
  phone_number: string;
  country: string;
}

export interface ChangeEmailPayload {
  new_email: string;
  password: string;
}

export interface VerifyEmailChangePayload {
  token: string;
}

// ---- Response payloads -----------------------------------------------------

export interface LoginResponseData {
  user: User;
  tokens: TokenPair;
}

export interface OAuthLoginResponseData {
  user: User;
  tokens: TokenPair;
  is_new_account: boolean;
}

export interface Session {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  device_name: string;
  last_activity: string;
  is_current: boolean;
}
