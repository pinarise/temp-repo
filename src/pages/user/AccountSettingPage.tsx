import { useEffect, useState } from "react";
import { Loader2, Trash2, Monitor, KeyRound, ShieldCheck } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/football/Navbar";
import { MobileTopTabs, MobileBottomNav } from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { FormErrorAlert } from "@/components/shared/FormErrorAlert";
import { useAuthStatus } from "@/hooks/auth/use-auth-status";
import { useChangePassword } from "@/hooks/auth/use-change-password";
import { useLogoutAllDevices } from "@/hooks/auth/use-logout";
import { useRequestEmailChange } from "@/hooks/user/use-change-email";
import { useDeleteAccount } from "@/hooks/user/use-delete-account";
import { useSessions, useTerminateSession } from "@/hooks/user/use-sessions";
import { useUpdateProfile } from "@/hooks/user/use-update-profile";
import { applyApiErrorToForm } from "@/lib/form-error-mapping";
import { normalizePhoneNumber } from "@/lib/phone";
import { COUNTRY_OPTIONS } from "@/constants/countries";
import {
  changeEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
  type ChangeEmailFormValues,
  type ChangePasswordFormValues,
  type DeleteAccountFormValues,
  type UpdateProfileFormValues,
} from "@/schemas/auth.schemas";
import { useNavigate } from "@tanstack/react-router";
import OptionSelector from "@/components/shared/OptionSelector";
import PhoneDataInput from "@/components/shared/PhoneDataInput";
import DataInput from "@/components/shared/DataInput";
import EyeToggle from "@/components/shared/EyeToggle";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import { useForgotPassword } from "@/hooks/auth/use-password-reset";

export const AccountSettingsPage = () => {
  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0 flex flex-col">
      <Navbar />
      <MobileTopTabs />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 lg:py-12">
        <ProfileSection />
        <SignInMethodsSection />
        <EmailSection />
        <PasswordSection />
        <SessionsSection />
        <DangerZoneSection />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

interface ISectionCard {
  title: string;
  description?: string;
  children: React.ReactNode;
}
const SectionCard = ({ title, description, children }: ISectionCard) => {
  return (
    <section className="bg-card rounded-md shadow-sm px-5 lg:px-10 py-6 lg:py-10 mb-6">
      <div className="pb-3 border-b border-border mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
};

// ---- Profile ---------------------------------------------------------------
const ProfileSection = () => {
  const { user } = useAuthStatus();
  const updateProfile = useUpdateProfile();
  const [rootError, setRootError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    watch,
    formState: { errors, validatingFields },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      username: user?.username ?? "",
      phone_number: user?.phone_number ?? "",
      country: user?.country ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setRootError(null);
    setSuccessMessage(null);
    try {
      await updateProfile.mutateAsync({
        first_name: values.first_name,
        last_name: values.last_name,
        username: values.username || undefined,
        phone_number: normalizePhoneNumber(values.phone_number),
        country: values.country,
      });
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setRootError(applyApiErrorToForm(err, setError));
    }
  });

  useEffect(() => {
    const subscription = watch((value) => {
      console.log("👀 Live form state:", value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={onSubmit} noValidate>
      <SectionCard
        title="Account Details"
        description="Update your name, username, phone number and country."
      >
        <FormErrorAlert message={rootError} />
        {successMessage && (
          <p className="mb-5 rounded-md border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
            {successMessage}
          </p>
        )}

        <div className="flex justify-center my-6 lg:my-8">
          <div className="relative h-24 w-24 rounded-full bg-muted overflow-hidden grid place-items-center">
            <img
              src={
                user?.avatar ??
                `https://api.dicebear.com/7.x/personas/svg?seed=${user?.email ?? "guest"}&backgroundColor=b6e3f4`
              }
              alt="Profile avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <DataInput
            label={
              <>
                First Name <span className="text-red-500">*</span>
              </>
            }
            error={errors.first_name?.message}
            disabled={updateProfile.isPending}
            {...register("first_name")}
          />
          <DataInput
            label={
              <>
                Last Name <span className="text-red-500">*</span>
              </>
            }
            error={errors.last_name?.message}
            disabled={updateProfile.isPending}
            {...register("last_name")}
          />

          <DataInput
            label="Username"
            error={errors?.username?.message}
            disabled={updateProfile.isPending}
            {...register("username")}
          />

          <Controller
            control={control}
            name="phone_number"
            render={({ field }) => (
              <PhoneDataInput
                label="Phone Number"
                value={field.value}
                onChange={(_isValid, value) => {
                  console.log("_isValid:", _isValid);
                  field.onChange(value || "");
                }}
                error={errors.phone_number?.message}
                disabled={updateProfile.isPending}
                country="ng"
              />
            )}
          />

          <div className="sm:col-span-2">
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
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="h-12 px-10 rounded-full bg-brand text-white font-semibold hover:opacity-95 transition disabled:opacity-60"
          >
            {updateProfile.isPending ? "Saving…" : "Save Updates"}
          </button>
        </div>
      </SectionCard>
    </form>
  );
};

const SignInMethodsSection = () => {
  const { user } = useAuthStatus();
  if (!user) return null;
  const hasEmailLogin = user?.auth_methods?.includes("email");
  const linkedProviders = user?.auth_methods?.filter((m) => m !== "email");

  return (
    <SectionCard title="Sign-in Methods" description="How you can access this account.">
      <ul className="space-y-3">
        <li className="flex items-center gap-3">
          <span
            className={`grid h-9 w-9 place-items-center rounded-full ${
              hasEmailLogin ? "bg-brand-soft/40 text-brand" : "bg-muted text-muted-foreground"
            }`}
          >
            <KeyRound className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">Email &amp; Password</p>
            <p className="text-xs text-muted-foreground">
              {hasEmailLogin ? "Enabled" : "Not set up — see Change Password below"}
            </p>
          </div>
        </li>

        {linkedProviders &&
          linkedProviders?.map((provider) => (
            <li key={provider} className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft/40 text-brand">
                {provider === "google" ? (
                  <GoogleIcon size={16} />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground capitalize">{provider}</p>
                <p className="text-xs text-muted-foreground">Linked</p>
              </div>
            </li>
          ))}
      </ul>
    </SectionCard>
  );
};

// ---- Email -------------------------------------------------------------

// const EmailSection = () =>{
//   const { user } = useAuthStatus();
//   const requestEmailChange = useRequestEmailChange();
//   const [showPassword, setShowPassword] = useState(false);
//   const [rootError, setRootError] = useState<string | null>(null);
//   const [sent, setSent] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setError,
//     reset,
//     formState: { errors },
//   } = useForm<ChangeEmailFormValues>({
//     resolver: zodResolver(changeEmailSchema),
//     defaultValues: { new_email: "", password: "" },
//   });

//   const onSubmit = handleSubmit(async (values) => {
//     setRootError(null);
//     setSent(false);
//     try {
//       await requestEmailChange.mutateAsync(values);
//       setSent(true);
//       reset();
//     } catch (err) {
//       setRootError(applyApiErrorToForm(err, setError));
//     }
//   });

//   return (
//     <form onSubmit={onSubmit} noValidate>
//       <SectionCard
//         title="Email Address"
//         description={`Current email: ${user?.email ?? ""}. Changing it sends a confirmation link to the new address — your email won't update until you click it.`}
//       >
//         <FormErrorAlert message={rootError} />
//         {sent && (
//           <p className="mb-5 rounded-md border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
//             Confirmation link sent. Check the new address's inbox to complete the change.
//           </p>
//         )}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
//           <DataInput
//             label="New Email Address"
//             type="email"
//             error={errors?.new_email?.message}
//             disabled={requestEmailChange.isPending}
//             className="mb-6"
//             {...register("new_email")}
//           />

//           <DataInput
//             label="Current Password"
//             type={showPassword ? "text" : "password"}
//             error={errors.password?.message}
//             disabled={requestEmailChange.isPending}
//             autoComplete="new-password"
//             config={{
//               icons: {
//                 right: {
//                   icon: <EyeToggle onToggle={setShowPassword} value={showPassword} iconSize={16} />,
//                 },
//               },
//             }}
//             {...register("password")}
//           />
//         </div>
//         <div className="flex justify-center mt-8">
//           <button
//             type="submit"
//             disabled={requestEmailChange.isPending}
//             className="h-12 px-10 rounded-full bg-brand text-white font-semibold hover:opacity-95 transition disabled:opacity-60"
//           >
//             {requestEmailChange.isPending ? "Sending…" : "Send Confirmation Link"}
//           </button>
//         </div>
//       </SectionCard>
//     </form>
//   );
// }

const EmailSection = () => {
  const { user } = useAuthStatus();
  const requestEmailChange = useRequestEmailChange();
  const [showPassword, setShowPassword] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { new_email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setRootError(null);
    setSent(false);
    try {
      await requestEmailChange.mutateAsync(values);
      setSent(true);
      reset();
    } catch (err) {
      setRootError(applyApiErrorToForm(err, setError));
    }
  });

  // Changing email requires confirming your current password
  // (ChangeEmailRequest), which an account with no email/password login
  // doesn't have — showing the form would just guarantee a 422.
  if (user && !user?.auth_methods?.includes("email")) {
    const provider = user?.auth_methods?.[0] ?? "a social login";
    return (
      <SectionCard title="Email Address" description={`Current email: ${user?.email}`}>
        <p className="text-sm text-muted-foreground">
          Changing your email isn't currently supported for accounts signed in with {provider}. Set
          a password first (see Change Password below), then you'll be able to change your email
          here.
        </p>
      </SectionCard>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <SectionCard
        title="Email Address"
        description={`Current email: ${user?.email ?? ""}. Changing it sends a confirmation link to the new address — your email won't update until you click it.`}
      >
        <FormErrorAlert message={rootError} />
        {sent && (
          <p className="mb-5 rounded-md border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
            Confirmation link sent. Check the new address's inbox to complete the change.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <DataInput
            label="New Email Address"
            type="email"
            error={errors?.new_email?.message}
            disabled={requestEmailChange.isPending}
            className="mb-6"
            {...register("new_email")}
          />

          <DataInput
            label="Current Password"
            type={showPassword ? "text" : "password"}
            error={errors.password?.message}
            disabled={requestEmailChange.isPending}
            autoComplete="new-password"
            config={{
              icons: {
                right: {
                  icon: <EyeToggle onToggle={setShowPassword} value={showPassword} iconSize={16} />,
                },
              },
            }}
            {...register("password")}
          />
        </div>
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={requestEmailChange.isPending}
            className="h-12 px-10 rounded-full bg-brand text-white font-semibold hover:opacity-95 transition disabled:opacity-60"
          >
            {requestEmailChange.isPending ? "Sending…" : "Send Confirmation Link"}
          </button>
        </div>
      </SectionCard>
    </form>
  );
};

// ---- Password ------------------------------------------------------------

const PasswordField = ({
  label,
  error,
  disabled,
  ...inputProps
}: {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [show, setShow] = useState(false);
  return (
    <DataInput
      label={label}
      type={show ? "text" : "password"}
      error={error}
      disabled={disabled}
      autoComplete="new-password"
      config={{
        icons: {
          right: {
            icon: <EyeToggle onToggle={setShow} value={show} iconSize={16} />,
          },
        },
      }}
      {...(inputProps as any)}
    />
  );
};

const SetPasswordPrompt = () => {
  const { user } = useAuthStatus();
  const forgotPassword = useForgotPassword();
  const [sent, setSent] = useState(false);

  const handleSetPassword = () => {
    if (!user) return;
    forgotPassword.mutate({ email: user.email }, { onSuccess: () => setSent(true) });
  };

  const provider = user?.auth_methods?.[0] ?? "a social login";

  return (
    <SectionCard
      title="Change Password"
      description={`You signed in with ${provider} and don't have a password set yet.`}
    >
      {sent ? (
        <p className="text-sm rounded-md border border-green-200 bg-green-50 px-3 py-2.5 text-green-700">
          If an account exists for {user?.email}, we've sent instructions to set a password.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-5">
            Set a password to also be able to log in with your email address, not just {provider}.
          </p>
          <button
            type="button"
            onClick={handleSetPassword}
            disabled={forgotPassword.isPending}
            className="h-12 px-10 rounded-full bg-brand text-white font-semibold hover:opacity-95 transition disabled:opacity-60"
          >
            {forgotPassword.isPending ? "Sending…" : "Email Me a Password Setup Link"}
          </button>
        </>
      )}
    </SectionCard>
  );
};

const PasswordSection = () => {
  const { user } = useAuthStatus();
  const changePassword = useChangePassword();
  const navigate = useNavigate();
  const [rootError, setRootError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: "", password: "", confirm_password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setRootError(null);
    try {
      await changePassword.mutateAsync({
        current_password: values.current_password,
        password: values.password,
        password_confirmation: values.confirm_password,
      });
      navigate({ to: "/login" });
    } catch (err) {
      setRootError(applyApiErrorToForm(err, setError));
    }
  });

  if (user && !user?.auth_methods?.includes("email")) {
    return <SetPasswordPrompt />;
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <SectionCard
        title="Change Password"
        description="You'll be logged out on every device after changing your password."
      >
        <FormErrorAlert message={rootError} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <div className="sm:col-span-2">
            <PasswordField
              label="Current Password"
              disabled={changePassword.isPending}
              error={errors.current_password?.message}
              {...register("current_password")}
            />
          </div>
          <PasswordField
            label="New Password"
            disabled={changePassword.isPending}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordField
            label="Confirm New Password"
            disabled={changePassword.isPending}
            error={errors.confirm_password?.message}
            {...register("confirm_password")}
          />
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="h-12 px-10 rounded-full bg-brand text-white font-semibold hover:opacity-95 transition disabled:opacity-60"
          >
            {changePassword.isPending ? "Updating…" : "Update Password"}
          </button>
        </div>
      </SectionCard>
    </form>
  );
};

// ---- Sessions ------------------------------------------------------------

const SessionsSection = () => {
  const { data: sessions, isLoading } = useSessions();
  const terminateSession = useTerminateSession();
  const logoutAllDevices = useLogoutAllDevices();
  const navigate = useNavigate();

  return (
    <SectionCard title="Active Sessions" description="Devices currently signed in to your account.">
      {isLoading && (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {!isLoading && sessions && sessions.length === 0 && (
        <p className="text-sm text-muted-foreground py-4">No active sessions found.</p>
      )}

      {!isLoading && sessions && sessions.length > 0 && (
        <ul className="divide-y divide-border">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <Monitor className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.device_name}
                    {session.is_current && (
                      <span className="ml-2 rounded-full bg-brand-soft/40 px-2 py-0.5 text-xs font-semibold text-brand">
                        This device
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.ip_address} · Last active{" "}
                    {new Date(session.last_activity).toLocaleString()}
                  </p>
                </div>
              </div>
              {!session.is_current && (
                <button
                  onClick={() => terminateSession.mutate(session.id)}
                  disabled={terminateSession.isPending}
                  className="text-sm font-semibold text-red-600 hover:underline shrink-0 disabled:opacity-60"
                >
                  Sign out
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={() =>
            logoutAllDevices.mutate(undefined, {
              onSettled: () => navigate({ to: "/" }),
            })
          }
          disabled={logoutAllDevices.isPending}
          className="h-11 px-6 rounded-full border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-60"
        >
          {logoutAllDevices.isPending ? "Signing out everywhere…" : "Sign Out of All Devices"}
        </button>
      </div>
    </SectionCard>
  );
};

// ---- Danger zone -----------------------------------------------------------

const DangerZoneSection = () => {
  const deleteAccount = useDeleteAccount();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "", reason: "", confirmation: undefined },
  });

  const onSubmit = handleSubmit(async (values) => {
    setRootError(null);
    try {
      await deleteAccount.mutateAsync({
        password: values.password,
        reason: values.reason || undefined,
        confirmation: values.confirmation,
      });
      navigate({ to: "/" });
    } catch (err) {
      setRootError(applyApiErrorToForm(err, setError));
    }
  });

  return (
    <SectionCard title="Danger Zone">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline"
        >
          <Trash2 className="h-4 w-4" /> Delete my account
        </button>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <FormErrorAlert message={rootError} />
          <p className="text-sm text-muted-foreground mb-5">
            This permanently deletes your account. This action cannot be undone.
          </p>

          <div className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full h-11 rounded-md border border-border bg-card px-3 outline-none focus:border-brand"
                disabled={deleteAccount.isPending}
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason (optional)</label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-border bg-card px-3 py-2 outline-none focus:border-brand"
                disabled={deleteAccount.isPending}
                {...register("reason")}
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Type <span className="font-mono">DELETE</span> to confirm
              </label>
              <input
                className="w-full h-11 rounded-md border border-border bg-card px-3 outline-none focus:border-brand"
                disabled={deleteAccount.isPending}
                {...register("confirmation")}
              />
              {errors.confirmation && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmation.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={deleteAccount.isPending}
              className="h-11 px-6 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60"
            >
              {deleteAccount.isPending ? "Deleting…" : "Permanently Delete Account"}
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              disabled={deleteAccount.isPending}
              className="h-11 px-6 rounded-full border border-border font-semibold hover:bg-secondary transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </SectionCard>
  );
};
