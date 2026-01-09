"use client"

import { useAuth } from "@/lib/auth-context"
import { useQuery } from "@tanstack/react-query"
import { getAdminDashboardData } from "@/lib/db/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { useParams } from "next/navigation"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const params = useParams()
  const headquartersId = params.headquartersId as string

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard', headquartersId, user?.id],
    queryFn: () => {
        if (!user || !headquartersId) return null
        return getAdminDashboardData({ headquartersId }, user.id)
    },
    enabled: !!user && !!headquartersId
  })

  if (isLoading || !data) {
      return (
        <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
  }

  if (error) {
     return <div className="p-4 text-red-500">Error loading dashboard: {(error as Error).message}</div>
  }

  const { headquarters: currentHeadquarters, procedures: headquartersProcedures, requests: headquartersRequests } = data
  
  const pending = headquartersRequests.filter((s) => s.status === "pending").length
  const reviewing = headquartersRequests.filter((s) => s.status === "in_review").length
  const approved = headquartersRequests.filter((s) => s.status === "approved").length
  const rejected = headquartersRequests.filter((s) => s.status === "rejected").length

  const stats = [
    {
      title: "Procedures",
      value: headquartersProcedures.length,
      description: "Available procedures",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Total Requests",
      value: headquartersRequests.length,
      description: "All requests",
      icon: FolderOpen,
      color: "text-gray-600",
    },
    {
      title: "Pending",
      value: pending,
      description: "Waiting for review",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "In Review",
      value: reviewing,
      description: "Being processed",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      title: "Approved",
      value: approved,
      description: "Requests approved",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Rejected",
      value: rejected,
      description: "Requests rejected",
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Summary for {currentHeadquarters?.name || "the headquarters"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Latest submitted requests</CardDescription>
          </CardHeader>
          <CardContent>
            {headquartersRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requests yet</p>
            ) : (
              <div className="space-y-3">
                {headquartersRequests
                  .slice(0, 5)
                  .reverse()
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="text-sm font-medium">{request.procedureName}</p>
                        <p className="text-xs text-muted-foreground">{request.applicantName}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "in_review"
                              ? "bg-orange-100 text-orange-800"
                              : request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Procedures</CardTitle>
            <CardDescription>Procedures available in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {headquartersProcedures.length === 0 ? (
              <p className="text-sm text-muted-foreground">No procedures configured</p>
            ) : (
              <div className="space-y-3">
                {headquartersProcedures.map((procedure) => (
                  <div key={procedure.id} className="flex items-start justify-between border-b pb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{procedure.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{procedure.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{procedure.fields.length} fields</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
