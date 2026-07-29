import {
  Search,
  User,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SearchOverlay } from "./SearchOverlay";
import { useAuthStatus } from "@/hooks/auth/use-auth-status";
import { useLogout } from "@/hooks/auth/use-logout";

type MenuColumn = { title: string; items: { label: string; to: string }[] };
type NavLink = { label: string; to?: string; menu?: MenuColumn[] };

const TEAMS_MENU: MenuColumn[] = [
  {
    title: "SUPER EAGLE",
    items: [
      { label: "Fixtures & Results", to: "/super-eagles" },
      { label: "Tables", to: "/super-eagles" },
      { label: "Statistics", to: "/super-eagles" },
      { label: "News", to: "/super-eagles" },
    ],
  },
  {
    title: "SUPER FALCON",
    items: [
      { label: "Fixtures Results", to: "/super-eagles" },
      { label: "Tables", to: "/super-eagles" },
      { label: "Statistics", to: "/super-eagles" },
      { label: "News", to: "/super-eagles" },
    ],
  },
  {
    title: "YOUTHS",
    items: [
      { label: "Nigeria Under 21", to: "/super-eagles" },
      { label: "Nigeria Under 17", to: "/super-eagles" },
      { label: "News", to: "/super-eagles" },
    ],
  },
];

const LEAGUES_MENU: MenuColumn[] = [
  {
    title: "COMPETITIONS",
    items: [
      { label: "AFCON Qualifying", to: "/competitions/afcon" },
      { label: "FIFA World Cup Qualifying", to: "/competitions/world-cup" },
      { label: "African Nations Championship", to: "/competitions/chan" },
      { label: "NPFL", to: "/competitions/npfl" },
    ],
  },
];

const MORE_MENU: MenuColumn[] = [
  {
    title: "MORE",
    items: [
      { label: "Fan Zone", to: "/fan-zone" },
      { label: "Historical Records", to: "/historical-records" },
      { label: "Grass Root", to: "/grass-root" },
      { label: "Players Abroad", to: "/grass-root" },
    ],
  },
];

const links: NavLink[] = [
  { label: "Home", to: "/" },
  { label: "News", to: "/grass-root" },
  { label: "Scores & Fixtures", to: "/scores-fixtures" },
  { label: "Tables", to: "/competitions/afcon" },
  { label: "Transfer", to: "/grass-root" },
  { label: "All Teams", menu: TEAMS_MENU },
  { label: "Leagues & Cups", menu: LEAGUES_MENU },
  { label: "Videos", to: "/historical-records" },
  { label: "More", menu: MORE_MENU },
];

function MegaMenu({ columns }: { columns: MenuColumn[] }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block z-50">
      <div className="bg-secondary text-foreground shadow-xl rounded-md p-6 min-w-max">
        <div
          className={`grid gap-10`}
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(180px, 1fr))`,
          }}
        >
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold tracking-wider pb-2 border-b-2 border-brand mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      to={it.to}
                      className="flex items-center gap-2 text-sm border-b border-brand-soft/70 pb-1.5 hover:text-brand"
                    >
                      <span className="text-brand">👁</span>
                      <span>{it.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStatus();
  const logout = useLogout();

  const handleLogout = () => {
    setOpen(false);
    logout.mutate(undefined, {
      onSettled: () => navigate({ to: "/" }),
    });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand text-brand-foreground shadow">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:h-16">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold tracking-wide"
          >
            <span className="text-lg lg:text-xl">
              <span className="text-highlight">F</span>ootball
              <span className="text-highlight">N</span>igeria
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <div key={l.label} className="relative group">
                {l.menu ? (
                  <button className="px-3 py-2 text-sm font-medium hover:bg-brand-dark rounded-md inline-flex items-center gap-1">
                    {l.label}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                ) : (
                  <Link
                    to={l.to!}
                    className="px-3 py-2 text-sm font-medium hover:bg-brand-dark rounded-md inline-flex items-center gap-1"
                  >
                    {l.label}
                  </Link>
                )}
                {l.menu && <MegaMenu columns={l.menu} />}
              </div>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full bg-white text-foreground px-4 py-1.5 text-sm font-medium border border-white hover:bg-white/90"
            >
              Search <Search className="h-4 w-4" />
            </button>
            <div className="relative group">
              <button
                className="rounded-full p-2 hover:bg-brand-dark inline-flex items-center gap-1"
                aria-label="Account"
              >
                {isAuthenticated ? (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-brand">
                    {(user?.first_name?.[0] ?? "").toUpperCase()}
                  </span>
                ) : (
                  <User className="h-4 w-4" />
                )}
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50">
                <div className="bg-secondary text-foreground shadow-xl rounded-md py-2 min-w-[180px]">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-xs text-muted-foreground truncate border-b border-border mb-1">
                        {user?.full_name ?? user?.email}
                      </div>
                      <Link
                        to="/account-settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-brand-soft/40 hover:text-brand font-medium"
                      >
                        <Settings className="h-4 w-4" /> Account Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={logout.isPending}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-left hover:bg-brand-soft/40 hover:text-brand font-medium disabled:opacity-60"
                      >
                        <LogOut className="h-4 w-4" />{" "}
                        {logout.isPending ? "Logging out…" : "Logout"}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm hover:bg-brand-soft/40 hover:text-brand font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm hover:bg-brand-soft/40 hover:text-brand font-medium"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            className="lg:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {open && (
          <div className="lg:hidden bg-brand-dark px-4 pb-3 space-y-1">
            {links.map((l) =>
              l.menu ? (
                <details key={l.label} className="border-b border-white/10">
                  <summary className="py-2 text-sm cursor-pointer list-none flex items-center justify-between">
                    {l.label} <ChevronDown className="h-3 w-3" />
                  </summary>
                  <div className="pb-2 pl-3 space-y-1">
                    {l.menu
                      .flatMap((c) => c.items)
                      .map((it) => (
                        <Link
                          key={it.label}
                          to={it.to}
                          onClick={() => setOpen(false)}
                          className="block py-1.5 text-xs text-white/80"
                        >
                          {it.label}
                        </Link>
                      ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={l.label}
                  to={l.to!}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm border-b border-white/10"
                >
                  {l.label}
                </Link>
              ),
            )}
            <button
              onClick={() => {
                setSearchOpen(true);
                setOpen(false);
              }}
              className="block py-2 text-sm w-full text-left"
            >
              Search
            </button>
            {isAuthenticated ? (
              <>
                <div className="pt-2 mt-2 border-t border-white/10 text-xs text-white/60 truncate">
                  {user?.full_name ?? user?.email}
                </div>
                <Link
                  to="/account-settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm"
                >
                  <Settings className="h-4 w-4" /> Account Settings
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="flex w-full items-center gap-2 py-2 text-sm text-left disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />{" "}
                  {logout.isPending ? "Logging out…" : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm border-t border-white/10 mt-2 pt-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        )}
      </header>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
} 