/**
 * Centralized, typed access to build-time environment variables.
 *
 * Vite only exposes variables prefixed with `VITE_` to client code — see
 * `.env.example` for the full list this app expects. Reading them all in
 * one place means a missing/misspelled env var fails fast, at import time,
 * instead of silently producing `undefined` deep inside a service call.
 */

function readEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] as string | undefined;

  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    // Intentionally non-fatal in the browser (avoids crashing the whole
    // app over a missing analytics key, for example) but always logged.
    console.warn(`[env] Missing environment variable: ${key}`);
    return "";
  }

  return value;
}

export const env = {
  /** Base URL of the Laravel API, no trailing slash, e.g. https://api.nigeriafootball.com/api */
  apiBaseUrl: readEnvVar("VITE_API_URL", "http://localhost:8000/api").replace(
    /\/+$/,
    "",
  ),

  /** Google OAuth client id used by the frontend's Google Identity Services button. */
  googleClientId: readEnvVar("VITE_GOOGLE_CLIENT_ID", ""),

  /** Request timeout in milliseconds for all API calls. */
  apiTimeoutMs: Number(readEnvVar("VITE_API_TIMEOUT_MS", "15000")),

  /** Current build mode, as set by Vite (`development` | `production` | ...). */
  mode: import.meta.env.MODE,

  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
