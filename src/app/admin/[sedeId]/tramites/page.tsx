"use client"

import { useState } from "react"
import { useSedeStore } from "@/lib/queries/sedes"
import { useTramitesStore } from "@/lib/queries/tramites"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addTramiteType as addAction } from "@/lib/actions/tramites"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { CampoFormulario } from "@/lib/types"
import { useCreateTramite } from "@/lib/mutations/tramites"

export default function AdminTramitesPage() {
  const { data: currentSede } = useSedeStore()
  const { data: tramiteTypes } = useTramitesStore()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [campos, setCampos] = useState<Omit<CampoFormulario, "id">[]>([])
  const [nuevoCampo, setNuevoCampo] = useState({
    nombre: "",
    tipo: "texto" as CampoFormulario["tipo"],
    requerido: true,
  })

  // Filter is redundant if we assume layout provides correct context, but keeping logical consistency is fine
  // Actually no, `useTramitesStore` comes from `withServerData(getTramitesByParams)` which ALREADY filters by sedeId on server.
  // So `tramiteTypes` IS the sedeTramites.
  const sedeTramites = tramiteTypes; 

  const addMutation = useCreateTramite()

  const handleAddCampo = () => {
    if (nuevoCampo.nombre) {
      setCampos([...campos, nuevoCampo])
      setNuevoCampo({ nombre: "", tipo: "texto", requerido: true })
    }
  }

  const handleRemoveCampo = (index: number) => {
    setCampos(campos.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (nombre && descripcion && campos.length > 0 && user && currentSede) {
      addMutation.mutate({
        sedeId: currentSede.id,
        nombre,
        descripcion,
        // Assign temp IDs here, server might re-assign or use these. 
        // Logic in action: const id = Math.random()...
        // Logic in View was: `${i + 1}`. I'll stick to view logic for now.
        campos: campos.map((c, i) => ({ ...c, id: `${i + 1}` })),
        userId: user.id,
      }, {
           onSuccess: () => {
               setNombre("")
               setDescripcion("")
               setCampos([])
               setIsOpen(false)
           }
      })
    }
  }

  if (!currentSede) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tipos de Trámite</h2>
          <p className="text-muted-foreground">Gestiona los trámites disponibles para los ciudadanos</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo de Trámite
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Tipo de Trámite</DialogTitle>
              <DialogDescription>Define los detalles y campos del formulario para este trámite</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Trámite</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Certificado de Empadronamiento"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe el propósito de este trámite"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Campos del Formulario</Label>
                  <span className="text-xs text-muted-foreground">{campos.length} campos añadidos</span>
                </div>

                <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <Input
                        placeholder="Nombre del campo"
                        value={nuevoCampo.nombre}
                        onChange={(e) => setNuevoCampo({ ...nuevoCampo, nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-span-4">
                      <Select
                        value={nuevoCampo.tipo}
                        onValueChange={(value) =>
                          setNuevoCampo({ ...nuevoCampo, tipo: value as CampoFormulario["tipo"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="texto">Texto</SelectItem>
                          <SelectItem value="numero">Número</SelectItem>
                          <SelectItem value="fecha">Fecha</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="textarea">Área de texto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Button onClick={handleAddCampo} className="w-full" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Añadir
                      </Button>
                    </div>
                  </div>

                  {campos.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      {campos.map((campo, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-background border">
                          <div className="flex-1">
                            <span className="text-sm font-medium">{campo.nombre}</span>
                            <span className="text-xs text-muted-foreground ml-2">({campo.tipo})</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveCampo(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={!nombre || !descripcion || campos.length === 0 || addMutation.isPending}
              >
                {addMutation.isPending ? "Creando..." : "Crear Tipo de Trámite"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sedeTramites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No hay tipos de trámite creados en esta sede</p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear primer tipo de trámite
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sedeTramites.map((tramite) => (
            <Card key={tramite.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{tramite.nombre}</CardTitle>
                <CardDescription className="line-clamp-2">{tramite.descripcion}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Campos del formulario:</span>
                    <span className="font-medium">{tramite.campos.length}</span>
                  </div>
                  <div className="space-y-1">
                    {tramite.campos.slice(0, 3).map((campo) => (
                      <div key={campo.id} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        {campo.nombre} ({campo.tipo})
                      </div>
                    ))}
                    {tramite.campos.length > 3 && (
                      <p className="text-xs text-muted-foreground italic">+{tramite.campos.length - 3} más...</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
