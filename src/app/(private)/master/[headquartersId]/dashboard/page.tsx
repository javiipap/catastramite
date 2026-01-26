'use client'

import { FileText, FolderOpen, Clock, CheckCircle2, XCircle, Eye } from "lucide-react"
import { useMasterDashboardStore } from '@/lib/queries/dashboard'
import { StatCard } from "./stat-card"
import { DashboardList } from "./dashboard-list"
import { DashboardListElement } from "./dashboard-list-element"
import { Badge } from '@/components/ui/badge'

export default function MasterDashboardPage() {
  const store = useMasterDashboardStore();
  const { headquarters: currentHeadquarters, procedures: headquartersProcedures, requests: headquartersRequests } = store.data;

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
      color: "text-blue-500",
      bg: "bg-blue-500/5",
      iconBg: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Total Requests",
      value: headquartersRequests.length,
      description: "All requests",
      icon: FolderOpen,
      color: "text-slate-500",
      bg: "bg-slate-500/5",
      iconBg: "bg-slate-500/10",
      borderColor: "border-slate-500/20"
    },
    {
      title: "Pending",
      value: pending,
      description: "Waiting for review",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/5",
      iconBg: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    },
    {
      title: "In Review",
      value: reviewing,
      description: "Being processed",
      icon: Eye,
      color: "text-blue-400",
      bg: "bg-blue-400/5",
      iconBg: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      title: "Approved",
      value: approved,
      description: "Requests approved",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/5",
      iconBg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      title: "Rejected",
      value: rejected,
      description: "Requests rejected",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/5",
      iconBg: "bg-red-500/10",
      borderColor: "border-red-500/20"
    },
  ]

  const recentRequests = headquartersRequests.slice(0, 5).reverse();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardList
          title="Recent Requests"
          description="Latest submitted requests"
          actionLink={{
            href: `/master/${currentHeadquarters?.headquartersId}/requests`,
            label: "View all"
          }}
          isEmpty={recentRequests.length === 0}
          emptyState={{
            icon: FolderOpen,
            text: "No requests yet"
          }}
        >
          {recentRequests.map((request) => (
            <DashboardListElement
              key={request.requestId}
              icon={FileText}
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              title={request.procedureName}
              subtitle={`${request.requestId.slice(0, 7)} • ${request.applicantName}`}
              endContent={
                <>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${request.status === "pending"
                      ? "bg-amber-500/10 text-amber-500"
                      : request.status === "in_review"
                        ? "bg-blue-500/10 text-blue-500"
                        : request.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                  >
                    {request.status === "in_review" ? "In Review" :
                      request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </>
              }
            />
          ))}
        </DashboardList>

        <DashboardList
          title="Active Procedures"
          description="Procedures available in the system"
          actionLink={{
            href: `/master/${currentHeadquarters?.headquartersId}/procedures`,
            label: "Manage"
          }}
          isEmpty={headquartersProcedures.length === 0}
          emptyState={{
            icon: FileText,
            text: "No procedures configured"
          }}
        >
          {headquartersProcedures.map((procedure) => (
            <DashboardListElement
              key={procedure.procedureId}
              icon={FileText}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-500/10"
              title={procedure.name}
              subtitle={
                <span className="line-clamp-1 max-w-[200px]">
                  {procedure.description}
                </span>
              }
              endContent={
                <Badge variant="outline">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {procedure.fields.length} field{procedure.fields.length !== 1 ? 's' : ''}
                  </span>
                </Badge>
              }
            />
          ))}
        </DashboardList>
      </div>
    </div>
  )
}
