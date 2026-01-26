"use client"

import { useRequestsStore } from "@/lib/queries/requests"
import { useAuth } from "@/lib/auth/context"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

import type { Request } from "@/lib/types"
import { FileText } from "lucide-react"
import RequestCard from "./request-card"
import DetailsDialog from "./details-dialog"
import { REQUEST_STATUS_LABELS } from '@/lib/constants/requests'

export default function SlaveRequestsPage() {
  const { data: requests } = useRequestsStore()
  const { subject: user } = useAuth()
  const [filter, setFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  // Filter client side for current user
  const myRequests = requests.filter((r) => r.applicantId === user?.userId)
  const filteredRequests = filter === "all" ? myRequests : myRequests.filter((r) => r.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Requests</h2>
          <p className="text-muted-foreground">Check the status of your submitted procedures</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(REQUEST_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {filter === "all" ? "You have not submitted any requests yet" : `You have no ${filter.replace("_", " ")} requests`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests
            .slice()
            .reverse()
            .map((request) => (
              <RequestCard key={request.requestId} request={request} setSelectedRequest={setSelectedRequest} />
            ))}
        </div>
      )}

      <DetailsDialog selectedRequest={selectedRequest} setSelectedRequest={setSelectedRequest} />
    </div>
  )
}
