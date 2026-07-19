import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
});

const runsPerWeek = Array.from({ length: 12 }, (_, i) => ({ week: `W${i + 1}`, runs: 4 + Math.round(Math.random() * 18) }));
const costTrend = Array.from({ length: 12 }, (_, i) => ({ week: `W${i + 1}`, cost: 1 + Math.random() * 4 }));
const diseaseSplit = [
  { name: "COVID", value: 46 },
  { name: "Influenza", value: 38 },
  { name: "Dengue", value: 22 },
  { name: "Ebola", value: 12 },
  { name: "Custom", value: 10 },
];
const colors = ["#4F46E5", "#3B82F6", "#10B981", "#F59E0B", "#EC4899"];

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Aggregate insights across your experiments.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Runs per week">
          <BarChart data={runsPerWeek}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="week" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Bar dataKey="runs" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Avg cost per run ($)">
          <LineChart data={costTrend}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="week" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Line type="monotone" dataKey="cost" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Experiments by disease">
          <PieChart>
            <Pie data={diseaseSplit} dataKey="value" innerRadius={60} outerRadius={100}>
              {diseaseSplit.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
            <Legend />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
          </PieChart>
        </ChartCard>
        <ChartCard title="Agent token usage (k)">
          <BarChart data={[
            { name: "Sim", v: 12 }, { name: "Discovery", v: 8 }, { name: "Network", v: 5 },
            { name: "Lit", v: 4 }, { name: "Data", v: 2 }, { name: "Model", v: 3 },
          ]}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Bar dataKey="v" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </div>
  );
}
