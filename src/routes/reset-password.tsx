import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ScanSearch, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";

import { Navbar } from "@/components/football/Navbar";
import { MobileTopTabs, MobileBottomNav } from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { FormErrorAlert } from "@/components/shared/FormErrorAlert";
import DataInput from "@/components/shared/DataInput";
import EyeToggle from "@/components/shared/EyeToggle";
import { useForgotPassword, useResetPassword } from "@/hooks/auth/use-password-reset";
import { applyApiErrorToForm } from "@/lib/form-error-mapping";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from "@/schemas/auth.schemas";

/**
 * This one route serves two purposes, distinguished by search params:
 *  - No `token`/`email` -> "request a reset link" form (the entry point
 *    someone reaches from the login page's "Lost Password?" link).
 *  - `token` + `email` present -> "set a new password" form. This is the
 *    exact shape `App\Notifications\PasswordResetNotification` builds
 *    the emailed link with (`FRONTEND_URL/reset-password?token=X&email=Y`),
 *    so the URL from the email lands directly on the right mode here.
 *
 * Deliberately NOT gated behind `requireGuest`: someone can click a
 * password-reset link while still signed in elsewhere (e.g. a stale
 * session in another tab, or recovering an account they're currently
 * also logged into) — blocking that would break account recovery for a
 * real, common case.
 */
const searchSchema = z.object({
  token: z.string().optional(),
  email: z.string().optional(),
});

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Football Nigeria" },
      {
        name: "description",
        content: "Reset your Football Nigeria account password.",
      },
    ],
  }),
  validateSearch: searchSchema,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token, email } = Route.useSearch();

  if (token && email) {
    return <SetNewPasswordForm token={token} email={email} />;
  }

  return <RequestResetLinkForm />;
}

function RequestResetLinkForm() {
  const navigate = useNavigate();
  const forgotPassword = useForgotPassword();
  const [rootError, setRootError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setRootError(null);
    try {
      await forgotPassword.mutateAsync(values);
      navigate({
        to: "/reset-link-sent" as never,
        search: { email: values.email } as never,
      });
    } catch (err) {
      setRootError(applyApiErrorToForm(err, setError));
    }
  });

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0 flex flex-col">
      <Navbar />
      <MobileTopTabs />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:py-24 flex items-start lg:items-center justify-center">
        <form
          onSubmit={onSubmit}
          noValidate
          className="w-full max-w-xl bg-card rounded-md shadow-sm px-6 lg:px-10 py-8 lg:py-10"
        >
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground mb-6 lg:mb-8">
            Reset Password
          </h1>

          <FormErrorAlert message={rootError} />

          <DataInput
            label="Email Address"
            type="email"
            error={errors.email?.message}
            disabled={forgotPassword.isPending}
            className="mb-5"
            {...register("email")}
          />

          <button
            type="submit"
            disabled={forgotPassword.isPending}
            className="w-full h-12 rounded-full bg-brand text-white font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {forgotPassword.isPending ? "Sending…" : "Send Reset Link"}{" "}
            <ScanSearch className="h-4 w-4" />
          </button>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Remembered Password?{" "}
            <Link to="/login" className="font-bold text-brand underline">
              Login
            </Link>
          </p>
        </form>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function SetNewPasswordForm({ token, email }: { token: string; email: string }) {
  const navigate = useNavigate();
  const resetPassword = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setRootError(null);
    try {
      await resetPassword.mutateAsync({
        token,
        email,
        password: values.password,
        password_confirmation: values.confirm_password,
      });
      navigate({ to: "/login" });
    } catch (err) {
      setRootError(applyApiErrorToForm(err, setError));
    }
  });

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0 flex flex-col">
      <Navbar />
      <MobileTopTabs />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:py-24 flex items-start lg:items-center justify-center">
        <form
          onSubmit={onSubmit}
          noValidate
          className="w-full max-w-xl bg-card rounded-md shadow-sm px-6 lg:px-10 py-8 lg:py-10"
        >
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">
            Set a new password
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Choose a new password for <span className="font-semibold text-foreground">{email}</span>
            .
          </p>

          <FormErrorAlert message={rootError} />

          <DataInput
            label="New Password"
            type={showPassword ? "text" : "password"}
            error={errors.password?.message}
            disabled={resetPassword.isPending}
            className="mb-5"
            config={{
              icons: {
                right: {
                  icon: <EyeToggle onToggle={setShowPassword} value={showPassword} iconSize={16} />,
                },
              },
            }}
            {...register("password")}
          />

          <DataInput
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            error={errors.confirm_password?.message}
            disabled={resetPassword.isPending}
            className="mb-6"
            config={{
              icons: {
                right: {
                  icon: (
                    <EyeToggle
                      onToggle={setShowConfirmPassword}
                      value={showConfirmPassword}
                      iconSize={16}
                    />
                  ),
                },
              },
            }}
            {...register("confirm_password")}
          />

          <button
            type="submit"
            disabled={resetPassword.isPending}
            className="w-full h-12 rounded-full bg-brand text-white font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {resetPassword.isPending ? "Saving…" : "Reset Password"}{" "}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
