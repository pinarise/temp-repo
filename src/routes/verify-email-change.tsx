import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { Navbar } from "@/components/football/Navbar";
import {
  MobileTopTabs,
  MobileBottomNav,
} from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { RequireAuth } from "@/guards/RequireAuth";
import { useVerifyEmailChange } from "@/hooks/user/use-change-email";

const searchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/verify-email-change")({
  head: () => ({
    meta: [{ title: "Confirm Email Change — Football Nigeria" }],
  }),
  validateSearch: searchSchema,
  component: () => (
    <RequireAuth>
      <VerifyEmailChangePage />
    </RequireAuth>
  ),
});

function VerifyEmailChangePage() {
  const { token } = Route.useSearch();
  const verifyEmailChange = useVerifyEmailChange();
  const [attempted, setAttempted] = useState(false);
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;

    if (!token) {
      setAttempted(true);
      return;
    }

    hasFired.current = true;
    verifyEmailChange.mutate(
      { token },
      { onSettled: () => setAttempted(true) },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0 flex flex-col">
      <Navbar />
      <MobileTopTabs />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:py-24 flex items-start lg:items-center justify-center">
        <div className="w-full max-w-xl bg-card rounded-md shadow-sm px-6 lg:px-10 py-8 lg:py-10 text-center">
          {!attempted && (
            <>
              <Loader2 className="mx-auto mb-6 h-8 w-8 animate-spin text-brand" />
              <h1 className="text-xl font-semibold text-foreground">
                Confirming your new email…
              </h1>
            </>
          )}

          {attempted && !token && (
            <>
              <XCircle className="mx-auto mb-6 h-10 w-10 text-red-500" />
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Invalid link
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                This link is missing required information. Please use the link
                exactly as it appeared in your email.
              </p>
              <Link
                to="/account-settings"
                className="font-semibold text-brand hover:underline"
              >
                Back to Account Settings
              </Link>
            </>
          )}

          {attempted && token && verifyEmailChange.isSuccess && (
            <>
              <CheckCircle2 className="mx-auto mb-6 h-10 w-10 text-green-600" />
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Email updated!
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Your account email address has been changed.
              </p>
              <Link
                to="/account-settings"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 font-semibold text-white hover:opacity-95 transition"
              >
                Back to Account Settings
              </Link>
            </>
          )}

          {attempted && token && verifyEmailChange.isError && (
            <>
              <XCircle className="mx-auto mb-6 h-10 w-10 text-red-500" />
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Confirmation failed
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                {verifyEmailChange.error instanceof Error
                  ? verifyEmailChange.error.message
                  : "This link may have expired or already been used."}
              </p>
              <Link
                to="/account-settings"
                className="font-semibold text-brand hover:underline"
              >
                Back to Account Settings
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
