'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Request } from "@/lib/types"
import { MessageSquare } from "lucide-react"
import { getStatusBadge, stringifyDate } from "@/lib/utils"
import { STATUS_LABELS } from '@/lib/constants/requests'

interface Props {
  request: Request
  setSelectedRequest: (request: Request | null) => void
}

export default function RequestCard({ request, setSelectedRequest }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{request.procedureName}</CardTitle>
            <CardDescription>
              Request #{request.requestId}
              <span className="mx-2">•</span>
              {stringifyDate(request.createdAt)}
            </CardDescription>
          </div>
          <Badge className={getStatusBadge(request.status)}>
            {STATUS_LABELS[request.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
          View Details
        </Button>
        {request.feedback && (
          <div className="flex items-center gap-1.5 text-sm text-amber-600 font-medium">
            <MessageSquare className="h-4 w-4" />
            Feedback available
          </div>
        )}
      </CardContent>
      {request.feedback && (
        <CardContent className="pt-0 border-t border-b bg-muted/50 py-3">
          <p className="text-sm text-muted-foreground italic line-clamp-2">
            &quot;{request.feedback}&quot;
          </p>
        </CardContent>
      )}
    </Card>
  )
}
