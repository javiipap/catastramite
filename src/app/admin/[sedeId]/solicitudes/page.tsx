"use client"

import { useSedeStore } from "@/lib/queries/sedes"
import { useSolicitudesStore } from "@/lib/queries/solicitudes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Solicitud } from "@/lib/types"
import { updateSolicitudEstado as updateAction } from "@/lib/actions/solicitudes"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useAuth } from "@/lib/auth-context"

export default function AdminSolicitudesPage() {
  const { data: currentSede } = useSedeStore()
  const { data: solicitudes } = useSolicitudesStore()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const [filtro, setFiltro] = useState<string>("todas")
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null)

  const solicitudesFiltradas = filtro === "todas" ? solicitudes : solicitudes.filter((s) => s.estado === filtro)

  const updateMutation = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: Solicitud["estado"] }) => {
        if (!user) throw new Error("No user")
        return updateAction(id, estado, user.id)
    },
    onSuccess: (updated) => {
        queryClient.invalidateQueries({ queryKey: ["solicitudes"] })
        if (selectedSolicitud?.id === updated.id) {
            setSelectedSolicitud(updated)
        }
        toast.success("Estado actualizado")
    },
    onError: () => toast.error("Error al actualizar estado")
  })

  const getEstadoBadge = (estado: Solicitud["estado"]) => {
    const styles = {
      pendiente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      en_revision: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      aprobada: "bg-green-100 text-green-800 hover:bg-green-200",
      rechazada: "bg-red-100 text-red-800 hover:bg-red-200",
    }
    return styles[estado]
  }

  if (!currentSede) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Solicitudes</h2>
          <p className="text-muted-foreground">Gestiona y revisa todas las solicitudes presentadas</p>
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
            <p className="text-muted-foreground">
              {filtro === "todas"
                ? "No hay solicitudes presentadas en esta sede"
                : `No hay solicitudes ${filtro} en esta sede`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {solicitudesFiltradas.map((solicitud) => (
            <Card key={solicitud.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{solicitud.tramiteTypeNombre}</CardTitle>
                    <CardDescription>
                      Solicitante: {solicitud.solicitanteNombre}
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedSolicitud(solicitud)}>
                    Ver Detalles
                  </Button>
                  {solicitud.estado === "pendiente" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMutation.mutate({ id: solicitud.id, estado: "en_revision" })}
                    >
                      Marcar en Revisión
                    </Button>
                  )}
                  {(solicitud.estado === "pendiente" || solicitud.estado === "en_revision") && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMutation.mutate({ id: solicitud.id, estado: "aprobada" })}
                        className="text-green-700 hover:text-green-800"
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMutation.mutate({ id: solicitud.id, estado: "rechazada" })}
                        className="text-red-700 hover:text-red-800"
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedSolicitud} onOpenChange={() => setSelectedSolicitud(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSolicitud?.tramiteTypeNombre}</DialogTitle>
            <DialogDescription>Detalles de la solicitud #{selectedSolicitud?.id}</DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Solicitante:</span>
                  <p className="text-muted-foreground">{selectedSolicitud.solicitanteNombre}</p>
                </div>
                <div>
                  <span className="font-medium">Estado:</span>
                  <p>
                    <Badge className={getEstadoBadge(selectedSolicitud.estado)}>
                      {selectedSolicitud.estado === "en_revision" ? "En revisión" : selectedSolicitud.estado}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="font-medium">Fecha de Solicitud:</span>
                  <p className="text-muted-foreground">
                    {new Date(selectedSolicitud.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Última Actualización:</span>
                  <p className="text-muted-foreground">
                    {new Date(selectedSolicitud.updatedAt).toLocaleDateString("es-ES", {
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
                <h4 className="font-medium mb-3">Datos del Formulario</h4>
                <div className="space-y-3">
                  {Object.entries(selectedSolicitud.datos).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <span className="col-span-2">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {(selectedSolicitud.estado === "pendiente" || selectedSolicitud.estado === "en_revision") && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      updateMutation.mutate({ id: selectedSolicitud.id, estado: "aprobada" })
                    //   setSelectedSolicitud(null) // Kepping open to show result? Or close? Original closed it.
                    }}
                    className="flex-1"
                  >
                    Aprobar Solicitud
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                        updateMutation.mutate({ id: selectedSolicitud.id, estado: "rechazada" })
                        // setSelectedSolicitud(null)
                    }}
                    className="flex-1"
                  >
                    Rechazar Solicitud
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
