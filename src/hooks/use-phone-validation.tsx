import { useState, useCallback, useEffect, useRef } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export type PhoneValidationError =
  | "Phone number is required"
  | "Invalid phone format"
  | "Invalid phone number for selected country";

interface UsePhoneValidationOptions {
  initialValue?: string;
  onValidationChange?: (isValid: boolean, value?: string) => void;
}

interface UsePhoneValidationReturn {
  error: PhoneValidationError | null;
  validate: (value?: string) => void;
  clearError: () => void;
}

/**
 * Determines if the raw value contains actual digits beyond the country code.
 * react-phone-input-2 emits the dial code alone when the country changes,
 * which should not trigger validation.
 */
export function hasNationalDigits(value?: string): boolean {
  if (!value || value.trim().length === 0) return false;

  const possible = value.startsWith("+") ? value : `+${value}`;
  const phone = parsePhoneNumberFromString(possible);

  if (!phone) return false;

  const national = phone.nationalNumber;
  if (national === undefined || national === null) return false;
  if (typeof national === "string") return national.length > 0;
  if (typeof national === "number") return national > 0;

  return false;
}

export function usePhoneValidation({
  initialValue,
  onValidationChange,
}: UsePhoneValidationOptions = {}): UsePhoneValidationReturn {
  const [error, setError] = useState<PhoneValidationError | null>(null);

  const onChangeRef = useRef(onValidationChange);
  onChangeRef.current = onValidationChange;

  const validate = useCallback((value?: string) => {
    if (!value?.trim()) {
      setError("Phone number is required");
      onChangeRef.current?.(false, value);
      return;
    }

    const possible = value.startsWith("+") ? value : `+${value}`;
    const phone = parsePhoneNumberFromString(possible);

    if (!phone) {
      setError("Invalid phone format");
      onChangeRef.current?.(false, value);
      return;
    }

    if (!phone.isValid()) {
      setError("Invalid phone number for selected country");
      onChangeRef.current?.(false, value);
      return;
    }

    setError(null);
    onChangeRef.current?.(true, phone.format("E.164"));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (initialValue && hasNationalDigits(initialValue)) {
      validate(initialValue);
    } else {
      onChangeRef.current?.(false, initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { error, validate, clearError };
}





// import { useState, useCallback, useEffect, useRef } from "react";
// import { parsePhoneNumberFromString } from "libphonenumber-js";

// export type PhoneValidationError =
//   | "Phone number is required"
//   | "Invalid phone format"
//   | "Invalid phone number for selected country";

// interface UsePhoneValidationOptions {
//   initialValue?: string;
//   onValidationChange?: (isValid: boolean, value?: string) => void;
// }

// interface UsePhoneValidationReturn {
//   error: PhoneValidationError | null;
//   validate: (value?: string) => void;
//   clearError: () => void;
// }

// export function usePhoneValidation({
//   initialValue,
//   onValidationChange,
// }: UsePhoneValidationOptions = {}): UsePhoneValidationReturn {
//   const [error, setError] = useState<PhoneValidationError | null>(null);

//   // Keep callback fresh without triggering re-validation
//   const onChangeRef = useRef(onValidationChange);
//   onChangeRef.current = onValidationChange;

//   const validate = useCallback((value?: string) => {
//     if (!value?.trim()) {
//       setError("Phone number is required");
//       onChangeRef.current?.(false, value);
//       return;
//     }

//     const withPrefix = value.startsWith("+") ? value : `+${value}`;
//     const phone = parsePhoneNumberFromString(withPrefix);

//     if (!phone) {
//       setError("Invalid phone format");
//       onChangeRef.current?.(false, value);
//       return;
//     }

//     if (!phone.isValid()) {
//       setError("Invalid phone number for selected country");
//       onChangeRef.current?.(false, value);
//       return;
//     }

//     setError(null);
//     onChangeRef.current?.(true, phone.format("E.164"));
//   }, []);

//   const clearError = useCallback(() => setError(null), []);

//   useEffect(() => {
//     if (initialValue) validate(initialValue);
//     else onChangeRef.current?.(false, initialValue);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return { error, validate, clearError };
// }