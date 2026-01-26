'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Request } from "@/lib/types"
import { REQUEST_STATUS_BADGES, REQUEST_STATUS_LABELS } from '@/lib/constants/requests'
import { stringifyDate } from '@/lib/utils'

interface Props {
  selectedRequest: Request | null
  setSelectedRequest: (request: Request | null) => void
}

export default function DetailsDialog({ selectedRequest, setSelectedRequest }: Props) {
  return (
    <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedRequest?.procedureName}</DialogTitle>
          <DialogDescription>Details of your request #{selectedRequest?.requestId}</DialogDescription>
        </DialogHeader>
        {selectedRequest && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>
                <p className="mt-1">
                  <Badge className={REQUEST_STATUS_BADGES[selectedRequest.status]}>
                    {REQUEST_STATUS_LABELS[selectedRequest.status]}
                  </Badge>
                </p>
              </div>
              <div>
                <span className="font-medium">Date Submitted:</span>
                <p className="text-muted-foreground mt-1">
                  {stringifyDate(selectedRequest.createdAt)}
                </p>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <p className="text-muted-foreground mt-1">
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

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Submitted Information</h4>
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
                          className="text-primary underline hover:text-primary/80"
                        >
                          {item.fieldValue as string}
                        </a>
                      ) : (
                        item.fieldValue as string
                      )}
                    </span>
                  </div>
                ))
                }
              </div>
            </div>

            {selectedRequest.status === "pending" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                <p className="text-yellow-800">
                  Your request is pending review. You will receive an update soon.
                </p>
              </div>
            )}

            {selectedRequest.status === "in_review" && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                <p className="text-orange-800">Your request is being reviewed by the administrative team.</p>
              </div>
            )}

            {selectedRequest.status === "approved" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                <p className="text-green-800">Your request has been approved successfully.</p>
              </div>
            )}

            {selectedRequest.status === "rejected" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                <p className="text-red-800">
                  Your request has been rejected. Contact the administration for more information.
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
