import { createFileRoute } from "@tanstack/react-router";
import { Play, ArrowRight, Upload } from "lucide-react";
import { Navbar } from "@/components/football/Navbar";
import {
  MobileTopTabs,
  MobileBottomNav,
} from "@/components/football/MobileTabs";
import { Footer } from "@/components/football/Footer";
import { SectionHeader } from "@/components/football/SectionHeader";
import { IMG } from "@/constants/data";

export const Route = createFileRoute("/historical-records")({
  head: () => ({
    meta: [
      { title: "Historical Records — Football Nigeria" },
      {
        name: "description",
        content:
          "Fan diaries and historical records — share your story and watch fan moments.",
      },
    ],
  }),
  component: HistoricalRecordsPage,
});

const diaryTitles = [
  "My first ALFCON experience",
  "Gyration Fans Dance",
  "My First Super Eagles Match",
  "The Best Viewing Fan Spot",
  "Snapshot with my favourite player",
  "How We won the game",
  "My First Super Eagles Match",
  "My First Super Eagles Match",
  "My First Super Eagles Match",
];

const diaryImages = [
  IMG.fan1,
  IMG.celebrate,
  IMG.team,
  IMG.flag,
  IMG.fan1,
  IMG.celebrate,
  IMG.fan1,
  IMG.celebrate,
  IMG.team,
];

function DiaryCard({ title, image }: { title: string; image: string }) {
  return (
    <article className="bg-card rounded-lg overflow-hidden shadow-sm border">
      <div className="relative aspect-[16/10]">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-full">
          <Play className="h-3 w-3 fill-current" />
          00:18
        </span>
      </div>
      <div className="p-3 lg:p-4">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1.5">
          The Nigerian national team defeated their opponents 3-0 in a thrilling
          match.
        </p>
        <p className="text-[11px] text-muted-foreground mt-3 border-t pt-2">
          21 Jan 2025
        </p>
      </div>
    </article>
  );
}

function HistoricalRecordsPage() {
  return (
    <div className="min-h-screen bg-secondary pb-24 lg:pb-0">
      <Navbar />
      <MobileTopTabs />

      <main className="mx-auto max-w-7xl px-4 py-4 lg:py-6 space-y-6">
        {/* Video hero */}
        <div className="relative rounded-xl overflow-hidden aspect-[16/9] lg:aspect-[21/9]">
          <img
            src={IMG.celebrate}
            alt="Fans cheering"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-white/95 rounded-full p-4 lg:p-5 shadow-lg">
              <Play className="h-6 w-6 lg:h-8 lg:w-8 text-foreground fill-current" />
            </button>
          </div>
        </div>

        <SectionHeader title="Latest Fan Diaries" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {diaryTitles.map((t, i) => (
            <DiaryCard key={i} title={t} image={diaryImages[i]} />
          ))}
        </div>

        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 border border-border bg-card text-foreground text-xs lg:text-sm font-semibold px-4 py-2 rounded-full hover:bg-secondary">
            Next <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Share Your Experience */}
        <section className="bg-card rounded-xl p-5 lg:p-8 shadow-sm">
          <h2 className="text-lg lg:text-xl font-bold text-foreground mb-5">
            Share Your Experience
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Story Title
              </label>
              <input
                type="text"
                placeholder="Enter your title story here"
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Your Story
              </label>
              <textarea
                rows={5}
                placeholder="Write your story here"
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Upload Image
              </label>
              <div className="flex items-center justify-between border rounded-md px-3 py-2 text-sm bg-background">
                <span className="text-muted-foreground">Choose file</span>
                <button className="inline-flex items-center gap-2 bg-secondary px-3 py-1 rounded text-xs font-medium">
                  Choose file <Upload className="h-3 w-3" />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              All submissions will be reviewed before publication.
            </p>
            <button className="bg-highlight text-highlight-foreground font-bold px-6 py-2.5 rounded-md text-sm">
              Submit Story
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
