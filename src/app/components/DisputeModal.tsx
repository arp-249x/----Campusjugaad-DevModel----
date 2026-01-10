import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { AlertTriangle } from "lucide-react";

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  questTitle: string;
}

export function DisputeModal({ isOpen, onClose, onSubmit, questTitle }: DisputeModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) return alert("Please provide a reason.");
    setLoading(true);
    onSubmit(reason);
    setLoading(false);
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[var(--campus-card-bg)] border-[var(--campus-border)] text-[var(--campus-text-primary)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" /> Raise Dispute
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <p className="text-sm text-[var(--campus-text-secondary)]">
            Reporting issues for: <span className="font-bold text-[var(--campus-text-primary)]">{questTitle}</span>
          </p>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-[var(--campus-text-secondary)]">Explain the situation</label>
            <Textarea 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              placeholder="e.g. Hero didn't do the work but is asking for OTP..."
              className="min-h-[100px] bg-[var(--campus-bg)]"
            />
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-600">
            <strong>Note:</strong> Raising a dispute will lock the funds. An admin will review the chat logs and evidence before making a decision.
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}