import { Home, Trophy, Tv, Layers, MoreHorizontal, Search, User, LogOut } from "lucide-react";

const top = [
  { icon: Home, label: "Home" },
  { icon: Trophy, label: "Matches" },
  { icon: Tv, label: "Transfer" },
  { icon: Layers, label: "Fan Zone" },
  { icon: MoreHorizontal, label: "Historical Record" },
];
const bottom = [
  { icon: Search, label: "Search" },
  { icon: User, label: "Profile" },
  { icon: LogOut, label: "Logout" },
];

export function MobileTopTabs() {
  return (
    <div className="lg:hidden bg-white border-b">
      <div className="grid grid-cols-5 text-[10px] text-foreground">
        {top.map((t) => (
          <button key={t.label} className="flex flex-col items-center gap-1 py-2">
            <t.icon className="h-4 w-4 text-brand" />
            <span className="truncate px-1">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t shadow-lg">
      <div className="grid grid-cols-3">
        {bottom.map((t) => (
          <button key={t.label} className="flex flex-col items-center gap-1 py-2 text-xs">
            <t.icon className="h-5 w-5 text-brand" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
