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
import { useVerifyEmail } from "@/hooks/auth/use-email-verification";

/**
 * Query params match what `App\Notifications\VerifyEmail::buildFrontendUrl()`
 * puts on the link it emails: the real signed-URL's `id`/`hash` plus the
 * `expires`/`signature` lifted off Laravel's signed route, forwarded
 * as-is so the backend's signature validation still checks out.
 */
// const searchSchema = z.object({
//   id: z.string().optional(),
//   hash: z.string().optional(),
//   expires: z.string().optional(),
//   signature: z.string().optional(),
// });

const searchSchema = z.object({
  id: z.string().optional(),
  hash: z.string().optional(),
  expires: z.coerce.string().optional(), // <-- coerce number → string
  signature: z.string().optional(),
});

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [{ title: "Verify Email — Football Nigeria" }],
  }),
  validateSearch: searchSchema,
  component: VerifyEmailPage,
});





function VerifyEmailPage() {
  const { id, hash, expires, signature } = Route.useSearch();
  const verifyEmail = useVerifyEmail();
  const [attempted, setAttempted] = useState(false);
  const hasFired = useRef(false);


  console.log("id:",id, "hash:",hash, "expires:",expires, "signature:",signature)

  useEffect(() => {
    if (hasFired.current) return;

    if (!id || !hash || !expires || !signature) {
      setAttempted(true);
      return;
    }

    hasFired.current = true;
    verifyEmail.mutate(
      { id, hash, expires, signature },
      { onSettled: () => setAttempted(true) },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, hash, expires, signature]);

  const missingParams = !id || !hash || !expires || !signature;

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
                Verifying your email…
              </h1>
            </>
          )}

          {attempted && missingParams && (
            <>
              <XCircle className="mx-auto mb-6 h-10 w-10 text-red-500" />
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Invalid verification link
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                This link is missing required information. Please use the link
                exactly as it appeared in your email.
              </p>
              <Link
                to="/login"
                className="font-semibold text-brand hover:underline"
              >
                Back to Login
              </Link>
            </>
          )}

          {attempted && !missingParams && verifyEmail.isSuccess && (
            <>
              <CheckCircle2 className="mx-auto mb-6 h-10 w-10 text-green-600" />
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Email verified!
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Your email address has been confirmed. You can now log in to
                your account.
              </p>
              <Link
                to="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 font-semibold text-white hover:opacity-95 transition"
              >
                Log In
              </Link>
            </>
          )}

          {attempted && !missingParams && verifyEmail.isError && (
            <>
              <XCircle className="mx-auto mb-6 h-10 w-10 text-red-500" />
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Verification failed
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                {verifyEmail.error instanceof Error
                  ? verifyEmail.error.message
                  : "This link may have expired or already been used."}
              </p>
              <Link
                to="/login"
                className="font-semibold text-brand hover:underline"
              >
                Back to Login
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
