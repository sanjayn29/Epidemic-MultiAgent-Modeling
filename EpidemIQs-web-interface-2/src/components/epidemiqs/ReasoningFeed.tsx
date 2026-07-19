import { useEffect, useRef, useState } from "react";
import type { PipelineEvent } from "@/lib/mock-pipeline";
import { cn } from "@/lib/utils";

type Filter = "all" | "scientist" | "expert" | "tool";

export function ReasoningFeed({ events }: { events: PipelineEvent[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [events.length]);

  const visible = events.filter((e) => {
    if (filter === "all") return true;
    if (filter === "tool") return e.type === "tool_call" || e.type === "tool_result";
    return e.agentKind === filter;
  });

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="text-sm font-semibold">Reasoning feed</div>
        <div className="flex gap-1">
          {(["all", "scientist", "expert", "tool"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs capitalize transition",
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 font-mono text-[12.5px] leading-relaxed">
        {visible.length === 0 && (
          <div className="text-muted-foreground italic">Waiting for agents to start reasoning…</div>
        )}
        {visible.map((e) => (
          <FeedLine key={e.id} e={e} />
        ))}
      </div>
    </div>
  );
}

function FeedLine({ e }: { e: PipelineEvent }) {
  const color =
    e.agentKind === "scientist"
      ? "var(--agent-scientist)"
      : e.agentKind === "expert"
        ? "var(--agent-expert)"
        : "var(--agent-tool)";
  const time = new Date(e.timestamp).toLocaleTimeString(undefined, { hour12: false });
  const typeLabel =
    e.type === "tool_call" ? "→ tool" : e.type === "tool_result" ? "← result" : e.type === "phase_complete" ? "✓ phase" : e.type === "artifact" ? "◆ artifact" : "· think";
  return (
    <div className="flex gap-3">
      <span className="shrink-0 text-muted-foreground tabular-nums">{time}</span>
      <span className="shrink-0 font-semibold" style={{ color }}>
        {e.agent}
      </span>
      <span className="shrink-0 text-muted-foreground">{typeLabel}</span>
      <span className="text-foreground/90">
        {e.toolName && <span className="rounded bg-muted px-1 py-0.5 mr-1.5 text-[11px]">{e.toolName}</span>}
        {e.content}
      </span>
    </div>
  );
}
