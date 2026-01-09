"use client"

import { useHeadquartersStore } from "@/lib/queries/headquarters"
import { useRequestsStore } from "@/lib/queries/requests"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Request } from "@/lib/types"
import { useQueryClient } from "@tanstack/react-query"
import { useUpdateRequestStatus } from "@/lib/mutations/requests"

import { useAuth } from "@/lib/auth-context"

export default function AdminRequestsPage() {
  const { data: headquarters } = useHeadquartersStore()
  const { data: requests } = useRequestsStore()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const [filter, setFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  const filteredRequests = filter === "all" ? requests : requests.filter((r) => r.status === filter)

  const updateMutation = useUpdateRequestStatus()

  const getStatusBadge = (status: Request["status"]) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      in_review: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      approved: "bg-green-100 text-green-800 hover:bg-green-200",
      rejected: "bg-red-100 text-red-800 hover:bg-red-200",
    }
    return styles[status]
  }

  if (!headquarters) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Requests</h2>
          <p className="text-muted-foreground">Manage and review all submitted requests</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
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
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{request.procedureName}</CardTitle>
                    <CardDescription>
                      Applicant: {request.applicantName}
                      <span className="mx-2">•</span>
                      {new Date(request.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusBadge(request.status)}>
                    {request.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                    View Details
                  </Button>
                  {request.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                       onClick={() => {
                            if (user) {
                                updateMutation.mutate({ id: request.id, status: "in_review", headquartersId: headquarters.id, userId: user.id })
                            }
                        }}
                    >
                      Mark as In Review
                    </Button>
                  )}
                  {(request.status === "pending" || request.status === "in_review") && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (user) {
                                updateMutation.mutate({ id: request.id, status: "approved", headquartersId: headquarters.id, userId: user.id })
                            }
                        }}
                        className="text-green-700 hover:text-green-800"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                         onClick={() => {
                            if (user) {
                                updateMutation.mutate({ id: request.id, status: "rejected", headquartersId: headquarters.id, userId: user.id })
                            }
                        }}
                        className="text-red-700 hover:text-red-800"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRequest?.procedureName}</DialogTitle>
            <DialogDescription>Request #{selectedRequest?.id} Details</DialogDescription>
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
                    <Badge className={getStatusBadge(selectedRequest.status)}>
                      {selectedRequest.status.replace("_", " ")}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="font-medium">Submission Date:</span>
                  <p className="text-muted-foreground">
                    {new Date(selectedRequest.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <p className="text-muted-foreground">
                    {new Date(selectedRequest.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Form Data</h4>
                <div className="space-y-3">
                  {Object.entries(selectedRequest.data).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <span className="col-span-2">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {(selectedRequest.status === "pending" || selectedRequest.status === "in_review") && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                        if (headquarters && user) {
                            updateMutation.mutate({ id: selectedRequest.id, status: "approved", headquartersId: headquarters.id, userId: user.id })
                        }
                    }}
                    className="flex-1"
                  >
                    Approve Request
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                        if (headquarters && user) {
                            updateMutation.mutate({ id: selectedRequest.id, status: "rejected", headquartersId: headquarters.id, userId: user.id })
                        }
                    }}
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
    </div>
  )
}
