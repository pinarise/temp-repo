import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { z } from "zod";

import { Navbar } from "@/components/football/Navbar";
import {
  MobileTopTabs,
  MobileBottomNav,
} from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";

const searchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute("/verify-email-sent")({
  head: () => ({
    meta: [{ title: "Verify Your Email — Football Nigeria" }],
  }),
  validateSearch: searchSchema,
  component: VerifyEmailSentPage,
});

function VerifyEmailSentPage() {
  const { email } = Route.useSearch();

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0 flex flex-col">
      <Navbar />
      <MobileTopTabs />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:py-24 flex items-start lg:items-center justify-center">
        <div className="w-full max-w-xl bg-card rounded-md shadow-sm px-6 lg:px-10 py-8 lg:py-10 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft/40">
            <Mail className="h-6 w-6 text-brand" />
          </div>
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">
            Check your inbox
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            We've sent a verification link to{" "}
            {email ? (
              <span className="font-semibold text-foreground">{email}</span>
            ) : (
              "your email address"
            )}
            . Click the link in that email to activate your account — you won't
            be able to log in until you do.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 font-semibold text-brand hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
