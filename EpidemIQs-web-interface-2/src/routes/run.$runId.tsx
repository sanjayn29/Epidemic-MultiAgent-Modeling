import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo } from "react";
import { AppHeader } from "@/components/epidemiqs/AppHeader";
import { PhaseStepper } from "@/components/epidemiqs/PhaseStepper";
import { PhasePanel } from "@/components/epidemiqs/PhasePanel";
import { ReasoningFeed } from "@/components/epidemiqs/ReasoningFeed";
import { ArtifactsPanel } from "@/components/epidemiqs/ArtifactsPanel";
import { CopilotReviewBar } from "@/components/epidemiqs/CopilotReviewBar";
import { useMockPipeline } from "@/lib/mock-pipeline";
import { PHASES } from "@/lib/phases";
import { Button } from "@/components/ui/button";
import { Coins, Clock, X } from "lucide-react";

const search = z.object({
  q: z.string().default(""),
  mode: z.enum(["autonomous", "copilot"]).default("autonomous"),
});

export const Route = createFileRoute("/run/$runId")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Run — EpidemIQs" },
      { name: "description", content: "Live multi-agent epidemic research pipeline." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RunView,
});

function RunView() {
  const { runId } = Route.useParams();
  const { q, mode } = Route.useSearch();
  const navigate = useNavigate();
  const { state, approve } = useMockPipeline(runId, q || "epidemic modeling study", mode);

  const activePhase = useMemo(() => {
    const running = PHASES.find((p) => state.phases[p.id].status === "running" || state.phases[p.id].status === "awaiting_review");
    if (running) return running.id;
    const lastDone = [...PHASES].reverse().find((p) => state.phases[p.id].status === "done");
    return lastDone?.id ?? PHASES[0].id;
  }, [state.phases]);

  const elapsedSec = Math.round(state.elapsedMs / 1000);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        right={
          <>
            <span className="hidden md:inline text-xs text-muted-foreground capitalize rounded-full border px-2 py-0.5">
              {mode}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
              <Clock className="h-3 w-3" />
              {String(Math.floor(elapsedSec / 60)).padStart(2, "0")}:{String(elapsedSec % 60).padStart(2, "0")}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
              <Coins className="h-3 w-3" />
              {state.totalTokens.toLocaleString()} tok · ${state.cost.toFixed(3)}
            </span>
            <Button size="sm" variant="ghost" onClick={() => navigate({ to: "/" })}>
              <X className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="border-b bg-card/40 px-5 py-3">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Research question</div>
        <div className="mt-0.5 text-sm">{q || <span className="italic text-muted-foreground">Untitled study</span>}</div>
      </div>

      <div className="p-4">
        <PhaseStepper phases={state.phases} />
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 px-4 pb-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col gap-4">
          <PhasePanel phases={state.phases} events={state.events} activePhase={activePhase} />
          {state.status === "paused" && <CopilotReviewBar onApprove={approve} />}
          <div className="min-h-[320px] flex-1">
            <ReasoningFeed events={state.events} />
          </div>
        </div>
        <div className="min-h-[600px]">
          <ArtifactsPanel artifacts={state.artifacts} />
        </div>
      </div>
    </div>
  );
}
