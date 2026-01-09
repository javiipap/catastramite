"use client"

import { useParams, useRouter } from "next/navigation"
import { useTramitesStore } from "@/lib/queries/tramites"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useCreateSolicitud } from "@/lib/mutations/solicitudes"

export default function CiudadanoTramitePage() {
  const params = useParams()
  const router = useRouter()
  // Use tramites store to get data. This presupposes the layout fetches it.
  // The layout layout.tsx exists and provides TramitesProvider.
  // However, TramitesProvider fetches ALL tramites for the sede.
  // This is fine for now as we just find the one we need client side.
  const { data: tramiteTypes } = useTramitesStore()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState<Record<string, string>>({})

  // Find Tramite from store
  const tramite = tramiteTypes.find((t) => t.id === params.id)


  
  const addMutation = useCreateSolicitud()

  if (!tramite) {
    return (
      <div className="space-y-6">
        <Link href={`/ciudadano/${params.sedeId}/tramites`}>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Trámites
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Trámite no encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user && tramite) {
        addMutation.mutate({
        tramiteTypeId: tramite.id,
        tramiteTypeNombre: tramite.nombre,
        sedeId: tramite.sedeId,
        solicitanteId: user.id,
        solicitanteNombre: user.name,
        estado: "pendiente",
        datos: formData,
        userId: user.id
      }, {
          onSuccess: () => {
              router.push(`/ciudadano/${params.sedeId}/solicitudes`)
          }
      })
    }
  }

  const handleChange = (nombre: string, valor: string) => {
    setFormData({ ...formData, [nombre]: valor })
  }

  const isFormValid = tramite.campos
    .filter((c) => c.requerido)
    .every((c) => formData[c.nombre] && formData[c.nombre].trim() !== "")

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href={`/ciudadano/${params.sedeId}/tramites`}>
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Trámites
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{tramite.nombre}</CardTitle>
          <CardDescription>{tramite.descripcion}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {tramite.campos.map((campo) => (
              <div key={campo.id} className="space-y-2">
                <Label htmlFor={campo.id}>
                  {campo.nombre}
                  {campo.requerido && <span className="text-destructive ml-1">*</span>}
                </Label>
                {campo.tipo === "textarea" ? (
                  <Textarea
                    id={campo.id}
                    value={formData[campo.nombre] || ""}
                    onChange={(e) => handleChange(campo.nombre, e.target.value)}
                    required={campo.requerido}
                    rows={4}
                  />
                ) : (
                  <Input
                    id={campo.id}
                    type={campo.tipo === "numero" ? "number" : campo.tipo === "fecha" ? "date" : campo.tipo}
                    value={formData[campo.nombre] || ""}
                    onChange={(e) => handleChange(campo.nombre, e.target.value)}
                    required={campo.requerido}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={!isFormValid || addMutation.isPending} className="flex-1">
                {addMutation.isPending ? "Presentando..." : "Presentar Solicitud"}
              </Button>
              <Link href={`/ciudadano/${params.sedeId}/tramites`} className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
