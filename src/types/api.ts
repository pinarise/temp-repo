/**
 * These types mirror `App\Helpers\ApiResponse` and the exception handlers
 * registered in `bootstrap/app.php` on the Laravel backend byte-for-byte.
 * Every endpoint returns one of these two shapes — keeping the frontend
 * types pinned to the backend contract means a backend response-shape
 * change becomes a TypeScript error here, not a runtime surprise.
 */

export interface ApiMeta {
  timestamp: string;
  requestId: string;
  version: string;
  [key: string]: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  status: "success";
  statusCode: number;
  message: string;
  data: T;
  errors: null;
  meta: ApiMeta;
}

/**
 * `errors` is a flat map of field name -> single message string. The
 * backend's `bootstrap/app.php` exception handler collapses Laravel's
 * native `field: string[]` validation bag down to `field: string` (first
 * message only) before it ever reaches the client — see the
 * `LaravelValidationException` render callback there.
 */
export type ApiValidationErrors = Record<string, string>;

export interface ApiErrorResponse {
  success: false;
  status: "failed" | "error";
  statusCode: number;
  message: string;
  data: null;
  errors: ApiValidationErrors | null;
  meta: ApiMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Normalized error shape used throughout the frontend (thrown by the API
 * client, consumed by TanStack Query's `error` field, form error mapping,
 * and the global error boundary). Every failure — HTTP error responses,
 * network failures, timeouts, and cancellations — gets normalized into
 * this one shape so calling code never has to branch on the failure
 * source.
 */
export type ApiErrorKind =
  | "validation"
  | "authentication"
  | "authorization"
  | "not_found"
  | "rate_limited"
  | "server"
  | "network"
  | "timeout"
  | "cancelled"
  | "unknown";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly statusCode: number | null;
  readonly errors: ApiValidationErrors | null;
  readonly requestId: string | null;

  constructor(params: {
    message: string;
    kind: ApiErrorKind;
    statusCode?: number | null;
    errors?: ApiValidationErrors | null;
    requestId?: string | null;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.kind = params.kind;
    this.statusCode = params.statusCode ?? null;
    this.errors = params.errors ?? null;
    this.requestId = params.requestId ?? null;
  }

  /** True when this error carries field-level validation messages. */
  get isValidationError(): boolean {
    return this.kind === "validation" && this.errors !== null;
  }
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}
