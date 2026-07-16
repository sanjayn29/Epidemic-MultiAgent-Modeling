export const metrics = {
  totalExperiments: 128,
  runningExperiments: 6,
  completedReports: 94,
  agentsActive: 13,
  averageCost: 2.47,
  averageRuntime: "12m 34s",
};

export const experiments = [
  { id: "exp_001", name: "Vaccination impact on campus flu", disease: "Influenza", model: "SEIR", date: "2026-07-14", runtime: "14m 22s", status: "Completed" },
  { id: "exp_002", name: "COVID variant spread — dense city", disease: "COVID", model: "SEIR", date: "2026-07-15", runtime: "22m 08s", status: "Running" },
  { id: "exp_003", name: "Dengue mosquito network dynamics", disease: "Dengue", model: "SIR", date: "2026-07-13", runtime: "09m 41s", status: "Completed" },
  { id: "exp_004", name: "Ebola quarantine efficacy", disease: "Ebola", model: "SEIR", date: "2026-07-12", runtime: "18m 55s", status: "Completed" },
  { id: "exp_005", name: "Small-world contact network flu", disease: "Influenza", model: "SIS", date: "2026-07-16", runtime: "06m 12s", status: "Running" },
  { id: "exp_006", name: "COVID booster policy comparison", disease: "COVID", model: "SEIR", date: "2026-07-10", runtime: "31m 03s", status: "Failed" },
];

export const activity = [
  { time: "2m ago", text: "Simulation Scientist completed run for exp_002", type: "run" },
  { time: "14m ago", text: "Report Writer generated PDF for exp_001", type: "report" },
  { time: "1h ago", text: "Discovery Scientist proposed 3 hypotheses for exp_005", type: "discovery" },
  { time: "3h ago", text: "Literature Retriever indexed 42 new papers", type: "retrieve" },
  { time: "6h ago", text: "Model Scientist selected SEIR for exp_003", type: "model" },
];

export type Agent = {
  name: string;
  role: string;
  group: "Scientist" | "Expert";
  status: "Idle" | "Running" | "Completed" | "Waiting";
  currentTask: string;
  executionTime: string;
  tokens: number;
  cost: number;
};

export const agents: Agent[] = [
  { name: "Discovery Scientist", role: "Hypothesis generation", group: "Scientist", status: "Running", currentTask: "Framing vaccination hypotheses", executionTime: "2m 14s", tokens: 8420, cost: 0.34 },
  { name: "Model Scientist", role: "Model selection", group: "Scientist", status: "Completed", currentTask: "Selected SEIR", executionTime: "48s", tokens: 3120, cost: 0.12 },
  { name: "Network Scientist", role: "Contact network design", group: "Scientist", status: "Running", currentTask: "Building small-world graph", executionTime: "1m 40s", tokens: 5230, cost: 0.21 },
  { name: "Parameter Scientist", role: "Parameter calibration", group: "Scientist", status: "Waiting", currentTask: "Awaiting model output", executionTime: "—", tokens: 0, cost: 0 },
  { name: "Simulation Scientist", role: "Runs simulations", group: "Scientist", status: "Running", currentTask: "Simulating 60 days, N=10k", executionTime: "4m 02s", tokens: 12040, cost: 0.55 },
  { name: "Data Scientist", role: "Post-simulation analysis", group: "Scientist", status: "Idle", currentTask: "Idle", executionTime: "—", tokens: 0, cost: 0 },
  { name: "Online Retriever", role: "Web search", group: "Expert", status: "Completed", currentTask: "Fetched 18 sources", executionTime: "22s", tokens: 1420, cost: 0.06 },
  { name: "Literature Retriever", role: "Academic search", group: "Expert", status: "Running", currentTask: "Querying Semantic Scholar", executionTime: "1m 08s", tokens: 3860, cost: 0.15 },
  { name: "Math Expert", role: "Symbolic math", group: "Expert", status: "Idle", currentTask: "Idle", executionTime: "—", tokens: 0, cost: 0 },
  { name: "Vision Expert", role: "Chart interpretation", group: "Expert", status: "Idle", currentTask: "Idle", executionTime: "—", tokens: 0, cost: 0 },
  { name: "Data Expert", role: "Dataset wrangling", group: "Expert", status: "Running", currentTask: "Cleaning contact traces", executionTime: "56s", tokens: 2210, cost: 0.09 },
  { name: "Report Writer", role: "Narrative drafting", group: "Expert", status: "Waiting", currentTask: "Awaiting analysis", executionTime: "—", tokens: 0, cost: 0 },
  { name: "LaTeX Expert", role: "PDF typesetting", group: "Expert", status: "Idle", currentTask: "Idle", executionTime: "—", tokens: 0, cost: 0 },
];

export const workflowStages = [
  { name: "Discovery", status: "Completed", progress: 100, description: "Hypothesis and question framing" },
  { name: "Modeling", status: "Completed", progress: 100, description: "Model selection and formulation" },
  { name: "Simulation", status: "Running", progress: 62, description: "Executing epidemic simulation" },
  { name: "Analysis", status: "Waiting", progress: 0, description: "Statistical analysis of outputs" },
  { name: "Report Generation", status: "Waiting", progress: 0, description: "Composing final research report" },
] as const;

// Simulation curves — SEIR-ish
export const simulationCurves = Array.from({ length: 60 }, (_, day) => {
  const S = Math.max(0, 10000 * Math.exp(-0.09 * day));
  const E = 3000 * Math.exp(-Math.pow((day - 14) / 6, 2));
  const I = 4200 * Math.exp(-Math.pow((day - 20) / 7, 2));
  const R = 10000 - S - E - I > 0 ? 10000 - S - E - I : 0;
  return {
    day,
    Susceptible: Math.round(S),
    Exposed: Math.round(E),
    Infected: Math.round(I),
    Recovered: Math.round(R),
  };
});

export const simulationStats = {
  peakInfection: 4200,
  peakDay: 20,
  totalInfected: 7830,
  recoveryRate: 0.94,
};

export const networkStats = {
  nodes: 240,
  edges: 612,
  averageDegree: 5.1,
  density: 0.021,
  communities: 6,
};
