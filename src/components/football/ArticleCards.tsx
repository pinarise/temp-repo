import { Link } from "@tanstack/react-router";

export type ArticleCardProps = {
  id: string | number;
  slug?: string;
  image?: string;
  title: string;
  date?: string;
};

export function HeroPollCard({ image, title, id, slug }: { image: string; title: string; id?: string | number; slug?: string }) {
  const cardContent = (
    <div className="grid grid-cols-1 sm:grid-cols-2 bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition">
      <div className="relative h-48 sm:h-auto">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute top-3 right-3 bg-highlight text-highlight-foreground text-[10px] font-bold px-2 py-0.5 rounded">POLL</span>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-2xl font-black tracking-wide">FOOTBALL POLL</p>
          <p className="text-[10px] opacity-80">MARCH 2026</p>
        </div>
      </div>
      <div className="p-4 flex items-center">
        <div>
          <span className="inline-block bg-highlight text-highlight-foreground text-[10px] font-bold px-1.5 py-0.5 rounded mb-2">NPFL</span>
          <h3 className="font-bold text-foreground leading-snug">{title}</h3>
        </div>
      </div>
    </div>
  );

  if (id || slug) {
    return (
      <Link to="/articles/$id" params={{ id: slug || String(id) }} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export function GridCard({ id, slug, image, title, date }: ArticleCardProps) {
  const linkId = slug || String(id);
  return (
    <Link
      to="/articles/$id"
      params={{ id: linkId }}
      className="block bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md hover:-translate-y-0.5 transition"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img src={image || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"} alt={title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{title}</h3>
        {date && <p className="text-xs text-muted-foreground mt-2">{date}</p>}
      </div>
    </Link>
  );
}

export function ListCard({ id, slug, image, title, date }: ArticleCardProps) {
  const linkId = slug || String(id);
  return (
    <Link
      to="/articles/$id"
      params={{ id: linkId }}
      className="flex bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition"
    >
      <div className="w-28 h-20 shrink-0">
        <img src={image || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{title}</h3>
        {date && <p className="text-xs text-muted-foreground mt-1">{date}</p>}
      </div>
    </Link>
  );
}

export function ReadMoreCard({ id, slug, image, title }: ArticleCardProps) {
  const linkId = slug || String(id);
  return (
    <Link
      to="/articles/$id"
      params={{ id: linkId }}
      className="flex bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition"
    >
      <div className="w-28 h-20 shrink-0">
        <img src={image || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{title}</h3>
        <span className="text-xs text-brand font-semibold mt-1 inline-block">Read More</span>
      </div>
    </Link>
  );
}
