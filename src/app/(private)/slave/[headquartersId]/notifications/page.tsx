"use client"

import { useNotificationsStore } from "@/lib/queries/notifications"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Calendar } from "lucide-react"

import NotificationCard from "@/components/notifications/notification-card"

export default function SlaveNotificationsPage() {
  const { data: notifications } = useNotificationsStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notifications Board</h2>
        <p className="text-muted-foreground">Important news and notices from the headquarters</p>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications currently published</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notifications
            .slice()
            .reverse()
            .map((notification) => (
              <NotificationCard key={notification.notificationId} notification={notification} />
            ))}
        </div>
      )}
    </div>
  )
}

