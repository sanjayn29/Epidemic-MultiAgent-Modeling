import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CopilotReviewBar({ onApprove }: { onApprove: (feedback?: string) => void }) {
  const [feedback, setFeedback] = useState("");
  const [showFb, setShowFb] = useState(false);
  return (
    <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Phase paused for review</div>
          <div className="text-xs text-muted-foreground">
            Copilot mode — approve to continue, or send feedback to refine.
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFb((v) => !v)}>
            Request changes
          </Button>
          <Button size="sm" onClick={() => onApprove()}>Approve & continue</Button>
        </div>
      </div>
      {showFb && (
        <div className="mt-3 space-y-2">
          <Textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Suggest changes for the next phase…"
          />
          <div className="flex justify-end">
            <Button size="sm" variant="secondary" onClick={() => onApprove(feedback)}>
              Send & continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
