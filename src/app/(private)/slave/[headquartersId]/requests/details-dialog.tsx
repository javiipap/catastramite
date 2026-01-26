'use client'

import { type Request } from "@/lib/types"
import RequestDetailsDialog from "@/components/requests/request-details-dialog"

interface Props {
  selectedRequest: Request | null
  setSelectedRequest: (request: Request | null) => void
}

export default function DetailsDialog({ selectedRequest, setSelectedRequest }: Props) {
  return (
    <RequestDetailsDialog
      request={selectedRequest}
      onClose={() => setSelectedRequest(null)}
    >
      {selectedRequest?.status === "pending" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
          <p className="text-yellow-800">
            Your request is pending review. You will receive an update soon.
          </p>
        </div>
      )}

      {selectedRequest?.status === "in_review" && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
          <p className="text-orange-800">Your request is being reviewed by the administrative team.</p>
        </div>
      )}

      {selectedRequest?.status === "approved" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
          <p className="text-green-800">Your request has been approved successfully.</p>
        </div>
      )}

      {selectedRequest?.status === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
          <p className="text-red-800">
            Your request has been rejected. Contact the administration for more information.
          </p>
        </div>
      )}
    </RequestDetailsDialog>
  )
}
