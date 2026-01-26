"use client"

import { useRequestsStore } from "@/lib/queries/requests"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import type { Request } from "@/lib/types"
import DetailsDialog from '@/app/(private)/master/[headquartersId]/requests/details-dialog'
import ConfirmationDialog from '@/app/(private)/master/[headquartersId]/requests/confirmation-dialog'
import RequestCard from '@/app/(private)/master/[headquartersId]/requests/request-card'

export const getStatusBadge = (status: Request["status"]) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    in_review: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    approved: "bg-green-100 text-green-800 hover:bg-green-200",
    rejected: "bg-red-100 text-red-800 hover:bg-red-200",
  }
  return styles[status]
}

export type ActionType = "approved" | "rejected";

export default function MasterRequestsPage() {
  const { data: requests } = useRequestsStore()

  const [filter, setFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  // Action dialog state
  const [actionRequest, setActionRequest] = useState<Request | null>(null)
  const [actionType, setActionType] = useState<ActionType | null>(null)

  const filteredRequests = filter === "all" ? requests : requests.filter((r) => r.status === filter)

  const handleActionClick = (request: Request, type: ActionType) => {
    setActionRequest(request)
    setActionType(type)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Requests</h2>
          <p className="text-muted-foreground">Manage and review all submitted requests</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {filter === "all"
                ? "No requests submitted in this headquarters"
                : `No ${filter.replace("_", " ")} requests in this headquarters`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard key={request.requestId}
              setSelectedRequest={setSelectedRequest}
              handleActionClick={handleActionClick}
              request={request} />
          ))}
        </div>
      )}

      <DetailsDialog
        selectedRequest={selectedRequest}
        setSelectedRequest={setSelectedRequest}
        handleActionClick={handleActionClick}
      />

      <ConfirmationDialog
        actionRequest={actionRequest}
        actionType={actionType}
        onClose={() => setActionRequest(null)}
        onSuccess={() => {
          if (selectedRequest?.requestId === actionRequest?.requestId) {
            setSelectedRequest(null)
          }
        }}
      />
    </div>
  )
}
