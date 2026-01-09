"use client"

import { useTramitesStore } from "@/lib/queries/tramites"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CiudadanoTramitesPage() {
  const { data: tramiteTypes } = useTramitesStore()
  const params = useParams()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Trámites Disponibles</h2>
        <p className="text-muted-foreground">Selecciona el trámite que deseas realizar</p>
      </div>

      {tramiteTypes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No hay trámites digitales disponibles en esta sede</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tramiteTypes.map((tramite) => (
            <Card key={tramite.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{tramite.nombre}</CardTitle>
                <CardDescription className="line-clamp-2">{tramite.descripcion}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>Requisitos: {tramite.campos.length} campos a completar</p>
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/ciudadano/${params.sedeId}/tramites/${tramite.id}`}>Iniciar Trámite</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
