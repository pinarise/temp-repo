import GoogleIcon from "@/assets/icons/GoogleIcon"; 
import DataInput from "@/components/shared/DataInput";
import EyeToggle from "@/components/shared/EyeToggle";
import { Footer } from "@/components/football/Footer";
import { MobileBottomNav, MobileTopTabs } from "@/components/football/MobileTabs";
import { Navbar } from "@/components/football/Navbar";
import OptionSelector from "@/components/shared/OptionSelector";
import { FormErrorAlert } from "@/components/shared/FormErrorAlert";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { COUNTRY_OPTIONS } from "@/constants/countries";
import { useRegister } from "@/hooks/auth/use-register";
import { useGoogleLogin } from "@/hooks/auth/use-google-login";
import { applyApiErrorToForm } from "@/lib/form-error-mapping";
import { normalizePhoneNumber } from "@/lib/phone";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schemas";
import { isProfileIncomplete } from "@/types/auth";
import PhoneDataInput from "@/components/shared/PhoneDataInput";
import { Checkbox } from "@/components/ui/checkbox";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null); 
  const registerMutation = useRegister();
  const googleLogin = useGoogleLogin();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      country: "",
      username: "",
      password: "",
      confirm_password: "",
      terms_accepted: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setRootError(null);
    try {
      await registerMutation.mutateAsync({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: normalizePhoneNumber(values.phone_number),
        country: values.country,
        username: values.username || undefined,
        password: values.password,
        password_confirmation: values.confirm_password,
        terms_accepted: values.terms_accepted,
      });
      navigate({
        to: "/verify-email-sent" as never,
        search: { email: values.email } as never,
      });
    } catch (err) {
      setRootError(applyApiErrorToForm(err, setError));
    }
  });

  const handleGoogleSignup = async () => {
    setRootError(null);
    try {
      const result = await googleLogin.mutateAsync();
      if (isProfileIncomplete(result.user)) {
        navigate({ to: "/complete-profile" as never });
      } else {
        navigate({ to: "/" });
      }
    } catch (err) {
      setRootError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
    }
  };

  const isSubmitting = registerMutation.isPending || googleLogin.isPending;

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0 flex flex-col">
      <Navbar />
      <MobileTopTabs />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:py-16 flex items-start lg:items-center justify-center">
        <form
          onSubmit={onSubmit}
          noValidate
          className="w-full max-w-xl bg-card rounded-md shadow-sm px-6 lg:px-10 py-8 lg:py-10"
        >
          <h1 className="text-xl text-center lg:text-2xl font-semibold text-foreground mb-6 lg:mb-8">
            Create Account
          </h1>

          <FormErrorAlert message={rootError} />

          <Button
            variant="outline"
            className="w-full h-12 mb-6 flex items-center justify-center gap-2 rounded-full"
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleSignup}
          >
            <GoogleIcon />
            <span className="ml-2">
              {googleLogin.isPending ? "Connecting to Google…" : "Sign up with Google"}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <DataInput
              label={
                <>
                  First Name <span className="text-foreground">*</span>
                </>
              }
              error={errors.first_name?.message}
              disabled={isSubmitting}
              {...register("first_name")}
            />
            <DataInput
              label={
                <>
                  Last Name <span className="text-foreground">*</span>
                </>
              }
              error={errors.last_name?.message}
              disabled={isSubmitting}
              {...register("last_name")}
            />
          </div>




          <DataInput
            label={
              <>
                Email Address <span className="text-foreground">*</span>
              </>
            }
            type="email"
            error={errors.email?.message}
            disabled={isSubmitting}
            className="mb-6"
            {...register("email")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Controller
              control={control}
              name="phone_number"
              render={({ field }) => (
                <PhoneDataInput
                  label={
                    <>
                      Phone Number <span className="text-foreground">*</span>
                    </>
                  }
                  value={field.value}
                  onChange={(_isValid, value) => {
                    field.onChange(value || "");
                  }}
                  error={errors.phone_number?.message}
                  disabled={isSubmitting}
                  country="ng"
                />
              )}
            />

            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <OptionSelector
                  value={COUNTRY_OPTIONS.find((option) => option.value === field.value) ?? null}
                  options={COUNTRY_OPTIONS}
                  onChange={(option) => field.onChange(option?.value ?? "")}
                  label={
                    <>
                      Country <span className="text-foreground">*</span>
                    </>
                  }
                  placeholder=""
                  loading={false}
                  disabled={isSubmitting}
                  error={errors.country?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <DataInput
              label="New Password"
              type={showPassword ? "text" : "password"}
              error={errors.password?.message}
              disabled={isSubmitting}
              autoComplete="new-password"
              config={{
                icons: {
                  right: {
                    icon: (
                      <EyeToggle onToggle={setShowPassword} value={showPassword} iconSize={16} />
                    ),
                  },
                },
              }}
              {...register("password")}
            />

            <DataInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              error={errors.confirm_password?.message}
              disabled={isSubmitting}
              autoComplete="new-password"
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
          </div>

          <div className="mb-2">
            <Controller
              control={control}
              name="terms_accepted"
              render={({ field }) => (
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <Checkbox
                    disabled={isSubmitting}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-muted-foreground">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="font-semibold text-brand underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="font-semibold text-brand underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              )}
            />
          
            {errors.terms_accepted?.message && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.terms_accepted.message}
              </p>
            )}
          </div>

          <div className="mt-8">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full inline-flex items-center justify-center gap-2 font-semibold"
            >
              {registerMutation.isPending ? "Creating account…" : "Create Account"}{" "}
              <UserPlus className="h-4 w-4" />
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-brand underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};
export default RegisterPage;
