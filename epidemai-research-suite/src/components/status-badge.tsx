import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Running: "bg-[color:var(--brand-2)]/15 text-[color:var(--brand-2)] border-[color:var(--brand-2)]/30",
    Completed: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30",
    Waiting: "bg-white/5 text-muted-foreground border-white/10",
    Idle: "bg-white/5 text-muted-foreground border-white/10",
    Failed: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
      map[status] ?? map.Idle
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full",
        status === "Running" && "bg-[color:var(--brand-2)] animate-pulse",
        status === "Completed" && "bg-[color:var(--success)]",
        (status === "Waiting" || status === "Idle") && "bg-muted-foreground",
        status === "Failed" && "bg-destructive",
      )} />
      {status}
    </span>
  );
}
