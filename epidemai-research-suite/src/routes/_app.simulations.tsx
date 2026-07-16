import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { simulationCurves, simulationStats } from "@/lib/mock-data";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { NetworkView } from "@/components/network-view";

export const Route = createFileRoute("/_app/simulations")({
  component: Simulations,
});

function Simulations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Simulation</h1>
        <p className="text-sm text-muted-foreground mt-1">SEIR — influenza on a small-world campus network.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Peak Infection" value={simulationStats.peakInfection.toLocaleString()} />
        <Stat label="Peak Day" value={`Day ${simulationStats.peakDay}`} />
        <Stat label="Total Infected" value={simulationStats.totalInfected.toLocaleString()} />
        <Stat label="Recovery Rate" value={`${Math.round(simulationStats.recoveryRate * 100)}%`} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="graphs">Graphs</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">All compartments</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationCurves}>
                  <defs>
                    {[
                      { id: "gS", color: "var(--chart-2)" },
                      { id: "gE", color: "var(--chart-4)" },
                      { id: "gI", color: "var(--chart-5)" },
                      { id: "gR", color: "var(--chart-3)" },
                    ].map(g => (
                      <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={g.color} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={g.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="Susceptible" stroke="var(--chart-2)" fill="url(#gS)" />
                  <Area type="monotone" dataKey="Exposed" stroke="var(--chart-4)" fill="url(#gE)" />
                  <Area type="monotone" dataKey="Infected" stroke="var(--chart-5)" fill="url(#gI)" />
                  <Area type="monotone" dataKey="Recovered" stroke="var(--chart-3)" fill="url(#gR)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="graphs">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: "Infected", color: "var(--chart-5)", title: "Infection Curve" },
              { key: "Recovered", color: "var(--chart-3)", title: "Recovered Curve" },
              { key: "Susceptible", color: "var(--chart-2)", title: "Susceptible Curve" },
              { key: "Exposed", color: "var(--chart-4)", title: "Exposed Curve" },
            ].map(c => (
              <div key={c.key} className="glass rounded-2xl p-5">
                <h3 className="font-semibold mb-3">{c.title}</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulationCurves}>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                      <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                      <Line type="monotone" dataKey={c.key} stroke={c.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="network">
          <div className="glass rounded-2xl p-4">
            <NetworkView />
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Simulation Metrics</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              {Object.entries({
                "Basic reproduction R₀": "2.4",
                "Effective R (day 20)": "1.1",
                "Mean incubation": "3.2 days",
                "Mean infectious period": "6.1 days",
                "Attack rate": "78.3%",
                "Vaccination coverage": "42%",
              }).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-4 py-3">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold gradient-text">{value}</p>
    </div>
  );
}
