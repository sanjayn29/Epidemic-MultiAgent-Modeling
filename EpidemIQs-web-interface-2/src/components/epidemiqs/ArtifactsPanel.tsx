import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import ReactFlow, { Background, type Node, type Edge } from "reactflow";
import "reactflow/dist/style.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Artifact, NetworkArtifact, SeriesArtifact, PaperArtifact, CodeArtifact, TableArtifact } from "@/lib/mock-pipeline";

export function ArtifactsPanel({ artifacts }: { artifacts: Artifact[] }) {
  const graphs = artifacts.filter((a): a is NetworkArtifact => a.kind === "network");
  const series = artifacts.filter((a): a is SeriesArtifact => a.kind === "series");
  const papers = artifacts.filter((a): a is PaperArtifact => a.kind === "paper");
  const codes = artifacts.filter((a): a is CodeArtifact => a.kind === "code");
  const tables = artifacts.filter((a): a is TableArtifact => a.kind === "table");

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      <div className="border-b px-4 py-2">
        <div className="text-sm font-semibold">Artifacts</div>
        <div className="text-xs text-muted-foreground">Live outputs from the pipeline</div>
      </div>
      <Tabs defaultValue="plots" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-3 mt-3 grid w-auto grid-cols-5">
          <TabsTrigger value="graph">Graph {graphs.length ? `(${graphs.length})` : ""}</TabsTrigger>
          <TabsTrigger value="plots">Plots {series.length ? `(${series.length})` : ""}</TabsTrigger>
          <TabsTrigger value="lit">Literature {papers.length ? `(${papers.length})` : ""}</TabsTrigger>
          <TabsTrigger value="code">Code {codes.length ? `(${codes.length})` : ""}</TabsTrigger>
          <TabsTrigger value="data">Data {tables.length ? `(${tables.length})` : ""}</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-y-auto p-3">
          <TabsContent value="graph" className="mt-0">
            {graphs.length === 0 ? <Empty label="No network yet" /> : <NetworkView net={graphs[graphs.length - 1]} />}
          </TabsContent>
          <TabsContent value="plots" className="mt-0 space-y-4">
            {series.length === 0 ? <Empty label="No simulation output yet" /> : series.map((s, i) => <SeriesView key={i} s={s} />)}
          </TabsContent>
          <TabsContent value="lit" className="mt-0 space-y-2">
            {papers.length === 0 ? <Empty label="No papers retrieved" /> : papers.map((p, i) => <PaperCard key={i} p={p} />)}
          </TabsContent>
          <TabsContent value="code" className="mt-0 space-y-3">
            {codes.length === 0 ? <Empty label="No code emitted yet" /> : codes.map((c, i) => <CodeBlock key={i} c={c} />)}
          </TabsContent>
          <TabsContent value="data" className="mt-0 space-y-3">
            {tables.length === 0 ? <Empty label="No tables yet" /> : tables.map((t, i) => <TableView key={i} t={t} />)}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground italic">
      {label}
    </div>
  );
}

function NetworkView({ net }: { net: NetworkArtifact }) {
  const { nodes, edges } = useMemo(() => {
    const n = net.nodes.length;
    const nodes: Node[] = net.nodes.map((nd, i) => {
      const angle = (i / n) * Math.PI * 2;
      const r = 220 + (nd.group === 2 ? -60 : nd.group === 1 ? 20 : 0);
      return {
        id: nd.id,
        position: { x: 260 + Math.cos(angle) * r, y: 200 + Math.sin(angle) * r },
        data: { label: "" },
        style: {
          width: nd.group === 2 ? 14 : nd.group === 1 ? 10 : 6,
          height: nd.group === 2 ? 14 : nd.group === 1 ? 10 : 6,
          borderRadius: 999,
          background:
            nd.group === 2 ? "var(--phase-report)" : nd.group === 1 ? "var(--phase-simulation)" : "var(--phase-modeling)",
          border: "none",
          padding: 0,
        },
        draggable: false,
        selectable: false,
      };
    });
    const edges: Edge[] = net.edges.map((e, i) => ({
      id: `e${i}`,
      source: e.source,
      target: e.target,
      style: { stroke: "var(--border)", strokeWidth: 0.6, opacity: 0.6 },
      type: "straight",
    }));
    return { nodes, edges };
  }, [net]);
  return (
    <div className="h-[420px] rounded-lg border bg-background/40">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Background gap={24} size={1} color="var(--border)" />
      </ReactFlow>
      <div className="px-3 py-2 text-xs text-muted-foreground">
        {net.nodes.length} nodes · {net.edges.length} edges · hubs highlighted in red
      </div>
    </div>
  );
}

function SeriesView({ s }: { s: SeriesArtifact }) {
  return (
    <div className="rounded-lg border bg-background/40 p-3">
      <div className="mb-2 text-sm font-medium">{s.title}</div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={s.data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="t" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--popover-foreground)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="Iu" stroke="none" fill="var(--phase-simulation)" fillOpacity={0.15} name="I upper" />
            <Area type="monotone" dataKey="Il" stroke="none" fill="var(--background)" fillOpacity={1} name="I lower" />
            <Line type="monotone" dataKey="S" stroke="var(--phase-modeling)" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="I" stroke="var(--phase-simulation)" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="R" stroke="var(--phase-analysis)" dot={false} strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PaperCard({ p }: { p: PaperArtifact }) {
  return (
    <div className="rounded-lg border bg-background/40 p-3">
      <div className="text-sm font-medium">{p.title}</div>
      <div className="text-xs text-muted-foreground">{p.authors} · {p.year}</div>
      <div className="mt-2 text-xs text-foreground/80">{p.snippet}</div>
      <a
        className="mt-2 inline-block text-xs text-primary hover:underline"
        href={`https://doi.org/${p.doi}`}
        target="_blank"
        rel="noreferrer"
      >
        doi:{p.doi}
      </a>
    </div>
  );
}

function CodeBlock({ c }: { c: CodeArtifact }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b bg-background/40 px-3 py-1.5 text-xs">
        <span className="font-medium">{c.title}</span>
        <span className="text-muted-foreground">{c.language}</span>
      </div>
      <SyntaxHighlighter
        language={c.language}
        style={oneDark}
        customStyle={{ margin: 0, fontSize: 12, background: "oklch(0.16 0.02 260)" }}
      >
        {c.source}
      </SyntaxHighlighter>
    </div>
  );
}

function TableView({ t }: { t: TableArtifact }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background/40">
      <div className="border-b px-3 py-2 text-sm font-medium">{t.title}</div>
      <table className="w-full text-xs">
        <thead className="bg-muted/40">
          <tr>
            {t.columns.map((c) => (
              <th key={c} className="px-3 py-1.5 text-left font-medium text-muted-foreground">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.rows.map((r, i) => (
            <tr key={i} className="border-t">
              {r.map((cell, j) => (
                <td key={j} className="px-3 py-1.5 tabular-nums">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
