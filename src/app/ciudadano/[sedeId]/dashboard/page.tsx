"use client"

import { useAuth } from "@/lib/auth-context"
import { useQuery } from "@tanstack/react-query"
import { getCitizenDashboardData } from "@/lib/actions/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FolderOpen, Bell, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CiudadanoDashboardPage() {
  const { user } = useAuth()
  const params = useParams()
  const sedeId = params.sedeId as string

  const { data, isLoading, error } = useQuery({
    queryKey: ['citizen-dashboard', sedeId, user?.id],
    queryFn: () => {
        if (!user || !sedeId) return null
        return getCitizenDashboardData({ sedeId }, user.id)
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

  // Filter is redundant if server already filtered, but harmless
  const misSolicitudes = sedeSolicitudes

  const stats = [
    {
      title: "Trámites Disponibles",
      value: sedeTramites.length,
      description: "Servicios activos",
      icon: FileText,
      color: "text-blue-600",
      href: `/ciudadano/${currentSede?.id}/tramites`,
    },
    {
      title: "Mis Solicitudes",
      value: misSolicitudes.length,
      description: "Historial de gestiones",
      icon: FolderOpen,
      color: "text-green-600",
      href: `/ciudadano/${currentSede?.id}/solicitudes`,
    },
    {
      title: "Tablón de Anuncios",
      value: "Ver", // Placeholder or fetch if possible
      description: "Avisos importantes",
      icon: Bell,
      color: "text-yellow-600",
      href: `/ciudadano/${currentSede?.id}/tablon`,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bienvenido, {user?.name}</h2>
        <p className="text-muted-foreground">Panel del ciudadano de {currentSede?.nombre || "la sede"}</p>
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
              <CardTitle>Mis Solicitudes Recientes</CardTitle>
              <CardDescription>Estado de tus últimos trámites</CardDescription>
            </div>
            <Link href={`/ciudadano/${currentSede?.id}/solicitudes`}>
              <Button variant="ghost" size="sm">
                Ver todas <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {misSolicitudes.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No tienes solicitudes activas</p>
                <Link href={`/ciudadano/${currentSede?.id}/tramites`}>
                  <Button variant="link" className="mt-2 text-primary">
                    Iniciar un trámite
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {misSolicitudes
                  .slice(0, 5)
                  .reverse()
                  .map((solicitud) => (
                    <div key={solicitud.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{solicitud.tramiteTypeNombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(solicitud.createdAt).toLocaleDateString()}
                        </p>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Trámites Disponibles</CardTitle>
              <CardDescription>Servicios destacados</CardDescription>
            </div>
            <Link href={`/ciudadano/${currentSede?.id}/tramites`}>
              <Button variant="ghost" size="sm">
                Ver todos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
             {sedeTramites.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                    <p>No hay trámites disponibles en este momento</p>
                </div>
             ) : (
               <div className="space-y-4">
                 {sedeTramites.slice(0, 5).map((tramite) => (
                    <div key={tramite.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                            <p className="font-medium">{tramite.nombre}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{tramite.descripcion}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/ciudadano/${currentSede?.id}/tramites/${tramite.id}`}>Iniciar</Link>
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
