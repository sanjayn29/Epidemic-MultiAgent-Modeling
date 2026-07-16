import { createFileRoute } from "@tanstack/react-router";
import { workflowStages } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

export const Route = createFileRoute("/_app/workflow")({
  component: WorkflowPage,
});

function WorkflowPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Workflow Monitor</h1>
        <p className="text-sm text-muted-foreground mt-1">Live progress across the research pipeline.</p>
      </div>

      <div className="space-y-4">
        {workflowStages.map((s, i) => {
          const Icon = s.status === "Completed" ? CheckCircle2 : s.status === "Running" ? Loader2 : Circle;
          return (
            <motion.div key={s.name}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl grid place-items-center border ${s.status === "Completed" ? "bg-[color:var(--success)]/10 border-[color:var(--success)]/30 text-[color:var(--success)]" : s.status === "Running" ? "bg-[color:var(--brand-2)]/10 border-[color:var(--brand-2)]/30 text-[color:var(--brand-2)]" : "bg-white/5 border-white/10 text-muted-foreground"}`}>
                  <Icon className={`h-5 w-5 ${s.status === "Running" ? "animate-spin" : ""}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{s.name}</h3>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full gradient-brand"
                      initial={{ width: 0 }}
                      animate={{ width: `${s.progress}%` }}
                      transition={{ duration: 1.2, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              </div>
              {i < workflowStages.length - 1 && <div className="ml-5 mt-2 h-6 w-px bg-white/10" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
