import { useEffect, useRef, useState, useCallback } from "react";
import type { PhaseId } from "./phases";
import { PHASES } from "./phases";

export type AgentKind = "scientist" | "expert" | "tool";

export type NetworkArtifact = {
  kind: "network";
  nodes: { id: string; group: number }[];
  edges: { source: string; target: string }[];
};
export type SeriesArtifact = {
  kind: "series";
  title: string;
  data: { t: number; S: number; I: number; R: number; Iu?: number; Il?: number }[];
};
export type PaperArtifact = {
  kind: "paper";
  title: string;
  authors: string;
  year: number;
  snippet: string;
  doi: string;
};
export type CodeArtifact = { kind: "code"; title: string; language: string; source: string };
export type TableArtifact = {
  kind: "table";
  title: string;
  columns: string[];
  rows: (string | number)[][];
};
export type Artifact =
  | NetworkArtifact
  | SeriesArtifact
  | PaperArtifact
  | CodeArtifact
  | TableArtifact;

export type PipelineEvent = {
  id: string;
  phase: PhaseId;
  agent: string;
  agentKind: AgentKind;
  type: "reasoning" | "tool_call" | "tool_result" | "phase_complete" | "artifact";
  content: string;
  timestamp: string;
  tokens: number;
  toolName?: string;
  toolInput?: string;
  artifact?: Artifact;
};

export type PhaseStatus = "pending" | "running" | "awaiting_review" | "done" | "error";
export type PhaseState = {
  id: PhaseId;
  status: PhaseStatus;
  tokens: number;
  startedAt?: number;
  endedAt?: number;
};

const nowIso = () => new Date().toISOString();
let idc = 0;
const nid = () => `e${++idc}`;

// Scripted per-phase events. Each returns a list; the engine spaces them out.
function scriptFor(phase: PhaseId, question: string): Omit<PipelineEvent, "id" | "timestamp">[] {
  const q = question.slice(0, 80);
  switch (phase) {
    case "discovery":
      return [
        { phase, agent: "Scientist", agentKind: "scientist", type: "reasoning", tokens: 220,
          content: `Framing question: "${q}". Decomposing into (a) network topology assumptions, (b) SEIR parametrization, (c) known empirical baselines.` },
        { phase, agent: "LiteratureExpert", agentKind: "expert", type: "tool_call", tokens: 40,
          toolName: "arxiv.search", toolInput: `heterogeneous networks SEIR`, content: "Querying arXiv for related work." },
        { phase, agent: "LiteratureExpert", agentKind: "expert", type: "tool_result", tokens: 380,
          content: "Retrieved 12 candidate papers; 4 highly relevant.",
          artifact: {
            kind: "paper",
            title: "Epidemic spreading in scale-free networks",
            authors: "Pastor-Satorras & Vespignani",
            year: 2001,
            snippet: "Absence of epidemic threshold in networks with divergent second moment of degree distribution.",
            doi: "10.1103/PhysRevLett.86.3200",
          } },
        { phase, agent: "LiteratureExpert", agentKind: "expert", type: "artifact", tokens: 60, content: "Added Newman (2002) contact network review.",
          artifact: {
            kind: "paper",
            title: "Spread of epidemic disease on networks",
            authors: "M. E. J. Newman",
            year: 2002,
            snippet: "Percolation-based derivation of epidemic thresholds on configuration model networks.",
            doi: "10.1103/PhysRevE.66.016128",
          } },
        { phase, agent: "Scientist", agentKind: "scientist", type: "reasoning", tokens: 180,
          content: "Hypothesis: increasing degree heterogeneity (power-law γ→2) lowers effective threshold and accelerates early growth." },
        { phase, agent: "Scientist", agentKind: "scientist", type: "phase_complete", tokens: 20, content: "Discovery complete." },
      ];
    case "modeling":
      return [
        { phase, agent: "NetworkScientist", agentKind: "scientist", type: "reasoning", tokens: 260,
          content: "Constructing configuration-model networks: N=2000, ⟨k⟩=6, comparing Poisson vs power-law (γ=2.3)." },
        { phase, agent: "NetworkScientist", agentKind: "expert", type: "tool_call", tokens: 30,
          toolName: "networkx.generate", toolInput: "configuration_model(pk, n=2000)", content: "Generating contact network." },
        { phase, agent: "NetworkScientist", agentKind: "expert", type: "artifact", tokens: 90, content: "Generated heterogeneous contact network.",
          artifact: makeNetwork(60) },
        { phase, agent: "ModelExpert", agentKind: "expert", type: "reasoning", tokens: 210,
          content: "SEIR params: β=0.18, σ=1/3, γ=1/7. Seed 5 infectious nodes chosen by degree." },
        { phase, agent: "CodeExpert", agentKind: "expert", type: "artifact", tokens: 140, content: "Emitting simulation script.",
          artifact: {
            kind: "code",
            title: "seir_network.py",
            language: "python",
            source: `import networkx as nx, numpy as np
from collections import defaultdict

def seir(G, beta=0.18, sigma=1/3, gamma=1/7, T=120, seeds=5):
    state = {n: "S" for n in G.nodes}
    for n in np.random.choice(list(G.nodes), seeds, replace=False):
        state[n] = "I"
    hist = defaultdict(list)
    for t in range(T):
        new = dict(state)
        for n, s in state.items():
            if s == "I":
                for m in G.neighbors(n):
                    if state[m] == "S" and np.random.random() < beta:
                        new[m] = "E"
                if np.random.random() < gamma: new[n] = "R"
            elif s == "E" and np.random.random() < sigma:
                new[n] = "I"
        state = new
        for c in "SEIR": hist[c].append(sum(1 for v in state.values() if v == c))
    return hist
` } },
        { phase, agent: "Scientist", agentKind: "scientist", type: "phase_complete", tokens: 20, content: "Modeling complete." },
      ];
    case "simulation":
      return [
        { phase, agent: "SimulationExpert", agentKind: "expert", type: "tool_call", tokens: 40,
          toolName: "runner.batch", toolInput: "realizations=50", content: "Running 50 stochastic realizations." },
        { phase, agent: "SimulationExpert", agentKind: "expert", type: "reasoning", tokens: 90, content: "Realization 12/50 — peak I ≈ 780 at t=34." },
        { phase, agent: "SimulationExpert", agentKind: "expert", type: "reasoning", tokens: 90, content: "Realization 34/50 — peak I ≈ 812 at t=31." },
        { phase, agent: "SimulationExpert", agentKind: "expert", type: "tool_result", tokens: 200, content: "Aggregated 50 realizations with 90% envelope.",
          artifact: makeSeries("Heterogeneous network — SEIR trajectories") },
        { phase, agent: "Scientist", agentKind: "scientist", type: "phase_complete", tokens: 20, content: "Simulation complete." },
      ];
    case "analysis":
      return [
        { phase, agent: "StatsExpert", agentKind: "expert", type: "reasoning", tokens: 200,
          content: "Fitting early exponential growth rate; comparing R₀ across topologies." },
        { phase, agent: "StatsExpert", agentKind: "expert", type: "artifact", tokens: 120, content: "Summary table generated.",
          artifact: {
            kind: "table",
            title: "R₀ and peak metrics by topology",
            columns: ["Topology", "R₀ (mean)", "Peak I", "Time to peak", "Final size"],
            rows: [
              ["Poisson ⟨k⟩=6", 1.42, 612, 41, 0.71],
              ["Power-law γ=2.3", 2.18, 803, 31, 0.86],
              ["Power-law γ=3.0", 1.71, 704, 36, 0.79],
            ],
          } },
        { phase, agent: "Scientist", agentKind: "scientist", type: "reasoning", tokens: 180,
          content: "Heterogeneity increases R₀ by ~54% and shifts peak 10 days earlier — consistent with hub-driven amplification." },
        { phase, agent: "Scientist", agentKind: "scientist", type: "phase_complete", tokens: 20, content: "Analysis complete." },
      ];
    case "report":
      return [
        { phase, agent: "WriterAgent", agentKind: "scientist", type: "reasoning", tokens: 320, content: "Drafting Methods, Results, Discussion." },
        { phase, agent: "WriterAgent", agentKind: "expert", type: "tool_call", tokens: 40,
          toolName: "figure.compose", toolInput: "series+table", content: "Composing figures." },
        { phase, agent: "WriterAgent", agentKind: "scientist", type: "reasoning", tokens: 200, content: "Peer-reviewer pass: tightening claims to those supported by 90% CI." },
        { phase, agent: "Scientist", agentKind: "scientist", type: "phase_complete", tokens: 20, content: "Report complete." },
      ];
  }
}

function makeNetwork(n: number): NetworkArtifact {
  const nodes = Array.from({ length: n }, (_, i) => ({ id: `n${i}`, group: i < 5 ? 2 : Math.random() < 0.15 ? 1 : 0 }));
  const edges: { source: string; target: string }[] = [];
  for (let i = 1; i < n; i++) {
    // preferential attachment sketch
    const target = Math.floor(Math.random() * i);
    edges.push({ source: `n${i}`, target: `n${target}` });
    if (Math.random() < 0.3) {
      const t2 = Math.floor(Math.random() * i);
      if (t2 !== target) edges.push({ source: `n${i}`, target: `n${t2}` });
    }
  }
  return { kind: "network", nodes, edges };
}

function makeSeries(title: string): SeriesArtifact {
  const data = [];
  let S = 1995, E = 0, I = 5, R = 0;
  const beta = 0.32, sigma = 1 / 3, gamma = 1 / 7, N = 2000;
  for (let t = 0; t <= 120; t++) {
    const dS = -beta * S * I / N;
    const dE = beta * S * I / N - sigma * E;
    const dI = sigma * E - gamma * I;
    const dR = gamma * I;
    S += dS; E += dE; I += dI; R += dR;
    const jitter = I * 0.12;
    data.push({
      t,
      S: Math.max(0, Math.round(S)),
      I: Math.max(0, Math.round(I)),
      R: Math.max(0, Math.round(R)),
      Iu: Math.max(0, Math.round(I + jitter)),
      Il: Math.max(0, Math.round(I - jitter)),
    });
  }
  return { kind: "series", title, data };
}

export type RunMode = "autonomous" | "copilot";

export type RunState = {
  status: "idle" | "running" | "paused" | "done" | "error";
  events: PipelineEvent[];
  phases: Record<PhaseId, PhaseState>;
  artifacts: Artifact[];
  totalTokens: number;
  cost: number;
  elapsedMs: number;
};

const initialPhases = (): Record<PhaseId, PhaseState> =>
  Object.fromEntries(PHASES.map((p) => [p.id, { id: p.id, status: "pending" as const, tokens: 0 }])) as Record<PhaseId, PhaseState>;

export function useMockPipeline(runId: string, question: string, mode: RunMode) {
  const [state, setState] = useState<RunState>({
    status: "idle",
    events: [],
    phases: initialPhases(),
    artifacts: [],
    totalTokens: 0,
    cost: 0,
    elapsedMs: 0,
  });
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const resumeRef = useRef<null | (() => void)>(null);
  const cancelRef = useRef(false);
  const startedRef = useRef<number>(0);

  useEffect(() => {
    cancelRef.current = false;
    startedRef.current = Date.now();
    const tick = setInterval(() => {
      setState((s) => (s.status === "done" || s.status === "error" ? s : { ...s, elapsedMs: Date.now() - startedRef.current }));
    }, 500);

    (async () => {
      setState((s) => ({ ...s, status: "running" }));
      for (const p of PHASES) {
        if (cancelRef.current) return;
        setState((s) => ({
          ...s,
          phases: { ...s.phases, [p.id]: { ...s.phases[p.id], status: "running", startedAt: Date.now() } },
        }));
        const events = scriptFor(p.id, question);
        for (const e of events) {
          if (cancelRef.current) return;
          await sleep(650 + Math.random() * 550);
          const full: PipelineEvent = { ...e, id: nid(), timestamp: nowIso() };
          setState((s) => {
            const artifacts = full.artifact ? [...s.artifacts, full.artifact] : s.artifacts;
            const phases = { ...s.phases, [p.id]: { ...s.phases[p.id], tokens: s.phases[p.id].tokens + full.tokens } };
            return {
              ...s,
              events: [...s.events, full],
              artifacts,
              phases,
              totalTokens: s.totalTokens + full.tokens,
              cost: +(s.cost + full.tokens * 0.000015).toFixed(4),
            };
          });
        }
        // phase end
        if (modeRef.current === "copilot" && p.id !== "report") {
          setState((s) => ({
            ...s,
            status: "paused",
            phases: { ...s.phases, [p.id]: { ...s.phases[p.id], status: "awaiting_review", endedAt: Date.now() } },
          }));
          await new Promise<void>((resolve) => {
            resumeRef.current = resolve;
          });
          resumeRef.current = null;
          setState((s) => ({
            ...s,
            status: "running",
            phases: { ...s.phases, [p.id]: { ...s.phases[p.id], status: "done" } },
          }));
        } else {
          setState((s) => ({
            ...s,
            phases: { ...s.phases, [p.id]: { ...s.phases[p.id], status: "done", endedAt: Date.now() } },
          }));
        }
      }
      setState((s) => ({ ...s, status: "done" }));
    })();

    return () => {
      cancelRef.current = true;
      clearInterval(tick);
      resumeRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  const approve = useCallback((_feedback?: string) => {
    resumeRef.current?.();
  }, []);

  return { state, approve };
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
