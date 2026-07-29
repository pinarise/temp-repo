import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/football/Navbar";
import { MobileTopTabs, MobileBottomNav } from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { FormErrorAlert } from "@/components/shared/FormErrorAlert";
import DataInput from "@/components/shared/DataInput";
import OptionSelector from "@/components/shared/OptionSelector";
import NgFlagIcon from "@/assets/icons/NgFlagIcon";
import { COUNTRY_OPTIONS } from "@/constants/countries";
import { RequireAuth } from "@/guards/RequireAuth";
import { useAuthStatus } from "@/hooks/auth/use-auth-status";
import { useUpdateProfile } from "@/hooks/user/use-update-profile";
import { applyApiErrorToForm } from "@/lib/form-error-mapping";
import { normalizePhoneNumber } from "@/lib/phone";
import { completeProfileSchema, type CompleteProfileFormValues } from "@/schemas/auth.schemas";
import { isProfileIncomplete } from "@/types/auth";
import PhoneDataInput from "@/components/shared/PhoneDataInput";

export const Route = createFileRoute("/complete-profile")({
  head: () => ({
    meta: [{ title: "Complete Your Profile — Football Nigeria" }],
  }),
  component: () => (
    <RequireAuth>
      <CompleteProfilePage />
    </RequireAuth>
  ),
});

function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStatus();
  const updateProfile = useUpdateProfile();
  const [rootError, setRootError] = useState<string | null>(null);

  // If the profile is already complete (e.g. a direct visit to this URL,
  // or this ran after a previous successful submit), there's nothing to
  // do here — send them on.
  useEffect(() => {
    if (user && !isProfileIncomplete(user)) {
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      username: user?.username ?? "",
      phone_number: "",
      country: user?.country ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setRootError(null);
    try {
      await updateProfile.mutateAsync({
        ...values,
        phone_number: normalizePhoneNumber(values.phone_number),
      });
      navigate({ to: "/" });
    } catch (err) {
      setRootError(applyApiErrorToForm(err, setError));
    }
  });

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
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">
            Just a few more details
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {user?.first_name ? `Welcome, ${user.first_name}! ` : ""}
            We need a bit more information before you can start using your account.
          </p>

          <FormErrorAlert message={rootError} />

          <DataInput
            label={
              <>
                Username <span className="text-foreground">*</span>
              </>
            }
            error={errors.username?.message}
            disabled={updateProfile.isPending}
            className="mb-6"
            {...register("username")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
                  disabled={updateProfile.isPending}
                  country="ng"
                />
              )}
            />
            {/* <DataInput
              label={
                <>
                  Phone Number <span className="text-foreground">*</span>
                </>
              }
              error={errors.phone_number?.message}
              disabled={updateProfile.isPending}
              config={{
                components: {
                  left: (
                    <div className="flex items-center gap-1.5 px-2.5 bg-secondary h-full border-r border-border">
                      <NgFlagIcon />
                      <span className="text-sm text-muted-foreground">+234</span>
                    </div>
                  ),
                },
              }}
              {...register("phone_number")}
            /> */}

            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <OptionSelector
                  value={COUNTRY_OPTIONS.find((option) => option.value === field.value) ?? null}
                  options={COUNTRY_OPTIONS}
                  onChange={(option) => field.onChange(option?.value ?? "")}
                  label="Country"
                  placeholder="Select country"
                  loading={false}
                  disabled={updateProfile.isPending}
                  error={errors.country?.message}
                />
              )}
            />
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="w-full h-12 rounded-full bg-brand text-white font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updateProfile.isPending ? "Saving…" : "Continue"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
