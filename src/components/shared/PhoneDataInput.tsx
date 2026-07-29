"use client";

import React from "react";
import { usePhoneValidation, hasNationalDigits } from "@/hooks/use-phone-validation";
import { cn } from "@/lib/utils";
import PhoneInputImport from "react-phone-input-2";
const PhoneInput = (PhoneInputImport as any).default ?? PhoneInputImport;

export interface PhoneDataInputProps {
  value?: string;
  label?: React.ReactNode;
  placeholder?: string;
  country?: string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  onChange?: (isValid: boolean, value?: string) => void;
  error?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  disabled?: boolean;
}

const PhoneDataInput = ({
  value,
  label,
  placeholder = "Type your phone number",
  country = "ng",
  onChange,
  enableSearch = true,
  searchPlaceholder = "Search country",
  error: externalError,
  className,
  containerClassName,
  style,
  containerStyle,
  buttonStyle,
  disabled = false,
}: PhoneDataInputProps) => {
  const {
    error: internalError,
    validate,
    clearError,
  } = usePhoneValidation({
    initialValue: value,
    onValidationChange: onChange,
  });

  const displayError = externalError ?? internalError;

  const handleChange = (val: string) => {
    clearError();

    // Guard: skip validation when only the country code is present.
    // This prevents errors from appearing when the user merely
    // opens the dropdown and selects a different flag.
    if (!hasNationalDigits(val)) {
      onChange?.(false, val);
      return;
    }

    validate(val);
  };

  return (
    <div className={cn("relative text-left", className)} style={style}>
      {label && (
        <label
          className={cn(
            "mb-0.5 block text-[13px] font-semibold leading-6 tracking-[-0.5px] 2xl:text-base",
          )}
        >
          {label}
        </label>
      )}

      <PhoneInput
        country={country || "auto"}
        value={value}
        placeholder={placeholder}
        containerClass={cn(
          "relative w-full!",
          "[font-weight:inherit] [font-size:inherit]",
          "transition-all duration-[var(--transition)]",
          displayError && "border-[#d21c1c]",
          disabled && "cursor-not-allowed",
          containerClassName,
        )}
        containerStyle={containerStyle}
        inputClass={cn(
          "block! w-full! h-10! outline-none shadow-none",
          disabled && "cursor-not-allowed",
        )}
        buttonClass={cn(
          "bg-transparent!",
          disabled && "cursor-not-allowed",
        )}
        buttonStyle={buttonStyle}
        dropdownClass={cn(
          "text-[0.8725rem] font-normal rounded-lg!",
          "overflow-hidden overflow-y-auto [scrollbar-width:none]",
          "bg-card! backdrop-blur-md",
          "shadow-lg border border-white/10",
        )}
        searchClass={cn(
          "bg-[var(--color-bg-quaternary)] flex items-center px-4 py-2.5",
          "[&_input]:flex-1 [&_input]:h-[25px] [&_input]:w-full [&_input]:text-xs",
          "[&_input]:font-normal [&_input]:border [&_input]:border-[var(--color-border-secondary)]",
          "[&_input]:outline-none [&_input]:rounded-[var(--radius-8)] [&_input]:bg-transparent",
          "[&_input]:transition-all [&_input]:duration-[var(--transition)]",
          "[&_input]:text-[var(--color-text-primary)] [&_input]:px-2",
          "[&_input]:placeholder:text-[var(--color-text-quaternary)]",
          "[&_input]:hover:bg-[var(--color-bg-translucent)]",
          "[&_input]:focus:bg-[var(--color-bg-translucent)]",
        )}
        enableAreaCodeStretch
        countryCodeEditable={false}
        enableTerritories
        enableSearch={enableSearch}
        searchPlaceholder={searchPlaceholder}
        disabled={disabled}
        disableSearchIcon
        onChange={handleChange}
      />

      {displayError && (
        <p
          className="mt-1 text-sm font-normal leading-4.5 text-left text-[#d21c1c]"
          role="alert"
          aria-live="polite"
        >
          {displayError}
        </p>
      )}
    </div>
  );
};

export default PhoneDataInput;









// "use client";

// import React from "react";
// import { usePhoneValidation } from "@/hooks/use-phone-validation";
// import { cn } from "@/lib/utils";
// import PhoneInputImport from "react-phone-input-2";
// const PhoneInput = (PhoneInputImport as any).default ?? PhoneInputImport;

// export interface PhoneDataInputProps {
//   value?: string;
//   label?: React.ReactNode;
//   placeholder?: string;
//   country?: string;
//   enableSearch?: boolean;
//   searchPlaceholder?: string;
//   onChange?: (isValid: boolean, value?: string) => void;
//   error?: React.ReactNode;
//   className?: string;
//   containerClassName?: string;
//   style?: React.CSSProperties;
//   containerStyle?: React.CSSProperties;
//   buttonStyle?: React.CSSProperties;
//   disabled?: boolean;
// }

// const PhoneDataInput = ({
//   value,
//   label,
//   placeholder = "Type your phone number",
//   country = "ng",
//   onChange,
//   enableSearch = true,
//   searchPlaceholder = "Search country",
//   error: externalError,
//   className,
//   containerClassName,
//   style,
//   containerStyle,
//   buttonStyle,
//   disabled = false,
// }: PhoneDataInputProps) => {
//   const {
//     error: internalError,
//     validate,
//     clearError,
//   } = usePhoneValidation({
//     initialValue: value,
//     onValidationChange: onChange,
//   });

//   const displayError = externalError ?? internalError;

//   const handleChange = (val: string) => {
//     clearError();
//     validate(val);
//   };

//   return (
//     <div className={cn("relative z-999 text-left", className)} style={style}>
//       {label && (
//         <label
//           className={cn(
//             "mb-0.5 block text-[13px] font-semibold leading-6 tracking-[-0.5px]  2xl:text-base",
//           )}
//         >
//           {label}
//         </label>
//       )}

//       <PhoneInput
//         country={country || "auto"}
//         value={value}
//         placeholder={placeholder}
//         containerClass={cn(
//           // Layout
//           //   "relative h-14 w-full mt-2.5 pl-3",
//           "relative!  w-full! ",
//           // Glass shell
//           //   "rounded-[var(--radius-rounded)] border border-transparent",
//           //   "bg-white/5 backdrop-blur-[67.46px]",
//           "[font-weight:inherit] [font-size:inherit]",
//           // Motion
//           "transition-all duration-[var(--transition)]",

//           // States
//           displayError && "border-[#d21c1c]!",
//           disabled && "cursor-not-allowed",
//           containerClassName,
//         )}
//         containerStyle={containerStyle}
//         inputClass={cn(
//           "block! w-full! h-10! outline-none shadow-none",

//           //   " text-[var(--color-text-primary)] [font-weight:inherit]",
//           //   "placeholder:text-[var(--color-text-quaternary)]",

//           disabled && " cursor-not-allowed",
//         )}
//         buttonClass={cn(
//           //   "bg-transparent border-none outline-none",
//           "bg-transparent!",
//           disabled && "cursor-not-allowed",
//         )}
//         buttonStyle={buttonStyle}
//         dropdownClass={cn(
//           "text-[0.8725rem] font-normal rounded-lg!",
//           "overflow-hidden overflow-y-auto [scrollbar-width:none]",
//           "bg-card! backdrop-blur-md",
//           "shadow-lg border border-white/10",
//         )}
//         searchClass={cn(
//           "bg-[var(--color-bg-quaternary)] flex items-center px-4 py-2.5",
//           // Target nested search input
//           "[&_input]:flex-1 [&_input]:h-[25px] [&_input]:w-full [&_input]:text-xs",
//           "[&_input]:font-normal [&_input]:border [&_input]:border-[var(--color-border-secondary)]",
//           "[&_input]:outline-none [&_input]:rounded-[var(--radius-8)] [&_input]:bg-transparent",
//           "[&_input]:transition-all [&_input]:duration-[var(--transition)]",
//           "[&_input]:text-[var(--color-text-primary)] [&_input]:px-2",
//           "[&_input]:placeholder:text-[var(--color-text-quaternary)]",
//           "[&_input]:hover:bg-[var(--color-bg-translucent)]",
//           "[&_input]:focus:bg-[var(--color-bg-translucent)]",
//         )}
//         enableAreaCodeStretch
//         countryCodeEditable={false}
//         enableTerritories
//         enableSearch={enableSearch}
//         searchPlaceholder={searchPlaceholder}
//         disabled={disabled}
//         disableSearchIcon
//         onChange={handleChange}
//       />

//       {displayError && (
//         <p
//           className="mt-1 text-sm font-normal leading-4.5 text-left text-[#d21c1c]"
//           role="alert"
//           aria-live="polite"
//         >
//           {displayError}
//         </p>
//       )}
//     </div>
//   );
// };

// export default PhoneDataInput;

// // import React, { useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";
// // import { parsePhoneNumberFromString } from "libphonenumber-js";
// // import { cn } from "@/lib/utils";
// // import PhoneInputImport from "react-phone-input-2";
// // const PhoneInput =
// //   (PhoneInputImport as any).default ?? PhoneInputImport;

// // interface CommonProps {
// //   className?: string;
// //   style?: CSSProperties;
// // }

// // export interface PhoneDataInputConfig {
// //   container?: CommonProps;
// //   input?: CommonProps;
// //   button?: CommonProps;
// //   dropdown?: CommonProps;
// //   search?: CommonProps;
// //   label?: CommonProps;
// //   error?: CommonProps;
// // }

// // export interface PhoneDataInputProps {
// //   value?: string;
// //   label?: string | ReactNode;
// //   placeholder?: string;
// //   country?: string | null;
// //   enableSearch?: boolean;
// //   searchPlaceholder?: string;
// //   onChange?: (isValid: boolean, value?: string) => void;
// //   error?: string | ReactNode;
// //   className?: string;
// //   style?: CSSProperties;
// //   disabled?: boolean;
// //   config?: PhoneDataInputConfig;
// // }

// // const PhoneDataInput = ({
// //   value,
// //   label,
// //   placeholder,
// //   country = "ca",
// //   onChange,
// //   enableSearch = true,
// //   searchPlaceholder,
// //   error: externalError,
// //   className,
// //   style,
// //   disabled,
// //   config,
// // }: PhoneDataInputProps) => {
// //   const id = useId();
// //   const [internalError, setInternalError] = useState<string | null>(null);

// //   const validatePhone = (val?: string) => {
// //     if (!val) {
// //       setInternalError("Phone number is required");
// //       onChange?.(false, val);
// //       return;
// //     }

// //     const possible = val.startsWith("+") ? val : `+${val}`;
// //     const phone = parsePhoneNumberFromString(possible);

// //     if (!phone) {
// //       setInternalError("Invalid phone format");
// //       onChange?.(false, val);
// //       return;
// //     }

// //     if (!phone.isValid()) {
// //       setInternalError("Invalid phone number for selected country");
// //       onChange?.(false, val);
// //       return;
// //     }

// //     setInternalError(null);
// //     const e164 = phone.format("E.164");
// //     onChange?.(true, e164);
// //   };

// //   const handleChange = (val: string) => {
// //     setInternalError(null);
// //     validatePhone(val);
// //   };

// //   useEffect(() => {
// //     if (value) validatePhone(value);
// //     else onChange?.(false, value);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const displayError = externalError || internalError;

// //   return (
// //     <div
// //       className={cn(
// //         "relative z-[999] text-left",
// //         disabled && "opacity-60",
// //         displayError && "mt-1",
// //         className
// //       )}
// //       style={style}
// //     >
// //       {label && (
// //         <label
// //           htmlFor={id}
// //           className={cn(
// //             "block text-base font-medium leading-[100%] tracking-[-0.5px] text-muted-foreground",
// //             config?.label?.className
// //           )}
// //           style={config?.label?.style}
// //         >
// //           {label}
// //         </label>
// //       )}

// //       <PhoneInput
// //         country={country || "auto"}
// //         value={value}
// //         placeholder={placeholder || "Type your phone number"}
// //         containerClass={cn(
// //           "relative mt-2.5 h-14 w-full overflow-hidden rounded-full border pl-3 transition-all duration-200",
// //           "bg-card backdrop-blur-[67px]",
// //           displayError ? "border-destructive" : "border-transparent",
// //           config?.container?.className
// //         )}
// //         containerStyle={config?.container?.style}
// //         inputClass={cn(
// //           "h-full w-full border-none bg-transparent pl-[60px] font-medium text-foreground outline-none",
// //           "placeholder:text-muted-foreground/60",
// //           "focus:ring-0 focus:outline-none",
// //           disabled && "cursor-not-allowed text-muted-foreground",
// //           config?.input?.className
// //         )}
// //         inputStyle={config?.input?.style}
// //         buttonClass={cn(
// //           "absolute left-0 top-0 h-full border-none bg-transparent outline-none",
// //           config?.button?.className
// //         )}
// //         buttonStyle={config?.button?.style}
// //         dropdownClass={cn(
// //           "overflow-hidden rounded-lg bg-secondary/50 text-sm font-normal backdrop-blur-md",
// //           "scrollbar-none",
// //           config?.dropdown?.className
// //         )}
// //         dropdownStyle={config?.dropdown?.style}
// //         searchClass={cn(
// //           "flex items-center bg-card px-4 py-2.5",
// //           config?.search?.className
// //         )}
// //         searchStyle={config?.search?.style}
// //         searchPlaceholder={searchPlaceholder || "Search country"}
// //         enableAreaCodeStretch
// //         countryCodeEditable={false}
// //         enableTerritories
// //         enableSearch={enableSearch}
// //         disabled={disabled}
// //         disableSearchIcon
// //         onChange={handleChange}
// //         inputProps={{ id }}
// //       />

// //       {displayError && (
// //         <p
// //           className={cn(
// //             "mt-1 text-left text-sm font-normal leading-[18px] text-destructive",
// //             config?.error?.className
// //           )}
// //           style={config?.error?.style}
// //         >
// //           {displayError}
// //         </p>
// //       )}
// //     </div>
// //   );
// // };

// // export default PhoneDataInput;
