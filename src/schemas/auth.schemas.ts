import { z } from "zod";

/**
 * Every rule here mirrors a corresponding Laravel FormRequest rule, so
 * client-side validation never rejects something the backend would
 * accept (or vice versa). Where the two could drift (e.g. the country
 * allow-list), a comment says so.
 */

const PASSWORD_MIN_LENGTH = 8;

/** Mirrors `Password::min(8)->mixedCase()->numbers()->symbols()`. */
const passwordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  )
  .regex(/[a-z]/, "Password must include at least one lowercase letter.")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
  .regex(/\d/, "Password must include at least one number.")
  .regex(/[^a-zA-Z0-9]/, "Password must include at least one symbol.");

/** Mirrors `RegisterRequest`'s phone_number rule: `/^\+?[1-9]\d{7,14}$/`. */
const phoneNumberSchema = z
  .string()
  .min(1, "Phone number is required.")
  .regex(
    /^\+?[1-9]\d{7,14}$/,
    "Enter a valid phone number.",
  );

/**
 * NOTE: this list intentionally mirrors only the subset of
 * `config/countries.php` actually offered in the UI's country dropdown
 * today (see RegisterPage's <OptionSelector> options) — not the
 * backend's full ~190-country allow-list. If the dropdown is expanded to
 * the full list later, this schema needs no change (it just checks
 * non-empty); the backend remains the source of truth for validity.
 */
const countrySchema = z.string().min(1, "Country is required.");

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "First name is required.")
      .max(255)
      .regex(
        /^[a-zA-Z\s-]+$/,
        "First name may only contain letters, spaces, and hyphens.",
      ),
    last_name: z
      .string()
      .min(1, "Last name is required.")
      .max(255)
      .regex(
        /^[a-zA-Z\s-]+$/,
        "Last name may only contain letters, spaces, and hyphens.",
      ),
    email: z
      .string()
      .min(1, "Email address is required.")
      .email("Enter a valid email address."),
    phone_number: phoneNumberSchema,
    country: countrySchema,
    username: z
      .string()
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username may only contain letters, numbers, and underscores.",
      )
      .min(3, "Username must be at least 3 characters.")
      .max(30, "Username must not exceed 30 characters.")
      .optional()
      .or(z.literal("")),
    password: passwordSchema,
    confirm_password: z.string().min(1, "Please confirm your password."),
    terms_accepted: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Enter a valid email address."),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm_password: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required."),
    password: passwordSchema,
    confirm_password: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  })
  .refine((data) => data.current_password !== data.password, {
    message: "New password must be different from your current password.",
    path: ["password"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const completeProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must not exceed 30 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may only contain letters, numbers, and underscores.",
    ),
  phone_number: phoneNumberSchema,
  country: countrySchema,
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required.")
    .max(255)
    .regex(
      /^[a-zA-Z\s-]+$/,
      "First name may only contain letters, spaces, and hyphens.",
    ),
  last_name: z
    .string()
    .min(1, "Last name is required.")
    .max(255)
    .regex(
      /^[a-zA-Z\s-]+$/,
      "Last name may only contain letters, spaces, and hyphens.",
    ),
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may only contain letters, numbers, and underscores.",
    )
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must not exceed 30 characters.")
    .optional()
    .or(z.literal("")),
  phone_number: phoneNumberSchema,
  country: countrySchema,
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const changeEmailSchema = z.object({
  new_email: z
    .string()
    .min(1, "New email address is required.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(1, "Your current password is required to confirm this change."),
});

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required."),
  reason: z
    .string()
    .max(500, "Reason must not exceed 500 characters.")
    .optional()
    .or(z.literal("")),
  confirmation: z.literal("DELETE", {
    errorMap: () => ({ message: 'Please type "DELETE" exactly to confirm.' }),
  }),
});

export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;
