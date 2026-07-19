import { PHASES, type PhaseId } from "@/lib/phases";
import type { PipelineEvent, PhaseState } from "@/lib/mock-pipeline";
import { cn } from "@/lib/utils";

export function PhasePanel({
  phases,
  events,
  activePhase,
}: {
  phases: Record<PhaseId, PhaseState>;
  events: PipelineEvent[];
  activePhase: PhaseId;
}) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex flex-wrap gap-1 border-b px-2 py-2">
        {PHASES.map((p) => {
          const s = phases[p.id];
          const isActive = p.id === activePhase;
          return (
            <div
              key={p.id}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium",
                isActive ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn("h-2 w-2 rounded-full", s.status === "running" && "phase-pulse")}
                style={{ backgroundColor: `var(--phase-${p.id})` }}
              />
              {p.label}
            </div>
          );
        })}
      </div>
      <div className="p-4">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Active phase
        </div>
        <div className="mt-1 flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: `var(--phase-${activePhase})` }}
          />
          <div className="text-lg font-semibold">{PHASES.find((p) => p.id === activePhase)?.label}</div>
          <div className="text-sm text-muted-foreground">
            {PHASES.find((p) => p.id === activePhase)?.description}
          </div>
        </div>
        <AgentGrid events={events.filter((e) => e.phase === activePhase)} />
      </div>
    </div>
  );
}

function AgentGrid({ events }: { events: PipelineEvent[] }) {
  const byAgent = new Map<string, PipelineEvent[]>();
  for (const e of events) {
    if (!byAgent.has(e.agent)) byAgent.set(e.agent, []);
    byAgent.get(e.agent)!.push(e);
  }
  if (byAgent.size === 0) {
    return <div className="mt-4 text-sm text-muted-foreground italic">Booting agents…</div>;
  }
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from(byAgent.entries()).map(([agent, evs]) => {
        const last = evs[evs.length - 1];
        const kind = last.agentKind;
        const color =
          kind === "scientist" ? "var(--agent-scientist)" : kind === "expert" ? "var(--agent-expert)" : "var(--agent-tool)";
        return (
          <div key={agent} className="rounded-lg border bg-background/40 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full phase-pulse"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium">{agent}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {kind}
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground tabular-nums">
                {evs.reduce((a, b) => a + b.tokens, 0).toLocaleString()} tok
              </div>
            </div>
            <div className="mt-2 line-clamp-3 text-xs text-foreground/80">
              {last.toolName && (
                <span className="rounded bg-muted px-1 py-0.5 mr-1 text-[10px]">{last.toolName}</span>
              )}
              {last.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
