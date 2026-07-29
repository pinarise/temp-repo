import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/football/Navbar";
import {
  MobileTopTabs,
  MobileBottomNav,
} from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { PostCard, type Post } from "@/components/football/PostCard";
import { IMG, fixtures } from "@/constants/data";

export const Route = createFileRoute("/fan-zone")({
  head: () => ({
    meta: [
      { title: "Fan Zone — Football Nigeria" },
      {
        name: "description",
        content:
          "Welcome to the Fan Zone. Share your opinion, discuss matches and connect with other fans.",
      },
    ],
  }),
  component: FanZonePage,
});

const tags = [
  "Daily Discussion",
  "Super Eagles",
  "NPFL Discussion",
  "Match Thrend",
  "Post-Match Thrend",
  "Recent",
  "Top",
  "Top Thrending",
];

const posts: Post[] = [
  {
    author: "admin",
    ago: "3hrs. ago",
    title: "Match Thrend: Nigeria Vs South Africa discussions",
    tags: [
      { label: "Free Predictions", variant: "green" },
      { label: "Bettings", variant: "green" },
    ],
    image: IMG.poll,
    text: "Match ends, Nigeria 1, South Africa 1. 90'+6'. Second Half ends, Nigeria 1, South Africa 1. 90'+4'. Foul by Khuliso Mudau (South Africa). Full Commentary.",
    likes: "Likes",
    comments: "1.5k",
  },
  {
    author: "betgeniune",
    ago: "3hrs. ago",
    title: "Nigeria Qualified for word cup 2025",
    text: "Yes, Nigeria can still reach the finals to be staged across the United States, Canada and Mexico. All is not lost just yet, although there is a fast-closing ...",
    link: "http://www.testinging.com",
    thumb: IMG.action,
    likes: "20",
    comments: "1.5k",
  },
  {
    author: "admin",
    ago: "3hrs. ago",
    title: "Enugu Rangers Vs Eyimba Discussion",
    tags: [
      { label: "Free Predictions", variant: "yellow" },
      { label: "Bettings", variant: "green" },
    ],
    image: IMG.goal,
    likes: "Likes",
    comments: "1.5k",
  },
];

function MatchPreview() {
  return (
    <aside className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3">
        <h3 className="font-bold">Saturday</h3>
        <p className="text-xs text-muted-foreground">
          Last Updated: 26 November, 3:01pm
        </p>
      </div>
      <div className="bg-brand text-brand-foreground text-xs font-bold px-4 py-2">
        MATCH PREVIEW
      </div>
      <ul className="divide-y">
        {fixtures.concat(fixtures).map((f, i) => (
          <li
            key={i}
            className="flex items-center justify-between px-4 py-2 text-xs"
          >
            <span className="w-10 text-[10px] text-muted-foreground">ENG</span>
            <span className="flex-1 text-right pr-2">
              {i % 2 ? "Liverpool" : "Man United"}
            </span>
            <span className="px-2 font-bold">3 - 4</span>
            <span className="flex-1 pl-2">{i % 2 ? "Westham" : "Chelsea"}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FanZonePage() {
  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      <main className="mx-auto max-w-7xl px-4 py-4 lg:py-6 space-y-5">
        {/* Hero */}
        <div className="relative rounded-xl overflow-hidden h-40 lg:h-56">
          <img
            src={IMG.celebrate}
            alt="Fans"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
          <div className="relative z-10 h-full flex flex-col justify-center p-5 lg:p-10 text-white">
            <h1 className="text-2xl lg:text-4xl font-extrabold">
              Welcome to the Fan Zone!
            </h1>
            <p className="text-xs lg:text-base opacity-90 mt-1">
              Share your opinion/comments and connect with other fans
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              className="bg-card border text-xs lg:text-sm px-3 py-1.5 rounded-full hover:bg-secondary"
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          <div className="space-y-4">
            {posts.map((p, i) => (
              <Link key={i} to="/fan-zone-thread" className="block">
                <PostCard post={p} />
              </Link>
            ))}
          </div>
          <div className="hidden lg:block space-y-4">
            <MatchPreview />
            <div className="bg-muted rounded-lg h-64" />
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
