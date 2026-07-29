import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/football/Navbar";
import {
  MobileTopTabs,
  MobileBottomNav,
} from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { PollCard, type Poll } from "@/components/football/PollCard";
import { IMG } from "@/constants/data";

export const Route = createFileRoute("/polls-predictions")({
  head: () => ({
    meta: [
      { title: "Polls & Predictions — Football Nigeria" },
      {
        name: "description",
        content:
          "Vote on polls, predict match outcomes and connect with other Nigerian football fans.",
      },
    ],
  }),
  component: PollsPage,
});

const polls: Poll[] = [
  {
    title: "WHO WAS THE MAN OF THE MATCH?",
    prompt:
      "Vote for your choice of player who stood out on the Nigeria vs South Africa",
    options: [
      { label: "Oshimen", value: 30 },
      { label: "Victor Moses", value: 30 },
      { label: "Chukwueze", value: 30 },
    ],
  },
  {
    title: "Which of Nigeria's second half goals did you celebrate the most?",
    options: [
      { label: "Degea's Own Goal", value: 30 },
      { label: "Oshimen Equalizer", value: 30 },
    ],
  },
  {
    title: "Which team do you want Nigeria to face in the AFCON?",
    options: [
      { label: "South Africa", value: 30 },
      { label: "Ghana", value: 30 },
      { label: "Egypt", value: 30 },
      { label: "Algeria", value: 30 },
    ],
  },
  {
    title: "Who will win this weekend?",
    subtitle: "Nigeria vs Ghana",
    prompt: "Prediction",
    options: [
      { label: "Home", value: 30 },
      { label: "Draw", value: 30 },
      { label: "Away", value: 30 },
    ],
    cta: "View Tips",
  },
  {
    title: "How would you rate Nigeria's performance in the Afcon?",
    options: [
      { label: "5", value: 30 },
      { label: "4", value: 30 },
      { label: "3", value: 30 },
      { label: "2", value: 30 },
      { label: "1", value: 30 },
    ],
    rating: true,
  },
  {
    title: "Which team do you want Nigeria to face in the AFCON?",
    options: [
      { label: "South Africa", value: 30 },
      { label: "Ghana", value: 30 },
      { label: "Egypt", value: 30 },
      { label: "Algeria", value: 30 },
    ],
  },
];

function PollsPage() {
  const [tab, setTab] = useState<"league" | "national">("league");
  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      <main className="mx-auto max-w-7xl px-4 py-4 lg:py-6 space-y-5">
        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden h-44 lg:h-72">
          <img
            src={IMG.celebrate}
            alt="Fans celebrating"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
          <div className="relative z-10 h-full flex flex-col justify-end p-5 lg:p-10 text-white">
            <h1 className="text-2xl lg:text-4xl font-extrabold">
              Polls & Predictions
            </h1>
            <p className="text-xs lg:text-base opacity-90 mt-1 lg:mt-2 max-w-md">
              Share your stories, vote on polls, and connect with other fans.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-lg p-1 grid grid-cols-2 text-sm lg:text-base font-semibold shadow-sm">
          {(["league", "national"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2.5 rounded-md transition ${
                tab === t ? "bg-brand text-brand-foreground" : "text-foreground"
              }`}
            >
              {t === "league" ? "League Poll" : "National Poll"}
            </button>
          ))}
        </div>

        {/* Poll grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {polls.map((p, i) => (
            <PollCard key={i} poll={p} />
          ))}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
