export type PhaseId =
  | "discovery"
  | "modeling"
  | "simulation"
  | "analysis"
  | "report";

export const PHASES: {
  id: PhaseId;
  label: string;
  colorVar: string;
  description: string;
}[] = [
  { id: "discovery", label: "Discovery", colorVar: "var(--phase-discovery)", description: "Literature review & hypothesis framing" },
  { id: "modeling", label: "Modeling", colorVar: "var(--phase-modeling)", description: "Network & compartmental model design" },
  { id: "simulation", label: "Simulation", colorVar: "var(--phase-simulation)", description: "Stochastic runs & realizations" },
  { id: "analysis", label: "Analysis", colorVar: "var(--phase-analysis)", description: "Statistical analysis & sensitivity" },
  { id: "report", label: "Report Writing", colorVar: "var(--phase-report)", description: "Manuscript synthesis" },
];

export const phaseColor = (p: PhaseId) => `var(--phase-${p})`;
