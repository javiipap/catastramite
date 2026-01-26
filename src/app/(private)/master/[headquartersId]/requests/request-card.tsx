'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Request } from '@/lib/types'
import { type ActionType } from '@/app/(private)/master/[headquartersId]/requests/page'
import { useHeadquartersStore } from '@/lib/queries/headquarters'
import { useUpdateRequestStatus } from '@/lib/mutations/requests'
import { STATUS_BADGES, STATUS_LABELS } from '@/lib/constants/requests'

interface Props {
  request: Request;
  setSelectedRequest: (request: Request | null) => void;
  handleActionClick: (request: Request, action: ActionType) => void;
}

export default function RequestCard({ request, setSelectedRequest, handleActionClick }: Props) {
  const { data: headquarters } = useHeadquartersStore();

  const updateMutation = useUpdateRequestStatus()

  const setInReview = () => updateMutation.mutate({
    requestId: request.requestId,
    status: "in_review",
    headquartersId: headquarters.headquartersId
  })

  return (
    <Card key={request.requestId} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:gap-0">
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
          <Badge className={STATUS_BADGES[request.status]}>
            {STATUS_LABELS[request.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
            View Details
          </Button>
          {request.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={setInReview}
            >
              Mark as In Review
            </Button>
          )}
          {(request.status === "pending" || request.status === "in_review") && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleActionClick(request, "approved")}
                className="text-green-700 hover:text-green-800"
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleActionClick(request, "rejected")}
                className="text-red-700 hover:text-red-800"
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}