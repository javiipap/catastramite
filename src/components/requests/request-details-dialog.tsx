'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Request } from "@/lib/types"
import { STATUS_BADGES, STATUS_LABELS } from '@/lib/constants/requests'
import { stringifyDate } from '@/lib/utils'

interface Props {
  request: Request | null
  onClose: () => void
  children?: React.ReactNode
}

export default function RequestDetailsDialog({ request, onClose, children }: Props) {
  return (
    <Dialog open={!!request} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{request?.procedureName}</DialogTitle>
          <DialogDescription>Request #{request?.requestId} Details</DialogDescription>
        </DialogHeader>
        {request && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Applicant:</span>
                <p className="text-muted-foreground">{request.applicantName}</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <p>
                  <Badge className={STATUS_BADGES[request.status]}>
                    {STATUS_LABELS[request.status]}
                  </Badge>
                </p>
              </div>
              <div>
                <span className="font-medium">Submission Date:</span>
                <p className="text-muted-foreground">
                  {stringifyDate(request.createdAt)}
                </p>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <p className="text-muted-foreground">
                  {stringifyDate(request.updatedAt)}
                </p>
              </div>
            </div>

            {request.feedback && (
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-1">Feedback</h4>
                <p className="text-sm italic">{request.feedback}</p>
              </div>
            )}

            <div className="border-t pt-4 overflow-hidden">
              <h4 className="font-medium mb-3">Form Data</h4>
              <div className="space-y-3">
                {request.data.map((item) => (
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

            {children && (
              <div className="pt-4 border-t">
                {children}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
