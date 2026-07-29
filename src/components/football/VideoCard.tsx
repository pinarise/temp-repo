import { Play } from "lucide-react";

export function VideoHero({ image, title }: { image: string; title?: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-sm group cursor-pointer">
      <img src={image} alt={title ?? "Featured video"} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <span className="h-16 w-16 rounded-full bg-white/90 grid place-items-center shadow-lg group-hover:scale-110 transition">
          <Play className="h-7 w-7 text-brand fill-brand ml-1" />
        </span>
      </div>
    </div>
  );
}
