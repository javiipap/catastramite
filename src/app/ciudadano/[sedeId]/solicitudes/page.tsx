"use client"

import { useSolicitudesStore } from "@/lib/queries/solicitudes"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Solicitud } from "@/lib/types"
import { FileText } from "lucide-react"

export default function CiudadanoSolicitudesPage() {
  const { data: solicitudes } = useSolicitudesStore()
  const { user } = useAuth()
  const [filtro, setFiltro] = useState<string>("todas")
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null)

  // Filter client side for current user
  const misSolicitudes = solicitudes.filter((s) => s.solicitanteId === user?.id)
  const solicitudesFiltradas = filtro === "todas" ? misSolicitudes : misSolicitudes.filter((s) => s.estado === filtro)

  const getEstadoBadge = (estado: Solicitud["estado"]) => {
    const styles = {
      pendiente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      en_revision: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      aprobada: "bg-green-100 text-green-800 hover:bg-green-200",
      rechazada: "bg-red-100 text-red-800 hover:bg-red-200",
    }
    return styles[estado]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mis Solicitudes</h2>
          <p className="text-muted-foreground">Consulta el estado de tus trámites presentados</p>
        </div>
        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
            <SelectItem value="en_revision">En Revisión</SelectItem>
            <SelectItem value="aprobada">Aprobadas</SelectItem>
            <SelectItem value="rechazada">Rechazadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {solicitudesFiltradas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {filtro === "todas" ? "No has presentado solicitudes aún" : `No tienes solicitudes ${filtro}`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {solicitudesFiltradas
            .slice()
            .reverse()
            .map((solicitud) => (
              <Card key={solicitud.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{solicitud.tramiteTypeNombre}</CardTitle>
                      <CardDescription>
                        Solicitud #{solicitud.id}
                        <span className="mx-2">•</span>
                        {new Date(solicitud.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <Badge className={getEstadoBadge(solicitud.estado)}>
                      {solicitud.estado === "en_revision" ? "En revisión" : solicitud.estado}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" onClick={() => setSelectedSolicitud(solicitud)}>
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <Dialog open={!!selectedSolicitud} onOpenChange={() => setSelectedSolicitud(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSolicitud?.tramiteTypeNombre}</DialogTitle>
            <DialogDescription>Detalles de tu solicitud #{selectedSolicitud?.id}</DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Estado:</span>
                  <p className="mt-1">
                    <Badge className={getEstadoBadge(selectedSolicitud.estado)}>
                      {selectedSolicitud.estado === "en_revision" ? "En revisión" : selectedSolicitud.estado}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="font-medium">Fecha de Solicitud:</span>
                  <p className="text-muted-foreground mt-1">
                    {new Date(selectedSolicitud.createdAt).toLocaleDateString("es-ES", {
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
                <h4 className="font-medium mb-3">Información Presentada</h4>
                <div className="space-y-3">
                  {Object.entries(selectedSolicitud.datos).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <span className="col-span-2">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSolicitud.estado === "pendiente" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                  <p className="text-yellow-800">
                    Tu solicitud está pendiente de revisión. Recibirás una actualización pronto.
                  </p>
                </div>
              )}
              {selectedSolicitud.estado === "en_revision" && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                  <p className="text-orange-800">Tu solicitud está siendo revisada por el equipo administrativo.</p>
                </div>
              )}
              {selectedSolicitud.estado === "aprobada" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                  <p className="text-green-800">Tu solicitud ha sido aprobada correctamente.</p>
                </div>
              )}
              {selectedSolicitud.estado === "rechazada" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                  <p className="text-red-800">
                    Tu solicitud ha sido rechazada. Contacta con la administración para más información.
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
