import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Navbar } from "@/components/football/Navbar";
import { MobileTopTabs, MobileBottomNav } from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { FormErrorAlert } from "@/components/shared/FormErrorAlert";
import DataInput from "@/components/shared/DataInput";
import EyeToggle from "@/components/shared/EyeToggle";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/auth/use-login";
import { useGoogleLogin } from "@/hooks/auth/use-google-login";
import { applyApiErrorToForm } from "@/lib/form-error-mapping";
import { requireGuest } from "@/guards/route-guards";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schemas";
import { isProfileIncomplete } from "@/types/auth";
import { useState } from "react";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Football Nigeria" },
      {
        name: "description",
        content:
          "Log in to your Football Nigeria account to follow your favourite teams, polls and fan discussions.",
      },
    ],
  }),
  validateSearch: loginSearchSchema,
  beforeLoad: requireGuest,
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();
  const googleLogin = useGoogleLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const [rootError, setRootError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setRootError(null);
    try {
      await login.mutateAsync({
        email: values.email,
        password: values.password,
        remember: values.remember,
      });
      navigate({ to: redirect ?? "/" });
    } catch (err) {
      setRootError(applyApiErrorToForm(err, setError));
    }
  });

  const handleGoogleLogin = async () => {
    setRootError(null);
    try {
      const result = await googleLogin.mutateAsync();
      if (result.is_new_account && isProfileIncomplete(result.user)) {
        navigate({ to: "/complete-profile" as never });
      } else {
        navigate({ to: redirect ?? "/" });
      }
    } catch (err) {
      setRootError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
    }
  };

  const isSubmitting = login.isPending || googleLogin.isPending;

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
            Login to your account
          </h1>

          <FormErrorAlert message={rootError} />

          <Button
            variant="outline"
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleLogin}
            className="w-full h-12 mb-6 flex items-center justify-center gap-2 rounded-full"
          >
            <GoogleIcon />
            <span className="ml-2">
              {googleLogin.isPending ? "Connecting to Google…" : "Log in with Google"}
            </span>
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 text-sm text-muted-foreground">OR</span>
            </div>
          </div>

          <DataInput
            label="Email Address"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            disabled={isSubmitting}
            className="mb-5"
            {...register("email")}
          />

          <DataInput
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            error={errors.password?.message}
            disabled={isSubmitting}
            className="mb-4"
            config={{
              icons: {
                right: {
                  icon: <EyeToggle onToggle={setShowPassword} value={showPassword} iconSize={16} />,
                },
              },
            }}
            {...register("password")}
          />

          <div className="flex items-center justify-between mb-6">
            <RememberMeCheckbox register={register} disabled={isSubmitting} />
            <Link
              to="/reset-password"
              className="text-sm font-semibold text-red-500 hover:underline"
            >
              Lost Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-brand text-white font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {login.isPending ? "Logging in…" : "Log In"} <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-brand underline">
              Register
            </Link>
          </p>
        </form>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function RememberMeCheckbox({
  register,
  disabled,
}: {
  register: ReturnType<typeof useForm<LoginFormValues>>["register"];
  disabled: boolean;
}) {
  const { onChange, ...rest } = register("remember");

  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        className="peer sr-only"
        disabled={disabled}
        onChange={onChange}
        {...rest}
      />
      <span className="grid place-items-center h-5 w-5 rounded border border-muted-foreground peer-checked:border-foreground [&>svg]:hidden peer-checked:[&>svg]:block">
        <Check className="h-3.5 w-3.5" />
      </span>
      Remember Me
    </label>
  );
}
