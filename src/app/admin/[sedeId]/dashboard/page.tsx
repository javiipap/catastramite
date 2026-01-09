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
  const sedeId = params.sedeId as string

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard', sedeId, user?.id],
    queryFn: () => {
        if (!user || !sedeId) return null
        return getAdminDashboardData({ sedeId }, user.id)
    },
    enabled: !!user && !!sedeId
  })

  if (isLoading || !data) {
      return (
        <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
  }

  if (error) {
     return <div className="p-4 text-red-500">Error cargando dashboard: {(error as Error).message}</div>
  }

  const { sede: currentSede, tramites: sedeTramites, solicitudes: sedeSolicitudes } = data
  
  const pendientes = sedeSolicitudes.filter((s) => s.estado === "pendiente").length
  const enRevision = sedeSolicitudes.filter((s) => s.estado === "en_revision").length
  const aprobadas = sedeSolicitudes.filter((s) => s.estado === "aprobada").length
  const rechazadas = sedeSolicitudes.filter((s) => s.estado === "rechazada").length

  const stats = [
    {
      title: "Tipos de Trámite",
      value: sedeTramites.length,
      description: "Trámites disponibles",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Total Solicitudes",
      value: sedeSolicitudes.length,
      description: "Todas las solicitudes",
      icon: FolderOpen,
      color: "text-gray-600",
    },
    {
      title: "Pendientes",
      value: pendientes,
      description: "Esperando revisión",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "En Revisión",
      value: enRevision,
      description: "Siendo procesadas",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      title: "Aprobadas",
      value: aprobadas,
      description: "Solicitudes aprobadas",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Rechazadas",
      value: rechazadas,
      description: "Solicitudes rechazadas",
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Resumen de {currentSede?.nombre || "la sede"}</p>
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
            <CardTitle>Solicitudes Recientes</CardTitle>
            <CardDescription>Últimas solicitudes presentadas</CardDescription>
          </CardHeader>
          <CardContent>
            {sedeSolicitudes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay solicitudes aún</p>
            ) : (
              <div className="space-y-3">
                {sedeSolicitudes
                  .slice(0, 5)
                  .reverse()
                  .map((solicitud) => (
                    <div key={solicitud.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="text-sm font-medium">{solicitud.tramiteTypeNombre}</p>
                        <p className="text-xs text-muted-foreground">{solicitud.solicitanteNombre}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          solicitud.estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : solicitud.estado === "en_revision"
                              ? "bg-orange-100 text-orange-800"
                              : solicitud.estado === "aprobada"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {solicitud.estado.replace("_", " ")}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Trámite Activos</CardTitle>
            <CardDescription>Trámites disponibles en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {sedeTramites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay tipos de trámite configurados</p>
            ) : (
              <div className="space-y-3">
                {sedeTramites.map((tramite) => (
                  <div key={tramite.id} className="flex items-start justify-between border-b pb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{tramite.nombre}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{tramite.descripcion}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{tramite.campos.length} campos</span>
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
