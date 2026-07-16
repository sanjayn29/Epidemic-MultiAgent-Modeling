import { createFileRoute } from "@tanstack/react-router";
import { agents } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { motion } from "framer-motion";
import { Bot, Microscope, Clock, Coins, DollarSign } from "lucide-react";

export const Route = createFileRoute("/_app/agents")({
  component: AgentsPage,
});

function AgentsPage() {
  const scientists = agents.filter(a => a.group === "Scientist");
  const experts = agents.filter(a => a.group === "Expert");
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">AI Agents</h1>
        <p className="text-sm text-muted-foreground mt-1">Specialised agents collaborating on your research.</p>
      </div>
      <Group title="Scientist Agents" agents={scientists} icon={Microscope} />
      <Group title="Expert Agents" agents={experts} icon={Bot} />
    </div>
  );
}

function Group({ title, agents, icon: Icon }: { title: string; agents: typeof import("@/lib/mock-data").agents; icon: any }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-[color:var(--brand-2)]" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a, i) => (
          <motion.div key={a.name}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{a.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{a.role}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <p className="mt-4 text-sm truncate">{a.currentTask}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <Stat icon={Clock} label="Time" value={a.executionTime} />
              <Stat icon={Coins} label="Tokens" value={a.tokens.toLocaleString()} />
              <Stat icon={DollarSign} label="Cost" value={`$${a.cost.toFixed(2)}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/5 p-2.5">
      <div className="flex items-center gap-1 text-muted-foreground"><Icon className="h-3 w-3" /> <span className="uppercase tracking-wider text-[10px]">{label}</span></div>
      <div className="mt-1 font-medium truncate">{value}</div>
    </div>
  );
}
