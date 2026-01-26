'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type Request } from '@/lib/types';
import { type ActionType } from '@/app/(private)/master/[headquartersId]/requests/page';
import { useState, useEffect } from "react";
import { useUpdateRequestStatus } from "@/lib/mutations/requests";
import { useHeadquartersStore } from "@/lib/queries/headquarters";
import { useAuth } from "@/lib/auth/context";


interface Props {
  actionRequest: Request | null;
  actionType: ActionType | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ConfirmationDialog({
  actionRequest,
  actionType,
  onClose,
  onSuccess,
}: Props) {
  const { data: headquarters } = useHeadquartersStore();
  const { subject: user } = useAuth();
  const updateMutation = useUpdateRequestStatus();

  const [feedback, setFeedback] = useState("");

  // Reset feedback when the dialog opens for a new request
  useEffect(() => {
    if (actionRequest) {
      setFeedback("");
    }
  }, [actionRequest]);

  const confirmAction = () => {
    if (actionRequest && actionType && headquarters && user) {
      updateMutation.mutate({
        requestId: actionRequest.requestId,
        status: actionType,
        headquartersId: headquarters.headquartersId,
        feedback: feedback || undefined
      }, {
        onSuccess: () => {
          onClose();
          if (onSuccess) onSuccess();
        }
      })
    }
  }

  return (
    <Dialog open={!!actionRequest} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "approved" ? "Approve Request" : "Reject Request"}
          </DialogTitle>
          <DialogDescription>
            {actionType === "approved"
              ? "Are you sure you want to approve this request?"
              : "Are you sure you want to reject this request?"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Feedback (Optional)</Label>
            <Textarea
              placeholder="Add a comment or reason for this decision..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              variant={actionType === "rejected" ? "destructive" : "default"}
              onClick={confirmAction}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Processing..." : (actionType === "approved" ? "Confirm Approval" : "Confirm Rejection")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}