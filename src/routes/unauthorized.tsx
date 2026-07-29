import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [{ title: "Access Denied — Football Nigeria" }],
  }),
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <ShieldAlert
          className="mx-auto h-14 w-14 text-red-500"
          aria-hidden="true"
        />
        <h1 className="mt-4 text-7xl font-bold text-foreground">403</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Access denied
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have permission to view this page. If you think this is a
          mistake, contact support.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
