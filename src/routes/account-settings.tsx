import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/guards/RequireAuth";
import { AccountSettingsPage } from "@/pages/user/AccountSettingPage";

export const Route = createFileRoute("/account-settings")({
  head: () => ({
    meta: [
      { title: "Account Settings — Football Nigeria" },
      {
        name: "description",
        content: "Manage your Football Nigeria profile, contact details and password.",
      },
    ],
  }),
  component: () => (
    <RequireAuth>
      <AccountSettingsPage />
    </RequireAuth>
  ),
}); 
 