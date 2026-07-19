import { useMemo } from "react";
import ReactFlow, {
  Background,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { PHASES, type PhaseId } from "@/lib/phases";
import type { PhaseState } from "@/lib/mock-pipeline";
import { cn } from "@/lib/utils";

function PhaseNode({ data }: NodeProps<{ label: string; state: PhaseState; color: string; index: number }>) {
  const s = data.state;
  const isActive = s.status === "running";
  const isReview = s.status === "awaiting_review";
  const isDone = s.status === "done";
  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card px-4 py-3 min-w-[170px] shadow-sm transition",
        isActive && "ring-2",
      )}
      style={{
        borderColor: isDone || isActive || isReview ? data.color : undefined,
        boxShadow: isActive ? `0 0 0 4px color-mix(in oklab, ${data.color} 20%, transparent)` : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="tabular-nums">{String(data.index + 1).padStart(2, "0")}</span>
        <span
          className={cn("h-1.5 w-1.5 rounded-full", isActive && "phase-pulse")}
          style={{ backgroundColor: data.color }}
        />
        <span>{statusLabel(s.status)}</span>
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground">{data.label}</div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
        <span>{s.tokens.toLocaleString()} tok</span>
        <span>{formatElapsed(s)}</span>
      </div>
    </div>
  );
}

const nodeTypes = { phase: PhaseNode };

function statusLabel(s: PhaseState["status"]) {
  switch (s) {
    case "pending": return "Pending";
    case "running": return "Running";
    case "awaiting_review": return "Review";
    case "done": return "Done";
    case "error": return "Error";
  }
}
function formatElapsed(s: PhaseState) {
  if (!s.startedAt) return "—";
  const end = s.endedAt ?? Date.now();
  const sec = Math.max(0, Math.round((end - s.startedAt) / 1000));
  return `${sec}s`;
}

export function PhaseStepper({ phases }: { phases: Record<PhaseId, PhaseState> }) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = PHASES.map((p, i) => ({
      id: p.id,
      type: "phase",
      position: { x: i * 220, y: 0 },
      data: { label: p.label, state: phases[p.id], color: `var(--phase-${p.id})`, index: i },
      draggable: false,
      selectable: false,
    }));
    const edges: Edge[] = PHASES.slice(0, -1).map((p, i) => ({
      id: `${p.id}->${PHASES[i + 1].id}`,
      source: p.id,
      target: PHASES[i + 1].id,
      type: "smoothstep",
      animated: phases[p.id].status === "done" && phases[PHASES[i + 1].id].status === "running",
      style: { stroke: "var(--border)", strokeWidth: 2 },
    }));
    return { nodes, edges };
  }, [phases]);

  return (
    <div className="h-[150px] w-full rounded-xl border bg-card/40">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
      >
        <Background gap={20} size={1} color="var(--border)" />
      </ReactFlow>
    </div>
  );
}
