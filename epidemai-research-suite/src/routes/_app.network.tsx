import { createFileRoute } from "@tanstack/react-router";
import { NetworkView } from "@/components/network-view";

export const Route = createFileRoute("/_app/network")({
  component: NetworkPage,
});

function NetworkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Network Visualization</h1>
        <p className="text-sm text-muted-foreground mt-1">Explore the contact network. Zoom, pan, hover to highlight.</p>
      </div>
      <div className="glass rounded-2xl p-4">
        <NetworkView />
      </div>
    </div>
  );
}
