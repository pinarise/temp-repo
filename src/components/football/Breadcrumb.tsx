import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <a
              href={it.href ?? "#"}
              className={last ? "text-brand font-semibold" : "text-muted-foreground hover:text-foreground"}
            >
              {it.label}
            </a>
          </div>
        );
      })}
    </nav>
  );
}
