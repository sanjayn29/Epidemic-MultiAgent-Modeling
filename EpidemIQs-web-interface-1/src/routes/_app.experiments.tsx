import { createFileRoute } from "@tanstack/react-router";
import { experiments } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import { Eye, Download, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/experiments")({
  component: ExperimentsPage,
});

function ExperimentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Experiments</h1>
        <p className="text-sm text-muted-foreground mt-1">History of all research runs.</p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs uppercase tracking-wider bg-white/[0.02]">
              <tr>
                <th className="text-left p-4 font-medium">Experiment</th>
                <th className="text-left p-4 font-medium">Disease</th>
                <th className="text-left p-4 font-medium">Model</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Runtime</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiments.map(e => (
                <tr key={e.id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                  <td className="p-4 font-medium">{e.name}</td>
                  <td className="p-4 text-muted-foreground">{e.disease}</td>
                  <td className="p-4 text-muted-foreground">{e.model}</td>
                  <td className="p-4 text-muted-foreground">{e.date}</td>
                  <td className="p-4 text-muted-foreground">{e.runtime}</td>
                  <td className="p-4"><StatusBadge status={e.status} /></td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn onClick={() => toast.info(`Viewing ${e.id}`)} icon={Eye} />
                      <IconBtn onClick={() => toast.success(`Downloaded ${e.id}`)} icon={Download} />
                      <IconBtn onClick={() => toast.error(`Deleted ${e.id}`)} icon={Trash2} danger />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ icon: Icon, onClick, danger }: { icon: any; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick}
      className={`p-2 rounded-lg hover:bg-white/10 ${danger ? "hover:text-destructive" : ""}`}>
      <Icon className="h-4 w-4" />
    </button>
  );
}
