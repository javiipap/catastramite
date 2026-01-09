"use client"

import { useSedeStore } from "@/lib/queries/sedes"
import { useNotificationsStore } from "@/lib/queries/notifications"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Bell, Plus, Calendar } from "lucide-react"
import { addNotification as addNotificationAction } from "@/lib/actions/notifications"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCreateNotification } from "@/lib/mutations/notifications"

export default function AdminNotificacionesPage() {
  const { data: currentSede } = useSedeStore()
  const { data: notifications } = useNotificationsStore()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")

  const addMutation = useCreateNotification()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentSede && user) {
      addMutation.mutate({
        sedeId: currentSede.id,
        title,
        message,
        priority,
        userId: user.id,
      }, {
          onSuccess: () => {
               setIsOpen(false)
               setTitle("")
               setMessage("")
               setPriority("medium")
          }
      })
    }
  }

  if (!currentSede) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notificaciones</h2>
          <p className="text-muted-foreground">Gestiona los avisos para los ciudadanos</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Notificación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Notificación</DialogTitle>
              <DialogDescription>
                Esta notificación será visible para todos los ciudadanos de esta sede.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Título
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Mantenimiento programado"
                    required
                  />
                </div>
                <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">Prioridad</label>
                    <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Baja</SelectItem>
                            <SelectItem value="medium">Media</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Contenido
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe el mensaje aquí..."
                    required
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                    {addMutation.isPending ? "Publicando..." : "Publicar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay notificaciones publicadas en esta sede</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notifications
            .slice()
            .reverse()
            .map((notification) => (
              <Card key={notification.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                     <CardTitle className="text-lg flex items-center gap-2">
                        {notification.title}
                        {notification.priority === "high" && <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Alta</span>}
                     </CardTitle>
                     <span className="text-xs font-normal text-muted-foreground flex items-center">
                       <Calendar className="mr-1 h-3 w-3" />
                       {new Date(notification.createdAt).toLocaleDateString("es-ES", {
                         year: "numeric",
                         month: "long",
                         day: "numeric",
                         hour: "2-digit",
                         minute: "2-digit",
                       })}
                     </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notification.message}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
