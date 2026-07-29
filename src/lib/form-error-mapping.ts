import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { ApiError } from "@/types/api";

/**
 * Applies a failed mutation's `ApiError` onto a react-hook-form instance:
 *  - Field-level validation errors (422s, already flattened to one
 *    message per field by the backend) map onto the matching form field
 *    via `setError`. These render inline next to the field, so no
 *    root-level banner is needed for this case.
 *  - Anything else (401 invalid credentials, 403, 429 rate limit,
 *    network failure, server error, etc.) has no specific field to
 *    attach to — returned as a string for the caller to render in a
 *    root-level alert (see `FormErrorAlert`).
 *
 * Returns the message to show in a root-level alert, or `null` if the
 * error was fully handled by field-level messages.
 */
export function applyApiErrorToForm<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
): string | null {
  if (!(error instanceof ApiError)) {
    return "Something went wrong. Please try again.";
  }

  if (error.isValidationError && error.errors) {
    for (const [field, message] of Object.entries(error.errors)) {
      setError(field as Path<TFieldValues>, { type: "server", message });
    }
    return null;
  }

  return error.message;
}
