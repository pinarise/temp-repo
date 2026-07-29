import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ArrowLeft } from "lucide-react";
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

export const Route = createFileRoute("/reset-link-sent")({
  head: () => ({
    meta: [
      { title: "Reset Link Sent — Football Nigeria" },
      {
        name: "description",
        content:
          "We've sent instructions to reset your Football Nigeria password.",
      },
    ],
  }),
  validateSearch: searchSchema,
  component: ResetLinkSentPage,
});

function ResetLinkSentPage() {
  const { email } = Route.useSearch();

  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0 flex flex-col">
      <Navbar />
      <MobileTopTabs />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 lg:py-24 flex items-start lg:items-center justify-center">
        <div className="w-full max-w-xl bg-card rounded-md shadow-sm px-6 lg:px-10 py-8 lg:py-10">
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">
            Reset Link Sent
          </h1>
          <p className="text-sm text-foreground mb-8">
            If an account exists for{" "}
            <span className="font-semibold">
              {email ?? "the email you entered"}
            </span>
            , we've sent instructions on how to reset your password.
          </p>
          <div className="flex flex-col items-center gap-6">
            <a
              href="mailto:"
              className="inline-flex items-center gap-2 font-semibold text-brand hover:underline"
            >
              Check Mailbox <Mail className="h-4 w-4" />
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 font-semibold text-brand hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Login Page
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
