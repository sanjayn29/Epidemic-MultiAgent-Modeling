import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label, value, icon: Icon, delta, accent = "brand",
}: { label: string; value: string | number; icon: LucideIcon; delta?: string; accent?: "brand" | "success" | "warning" }) {
  const accentClass =
    accent === "success" ? "text-[color:var(--success)]" :
    accent === "warning" ? "text-[color:var(--warning)]" :
    "gradient-text";
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className={`mt-2 text-3xl font-semibold ${accentClass}`}>{value}</p>
          {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
          <Icon className="h-5 w-5 text-[color:var(--brand-2)]" />
        </div>
      </div>
    </motion.div>
  );
}
