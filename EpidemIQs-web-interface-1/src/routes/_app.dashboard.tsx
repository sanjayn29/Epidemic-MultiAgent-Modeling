import { createFileRoute, Link } from "@tanstack/react-router";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { activity, experiments, metrics } from "@/lib/mock-data";
import { FlaskConical, Activity, FileText, Bot, DollarSign, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Research Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of experiments, agents and activity.</p>
        </div>
        <Link to="/research" className="gradient-brand text-white rounded-xl px-4 py-2 text-sm font-medium">+ New research</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Total Experiments" value={metrics.totalExperiments} icon={FlaskConical} delta="+8 this week" />
        <MetricCard label="Running" value={metrics.runningExperiments} icon={Activity} accent="warning" />
        <MetricCard label="Completed Reports" value={metrics.completedReports} icon={FileText} accent="success" />
        <MetricCard label="Agents Active" value={metrics.agentsActive} icon={Bot} />
        <MetricCard label="Avg Cost" value={`$${metrics.averageCost}`} icon={DollarSign} />
        <MetricCard label="Avg Runtime" value={metrics.averageRuntime} icon={Clock} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Experiments</h2>
            <Link to="/experiments" className="text-sm text-[color:var(--brand-2)] inline-flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left py-2 font-medium">Name</th>
                  <th className="text-left py-2 font-medium">Disease</th>
                  <th className="text-left py-2 font-medium">Model</th>
                  <th className="text-left py-2 font-medium">Runtime</th>
                  <th className="text-left py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {experiments.slice(0, 5).map(e => (
                  <tr key={e.id} className="border-t border-white/5">
                    <td className="py-3">{e.name}</td>
                    <td className="py-3 text-muted-foreground">{e.disease}</td>
                    <td className="py-3 text-muted-foreground">{e.model}</td>
                    <td className="py-3 text-muted-foreground">{e.runtime}</td>
                    <td className="py-3"><StatusBadge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Activity</h2>
          <ol className="relative space-y-4 pl-4 border-l border-white/10">
            {activity.map((a, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full gradient-brand ring-4 ring-background" />
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </div>
  );
}
