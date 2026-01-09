"use client"

import { useAuth } from "@/lib/auth-context"
import { useQuery } from "@tanstack/react-query"
import { getCitizenDashboardData } from "@/lib/db/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FolderOpen, Bell, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CitizenDashboardPage() {
  const { user } = useAuth()
  const params = useParams()
  const headquartersId = params.headquartersId as string

  const { data, isLoading, error } = useQuery({
    queryKey: ['citizen-dashboard', headquartersId, user?.id],
    queryFn: () => {
        if (!user || !headquartersId) return null
        return getCitizenDashboardData({ headquartersId }, user.id)
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

  const myRequests = headquartersRequests

  const stats = [
    {
      title: "Available Procedures",
      value: headquartersProcedures.length,
      description: "Active services",
      icon: FileText,
      color: "text-blue-600",
      href: `/citizen/${currentHeadquarters?.id}/procedures`,
    },
    {
      title: "My Requests",
      value: myRequests.length,
      description: "Management history",
      icon: FolderOpen,
      color: "text-green-600",
      href: `/citizen/${currentHeadquarters?.id}/requests`,
    },
    {
      title: "Notice Board",
      value: "View",
      description: "Important notices",
      icon: Bell,
      color: "text-yellow-600",
      href: `/citizen/${currentHeadquarters?.id}/notifications`,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h2>
        <p className="text-muted-foreground">Citizen panel of {currentHeadquarters?.name || "the headquarters"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Recent Requests</CardTitle>
              <CardDescription>Status of your latest procedures</CardDescription>
            </div>
            <Link href={`/citizen/${currentHeadquarters?.id}/requests`}>
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {myRequests.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>You have no active requests</p>
                <Link href={`/citizen/${currentHeadquarters?.id}/procedures`}>
                  <Button variant="link" className="mt-2 text-primary">
                    Start a procedure
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests
                  .slice(0, 5)
                  .reverse()
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{request.procedureName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Available Procedures</CardTitle>
              <CardDescription>Featured services</CardDescription>
            </div>
            <Link href={`/citizen/${currentHeadquarters?.id}/procedures`}>
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
             {headquartersProcedures.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                    <p>No procedures available at the moment</p>
                </div>
             ) : (
               <div className="space-y-4">
                 {headquartersProcedures.slice(0, 5).map((procedure) => (
                    <div key={procedure.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                            <p className="font-medium">{procedure.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{procedure.description}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/citizen/${currentHeadquarters?.id}/procedures/${procedure.id}`}>Start</Link>
                        </Button>
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
