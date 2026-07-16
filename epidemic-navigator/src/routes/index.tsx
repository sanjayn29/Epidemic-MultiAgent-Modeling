import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import { AppHeader } from "@/components/epidemiqs/AppHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, Clock, DollarSign } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EpidemIQs — Multi-agent AI for epidemic modeling research" },
      {
        name: "description",
        content:
          "Submit an epidemic research question and watch a multi-agent pipeline discover, model, simulate, analyze, and write a full report.",
      },
      { property: "og:title", content: "EpidemIQs" },
      {
        property: "og:description",
        content: "Autonomous multi-agent AI for epidemic modeling research.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Submit,
});

const EXAMPLES = [
  "What is the effect of degree-heterogeneous networks on SEIR dynamics?",
  "How does household clustering change measles herd-immunity thresholds?",
  "Compare NPIs vs vaccination timing in a 2-strain influenza model.",
  "Estimate super-spreader impact on early outbreak growth in scale-free networks.",
];

function Submit() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"autonomous" | "copilot">("autonomous");

  const estCost = Math.max(0.6, Math.min(3.2, 0.6 + q.length / 220));
  const estMin = Math.max(8, Math.min(35, 8 + Math.round(q.length / 30)));

  const start = () => {
    if (!q.trim()) return;
    const id = nanoid(10);
    navigate({ to: "/run/$runId", params: { runId: id }, search: { q, mode } });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Autonomous epidemic-modeling research
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Ask a research question.
            <br />
            <span className="text-muted-foreground">Get a full study.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            A team of AI agents — scientists, modelers, simulators, analysts and writers — collaborates in
            five phases to produce a rigorous, reproducible manuscript.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <Textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. What is the effect of degree-heterogeneous networks on SEIR dynamics?"
            rows={4}
            className="resize-none border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
            <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5 text-xs">
              {(["autonomous", "copilot"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-md px-3 py-1 capitalize transition",
                    mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" />~${estCost.toFixed(2)}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />~{estMin} min</span>
              <Button size="sm" onClick={start} disabled={!q.trim()}>
                Start research <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
            Example questions
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setQ(ex)}
                className="rounded-full border bg-card px-3 py-1.5 text-left text-xs text-foreground/80 hover:bg-accent"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {mode === "copilot"
            ? "Copilot mode will pause after each phase for your review."
            : "Autonomous mode runs the full 5-phase pipeline without interruption."}
        </p>
      </main>
    </div>
  );
}
