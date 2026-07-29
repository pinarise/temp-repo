import { createFileRoute } from "@tanstack/react-router";
import RegisterPage from "@/pages/auth/RegisterPage";
import { requireGuest } from "@/guards/route-guards";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Football Nigeria" },
      {
        name: "description",
        content:
          "Create a Football Nigeria account to join the conversation, vote in polls, and follow your favourite teams.",
      },
    ],
  }),
  beforeLoad: requireGuest,
  component: RegisterPage,
});
