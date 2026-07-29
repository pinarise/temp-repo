import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import type {
  ApiErrorKind,
  ApiResponse,
  ApiValidationErrors,
} from "@/types/api";
import { ApiError } from "@/types/api";
import type { TokenPair } from "@/types/auth";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /**
   * When false, no Authorization header is attached and a 401 response
   * will NOT trigger the refresh-token flow. Use for endpoints callable
   * while logged out (login, register, forgot-password, refresh itself).
   * Defaults to true.
   */
  auth?: boolean;
  /** Caller-provided abort signal — e.g. from a TanStack Query queryFn's
   * `{ signal }` context, so query cancellation propagates correctly. */
  signal?: AbortSignal;
  /** Per-request timeout override, in milliseconds. */
  timeoutMs?: number;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${env.apiBaseUrl}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function statusToErrorKind(status: number): ApiErrorKind {
  if (status === 401) return "authentication";
  if (status === 403) return "authorization";
  if (status === 404) return "not_found";
  if (status === 422) return "validation";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server";
  return "unknown";
}

function normalizeErrorResponse(
  status: number,
  body: ApiResponse<unknown> | null,
): ApiError {
  if (body && body.success === false) {
    return new ApiError({
      message: body.message || "Something went wrong. Please try again.",
      kind: statusToErrorKind(status),
      statusCode: status,
      errors: body.errors as ApiValidationErrors | null,
      requestId: body.meta?.requestId ?? null,
    });
  }

  // Response wasn't valid JSON matching our envelope (e.g. a gateway 502
  // HTML page). Still normalize it so callers never see a raw fetch error.
  return new ApiError({
    message: "The server returned an unexpected response. Please try again.",
    kind: statusToErrorKind(status),
    statusCode: status,
  });
}

// ---- 401 / refresh-token queue ---------------------------------------------
//
// Multiple requests can 401 at the same moment (e.g. three parallel
// queries firing right as the access token expires). Without this queue,
// each would independently call the refresh endpoint, racing to persist
// a new token pair — the backend revokes the *old* refresh token on
// rotation (see `TokenService::rotateRefreshToken`), so only the first
// refresh call would succeed and the rest would incorrectly log the user
// out. Instead, every 401 awaits the *same* in-flight refresh promise.

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const { refreshToken, setSession, clearSession } = useAuthStore.getState();

    if (!refreshToken) {
      clearSession();
      throw new ApiError({
        message: "Session expired.",
        kind: "authentication",
      });
    }

    try {
      const res = await fetch(buildUrl("/v1/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const json = (await res
        .json()
        .catch(() => null)) as ApiResponse<TokenPair> | null;

      if (!res.ok || !json || json.success === false) {
        throw normalizeErrorResponse(res.status, json);
      }

      setSession({ tokens: json.data });

      return json.data.access_token;
    } catch (err) {
      clearSession();
      throw err instanceof ApiError
        ? err
        : new ApiError({
            message: "Session expired. Please log in again.",
            kind: "authentication",
          });
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

// ---- Core request function --------------------------------------------------

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    query,
    auth = true,
    signal: externalSignal,
    timeoutMs,
  } = options;

  return performRequest<T>(
    { path, method, body, query, auth },
    externalSignal,
    timeoutMs,
    false,
  );
}

async function performRequest<T>(
  args: {
    path: string;
    method: HttpMethod;
    body: unknown;
    query: RequestOptions["query"];
    auth: boolean;
  },
  externalSignal: AbortSignal | undefined,
  timeoutMs: number | undefined,
  isRetryAfterRefresh: boolean,
): Promise<T> {
  const { path, method, body, query, auth } = args;
  const controller = new AbortController();
  const timeout = timeoutMs ?? env.apiTimeoutMs;
  const timeoutId = setTimeout(
    () =>
      controller.abort(new DOMException("Request timed out", "TimeoutError")),
    timeout,
  );

  const onExternalAbort = () => controller.abort(externalSignal?.reason);
  externalSignal?.addEventListener("abort", onExternalAbort);

  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    const isFormData = body instanceof FormData;

    if (!isFormData && body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (auth) {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
      signal: controller.signal,
    });

    const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

    if (res.ok && json && json.success) {
      return json.data;
    }

    // Attempt a single silent refresh-and-retry for authenticated requests
    // that failed with 401 — but never for the refresh call itself, and
    // never more than once per original request (guards against a refresh
    // loop if the backend somehow keeps returning 401 after rotation).
    if (res.status === 401 && auth && !isRetryAfterRefresh) {
      const newAccessToken = await refreshAccessToken();
      void newAccessToken; // token is read fresh from the store on retry
      return performRequest<T>(args, externalSignal, timeoutMs, true);
    }

    throw normalizeErrorResponse(res.status, json);
  } catch (err) {
    if (err instanceof ApiError) throw err;

    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new ApiError({
        message: "The request timed out. Please try again.",
        kind: "timeout",
      });
    }

    // Caller explicitly cancelled (e.g. TanStack Query cancelling a
    // superseded query) — rethrow the raw AbortError so TanStack Query's
    // built-in cancellation detection keeps working instead of treating
    // this as a real error.
    if (externalSignal?.aborted) {
      throw err;
    }

    throw new ApiError({
      message: "Network error. Please check your connection and try again.",
      kind: "network",
    });
  } finally {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => request<T>(path, { ...options, method: "POST", body }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => request<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => request<T>(path, { ...options, method: "DELETE", body }),
};
