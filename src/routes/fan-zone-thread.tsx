import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/football/Navbar";
import {
  MobileTopTabs,
  MobileBottomNav,
} from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { PostCard, type Post } from "@/components/football/PostCard";
import { CommentList, type Comment } from "@/components/football/CommentThread";
import { IMG } from "@/constants/data";

export const Route = createFileRoute("/fan-zone-thread")({
  head: () => ({
    meta: [
      { title: "Match Thread — Football Nigeria" },
      {
        name: "description",
        content:
          "Discuss the Nigeria vs South Africa match with fans across the country.",
      },
    ],
  }),
  component: FanZoneThreadPage,
});

const mainPost: Post = {
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
};

const reply: Comment = {
  author: "anonymous",
  ago: "3hrs. ago",
  text: "I think Player Y was the real MVP of the game. His defensive work was phenomenal!",
};

const comments: Comment[] = [
  { ...reply, replies: [reply, reply] },
  { ...reply, author: "winners", avatarColor: "blue", replies: [reply, reply] },
];

const linkedPost: Post = {
  author: "admin",
  ago: "3hrs. ago",
  title: "",
  text: "Lorem ipsum dolor sit amet consectetur. Fermentum et volutpat sit eu amet interdum. Lacus sagittis sed tellus laoreet in nibh in donec. Risus iaculis velit eget adipiscing risus molestie auctor. Dui est dolor id netus platea pellentesque egestas dolor.",
  link: "http://www.testinging.com",
  thumb: IMG.action,
  likes: "20",
  comments: "1.5k",
};

function FanZoneThreadPage() {
  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      <main className="mx-auto max-w-7xl px-4 py-4 lg:py-6 space-y-5">
        <PostCard post={mainPost}>
          <hr className="my-5" />
          <input
            type="text"
            placeholder="Add comments"
            className="w-full border rounded-full px-4 py-2.5 text-sm bg-background mb-2"
          />
          <CommentList comments={comments} />
        </PostCard>

        <PostCard post={linkedPost} />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
