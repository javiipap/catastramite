"use client"

import { useRequestsStore } from "@/lib/queries/requests"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Request } from "@/lib/types"
import { FileText } from "lucide-react"

export default function CitizenRequestsPage() {
  const { data: requests } = useRequestsStore()
  const { user } = useAuth()
  const [filter, setFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  // Filter client side for current user
  const myRequests = requests.filter((r) => r.applicantId === user?.id)
  const filteredRequests = filter === "all" ? myRequests : myRequests.filter((r) => r.status === filter)

  const getStatusBadge = (status: Request["status"]) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      in_review: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      approved: "bg-green-100 text-green-800 hover:bg-green-200",
      rejected: "bg-red-100 text-red-800 hover:bg-red-200",
    }
    return styles[status]
  }

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
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{request.procedureName}</CardTitle>
                      <CardDescription>
                        Request #{request.id}
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
                  <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRequest?.procedureName}</DialogTitle>
            <DialogDescription>Details of your request #{selectedRequest?.id}</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="mt-1">
                    <Badge className={getStatusBadge(selectedRequest.status)}>
                      {selectedRequest.status.replace("_", " ")}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="font-medium">Date Submitted:</span>
                  <p className="text-muted-foreground mt-1">
                    {new Date(selectedRequest.createdAt).toLocaleDateString("en-US", {
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
                <h4 className="font-medium mb-3">Submitted Information</h4>
                <div className="space-y-3">
                  {Object.entries(selectedRequest.data).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <span className="col-span-2">{value as string}</span>
                    </div>
                  ))}
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
    </div>
  )
}
