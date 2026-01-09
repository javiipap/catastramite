"use client"

import { useNotificationsStore } from "@/lib/queries/notifications"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar } from "lucide-react"

export default function CiudadanoTablonPage() {
  const { data: notifications } = useNotificationsStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tablón de Anuncios</h2>
        <p className="text-muted-foreground">Noticias y avisos importantes de la sede</p>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay anuncios publicados actualmente</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notifications
            .slice()
            .reverse()
            .map((notification) => (
              <Card key={notification.id} className="overflow-hidden">
                <CardHeader className="bg-muted/20 pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        {notification.title}
                        {notification.priority === "high" && <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Importante</span>}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(notification.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="whitespace-pre-wrap">{notification.message}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
