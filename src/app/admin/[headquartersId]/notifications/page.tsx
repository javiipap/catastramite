"use client"

import { useHeadquartersStore } from "@/lib/queries/headquarters"
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
import { useQueryClient } from "@tanstack/react-query"
import { useCreateNotification } from "@/lib/mutations/notifications"

export default function AdminNotificationsPage() {
  const { data: headquarters } = useHeadquartersStore()
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
    if (headquarters && user) {
      addMutation.mutate({
        headquartersId: headquarters.id,
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

  if (!headquarters) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Manage announcements for citizens</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Notification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Notification</DialogTitle>
              <DialogDescription>
                This notification will be visible to all citizens of this headquarters.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Scheduled maintenance"
                    required
                  />
                </div>
                <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                    <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Content
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write the message here..."
                    required
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                    {addMutation.isPending ? "Publishing..." : "Publish"}
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
            <p className="text-muted-foreground">No notifications published in this headquarters</p>
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
                        {notification.priority === "high" && <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">High</span>}
                     </CardTitle>
                     <span className="text-xs font-normal text-muted-foreground flex items-center">
                       <Calendar className="mr-1 h-3 w-3" />
                       {new Date(notification.createdAt).toLocaleDateString("en-US", {
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
