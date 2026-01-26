'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Request } from '@/lib/types';
import { ActionType } from '@/app/(private)/master/[headquartersId]/requests/page';
import { REQUEST_STATUS_BADGES, REQUEST_STATUS_LABELS } from '@/lib/constants/requests';
import { stringifyDate } from '@/lib/utils';

interface Props {
  selectedRequest: Request | null;
  setSelectedRequest: (request: Request | null) => void;
  handleActionClick: (request: Request, action: ActionType) => void;
}

export default function DetailsDialog({
  selectedRequest,
  setSelectedRequest,
  handleActionClick,
}: Props) {
  return (
    <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedRequest?.procedureName}</DialogTitle>
          <DialogDescription>Request #{selectedRequest?.requestId} Details</DialogDescription>
        </DialogHeader>
        {selectedRequest && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Applicant:</span>
                <p className="text-muted-foreground">{selectedRequest.applicantName}</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <p>
                  <Badge className={REQUEST_STATUS_BADGES[selectedRequest.status]}>
                    {REQUEST_STATUS_LABELS[selectedRequest.status]}
                  </Badge>
                </p>
              </div>
              <div>
                <span className="font-medium">Submission Date:</span>
                <p className="text-muted-foreground">
                  {stringifyDate(selectedRequest.createdAt)}
                </p>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <p className="text-muted-foreground">
                  {stringifyDate(selectedRequest.updatedAt)}
                </p>
              </div>
            </div>

            {selectedRequest.feedback && (
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-1">Feedback</h4>
                <p className="text-sm italic">{selectedRequest.feedback}</p>
              </div>
            )}

            <div className="border-t pt-4 overflow-hidden">
              <h4 className="font-medium mb-3">Form Data</h4>
              <div className="space-y-3">
                {selectedRequest.data.map((item) => (
                  <div key={item.fieldName} className="grid grid-cols-3 gap-2 text-sm">
                    <span className="font-medium text-muted-foreground">{item.fieldName}:</span>
                    <span className="col-span-2">
                      {item.fieldType === "link" ? (
                        <a
                          href={item.fieldValue as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline overflow-hidden text-ellipsis hover:text-primary/80"
                        >
                          {item.fieldValue as string}
                        </a>
                      ) : (
                        item.fieldValue as string
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {(selectedRequest.status === "pending" || selectedRequest.status === "in_review") && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleActionClick(selectedRequest, "approved")}
                  className="flex-1"
                >
                  Approve Request
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleActionClick(selectedRequest, "rejected")}
                  className="flex-1"
                >
                  Reject Request
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}