# EpidemIQs — Priority Slice Plan

Scope (per your answers): Query Submission entry → Live Pipeline Dashboard + Artifacts Panel. Mocked event stream, no persistence. React Flow for the pipeline diagram, Recharts for plots. Skip Final Report and History for now.

## Routes

- `/` — Query Submission. Rewrite the placeholder `src/routes/index.tsx`.
- `/run/$runId` — Live Pipeline Dashboard + Artifacts side panel.

Navigation: submitting the form generates a client-side runId and navigates to `/run/$runId`, which starts the mock stream.

## Design system

- Extend `src/styles.css` with 5 semantic phase tokens (`--phase-discovery` purple, `--phase-modeling` blue, `--phase-simulation` orange, `--phase-analysis` green, `--phase-report` red) plus agent tokens (`--agent-scientist` blue, `--agent-expert` green), registered in `@theme inline` so `bg-phase-modeling`, `text-agent-scientist`, etc. work. Dark mode variants included.
- Add a dark-mode toggle in the app header (class-based, persisted to localStorage — this is UI state, not run persistence).
- Aesthetic: Notion + Jupyter + lab notebook. Mono for logs/code, sans for UI. Subtle pulse animation on active phase / thinking agents.
- Update `__root.tsx` head to real EpidemIQs title/description/OG tags.

## Mock event engine

`src/lib/mock-pipeline.ts` — a scripted async generator that emits events matching your contract:

```ts
type PipelineEvent = {
  phase: "discovery" | "modeling" | "simulation" | "analysis" | "report";
  agent: string;
  type: "reasoning" | "tool_call" | "tool_result" | "phase_complete" | "artifact";
  content: string;
  timestamp: string;
  tokens: number;
  artifact?: ArtifactPayload; // network graph, series, paper, code snippet, table
};
```

`useMockPipeline(runId, mode)` hook drives it with `setTimeout`/`setInterval`, exposes `{ events, phases, artifacts, status, tokens, cost, elapsed, approve, requestChanges }`. Autonomous mode auto-advances; Copilot mode pauses on `phase_complete` until `approve()` is called.

The event source is abstracted behind a `PipelineSource` interface so swapping in a real WebSocket later is a one-file change.

## Components (`src/components/epidemiqs/`)

- `PhaseStepper.tsx` — React Flow horizontal 5-node graph, colored per phase, animated edges when running, status badges (pending/running/done/error), elapsed + tokens under each node. Clicking a node scrolls its detail panel into view.
- `PhasePanel.tsx` — expandable card per phase; lists active agents (Scientist streaming reasoning; Expert tool calls with input/output summary in collapsibles).
- `ReasoningFeed.tsx` — auto-scrolling transcript, color-coded by agent type, monospace timestamps, filter chips (All / Scientist / Experts / Tool calls).
- `CopilotReviewBar.tsx` — appears after each `phase_complete` in Copilot mode: Approve button + feedback textarea + Request changes.
- `ArtifactsPanel.tsx` — right side panel, tabs: Network Graph, Simulation Plots, Literature, Code, Data Tables.
  - Network Graph: React Flow force-ish layout of the generated contact network (nodes/edges from mock artifact).
  - Simulation Plots: Recharts LineChart with S/I/R curves, uncertainty bands via `Area`, multiple realizations toggle.
  - Literature: list cards (title, authors, relevance snippet, mock DOI link).
  - Code: syntax-highlighted Python via `react-syntax-highlighter` (Prism, one-dark theme).
  - Data Tables: shadcn `Table` with mocked numerical outputs.
- `RunHeader.tsx` — question, mode badge, live totals (elapsed, tokens, running cost), Pause/Resume, Cancel.
- `CostEstimate.tsx` (on submission page) — shows "~$1.57, ~20 min" derived from question length heuristic.

## Query Submission page

- Big textarea, mode Segmented control (Autonomous / Copilot), 4 example question chips that pre-fill, cost/time estimate card, "Start Research" button.
- On submit: `navigate({ to: "/run/$runId", params: { runId: nanoid() }, search: { q, mode } })`.

## Dependencies to add

`reactflow`, `recharts`, `react-syntax-highlighter` (+ `@types/react-syntax-highlighter`), `nanoid`. shadcn primitives already available.

## Layout (dashboard)

```text
┌─ Header: EpidemIQs · question · mode · totals · pause ──────────────┐
├─ PhaseStepper (React Flow, full width) ─────────────────────────────┤
├──────────────── main ─────────────────┬──── ArtifactsPanel ─────────┤
│ Active PhasePanel (agents + streams)  │ Tabs: Graph/Plots/Lit/Code  │
│ ReasoningFeed (scrolling transcript)  │ Content updates live        │
│ CopilotReviewBar (when paused)        │                             │
└───────────────────────────────────────┴─────────────────────────────┘
```

Desktop-first split; on mobile the artifacts panel collapses into a bottom sheet.

## Out of scope this pass

Final Report view, History page, real backend, auth, saved runs. The mock engine and `PipelineSource` interface are designed so those slot in later without refactoring components.
