"use client"

import { useState } from "react"
import type React from "react"

import { useSedesStore } from "@/lib/queries/sedes"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Building2, ExternalLink, Link as LinkIcon, Lock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { createSede } from "@/lib/actions/sedes"
import { generateInviteToken } from "@/lib/tokens"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCreateSede } from "@/lib/mutations/sedes"

export default function SedesPage() {
  const { data: sedes } = useSedesStore()
  const { user } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [isOpen, setIsOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [newSedeName, setNewSedeName] = useState("")
  const [selectedSedeId, setSelectedSedeId] = useState<string | null>(null)
  const [inviteLink, setInviteLink] = useState<string | null>(null)

  const userSedes = sedes.filter((sede) => 
    sede.userSedes?.some(us => us.userId === user?.id)
  )

  const createMutation = useCreateSede()

  const handleCreateSede = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSedeName.trim() && user) {
      createMutation.mutate({ nombre: newSedeName, descripcion: "", userId: user.id }, {
         onSuccess: () => {
             setIsOpen(false)
             setNewSedeName("")
         }
      })
    }
  }

  const handleInvite = (sedeId: string) => {
    setSelectedSedeId(sedeId)
    const token = generateInviteToken(sedeId)
    const link = `${window.location.origin}/login?token=${token}`
    setInviteLink(link)
    setInviteOpen(true)
  }

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
      toast.success("Enlace copiado al portapapeles")
    }
  }

  const handleEnterSede = (sedeId: string) => {
     // Check role to determine destination
     const relation = sedes.find(s => s.id === sedeId)?.userSedes?.find(us => us.userId === user?.id)
     if (relation?.role === "administrador") {
         router.push(`/admin/${sedeId}/dashboard`)
     } else {
         router.push(`/ciudadano/${sedeId}/dashboard`)
     }
  }

  if (!user) return null

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Sedes</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus sedes de electrónica y accede a sus paneles
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Sede
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Sede</DialogTitle>
              <DialogDescription>
                Añade una nueva sede electrónica para gestionar tus trámites.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSede}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre de la Sede</Label>
                  <Input
                    id="name"
                    value={newSedeName}
                    onChange={(e) => setNewSedeName(e.target.value)}
                    placeholder="Ej: Ayuntamiento de..."
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={!newSedeName.trim() || createMutation.isPending}>
                  {createMutation.isPending ? "Creando..." : "Crear Sede"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {userSedes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tienes sedes asignadas</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Crea tu primera sede para empezar a gestionar trámites electrónicos o solicita acceso a una existente.
            </p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear mi primera sede
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userSedes.map((sede) => {
            const relation = sede.userSedes?.find(us => us.userId === user.id)
            const role = relation?.role || "administrado"
            const isAdmin = role === "administrador"

            return (
              <Card key={sede.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 w-full bg-primary" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1 text-xl">{sede.nombre}</CardTitle>
                    {isAdmin ? (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>
                    ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">Usuario</span>
                    )}
                  </div>
                  <CardDescription>Sede Electrónica</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        ID: <span className="font-mono text-xs">{sede.id.substring(0,8)}...</span>
                    </p>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto flex gap-2">
                  <Button className="flex-1" onClick={() => handleEnterSede(sede.id)}>
                    Acceder <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" size="icon" onClick={() => handleInvite(sede.id)} title="Invitar usuarios">
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Invitar Usuario</DialogTitle>
                <DialogDescription>Genera un enlace seguro para invitar a usuarios a esta sede.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                {inviteLink ? (
                    <div className="space-y-2">
                        <Label>Enlace de Invitación</Label>
                        <div className="flex gap-2">
                            <Input value={inviteLink} readOnly />
                            <Button size="icon" onClick={copyToClipboard}>
                                <Lock className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Este enlace expira en 24 horas.</p>
                    </div>
                ) : (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
