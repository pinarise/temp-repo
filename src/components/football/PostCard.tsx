import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

export type Post = {
  author: string;
  ago: string;
  title: string;
  tags?: { label: string; variant: "green" | "yellow" }[];
  image?: string;
  text?: string;
  link?: string;
  likes?: string;
  comments?: string;
  thumb?: string;
  avatarColor?: "green" | "blue";
};

function Avatar({ color = "green" }: { color?: "green" | "blue" }) {
  const cls = color === "blue" ? "bg-blue-100 text-blue-600 border-blue-500" : "bg-brand-soft text-brand border-brand";
  return (
    <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-[11px] font-bold ${cls}`}>
      ●
    </div>
  );
}

export function PostCard({ post, children }: { post: Post; children?: React.ReactNode }) {
  return (
    <article className="bg-card rounded-lg border-l-4 border-brand shadow-sm p-4 lg:p-5">
      <header className="flex items-center gap-2 mb-2">
        <Avatar color={post.avatarColor} />
        <span className="text-sm font-semibold">{post.author}</span>
        <span className="text-xs text-muted-foreground">• {post.ago}</span>
      </header>

      <h2 className="text-base lg:text-lg font-bold text-foreground mb-3">{post.title}</h2>

      {post.tags && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((t, i) => (
            <span
              key={i}
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                t.variant === "yellow"
                  ? "bg-highlight text-highlight-foreground"
                  : "bg-brand text-brand-foreground"
              }`}
            >
              {t.label}
            </span>
          ))}
        </div>
      )}

      {post.image && (
        <div className="rounded-lg overflow-hidden mb-3">
          <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
        </div>
      )}

      {(post.text || post.thumb) && (
        <div className="flex gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {post.text && <p className="text-sm text-foreground">{post.text}</p>}
            {post.link && <a href="#" className="text-sm text-brand underline mt-2 inline-block break-all">{post.link}</a>}
          </div>
          {post.thumb && (
            <img src={post.thumb} alt="" className="w-24 h-24 lg:w-28 lg:h-28 object-cover rounded-md shrink-0" />
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-1.5 bg-secondary text-xs px-3 py-1.5 rounded-full">
          <ThumbsUp className="h-3.5 w-3.5" /> {post.likes ?? "Likes"}
        </button>
        <button className="inline-flex items-center gap-1.5 bg-secondary text-xs px-3 py-1.5 rounded-full">
          <MessageCircle className="h-3.5 w-3.5" /> {post.comments ?? "0"}
        </button>
        <button className="inline-flex items-center gap-1.5 bg-secondary text-xs px-3 py-1.5 rounded-full">
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
      </div>

      {children}
    </article>
  );
}
