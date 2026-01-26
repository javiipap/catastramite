"use client"

import { useState } from "react"
import type React from "react"

import { useHeadquartersListStore } from "@/lib/queries/headquarters"
import { useAuth } from "@/lib/auth/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Building2, ExternalLink, Link as LinkIcon } from "lucide-react"
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
import { useCreateHeadquarters } from "@/lib/mutations/headquarters"
import { InviteUserDialog } from '@/components/invite-user-dialog'
import { stringToColor } from '@/lib/colors'
import { HeadquartersCard } from './headquarters-card'

export default function HeadquartersPage() {
  const { data: headquarters } = useHeadquartersListStore()
  const { subject } = useAuth()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [newHeadquartersName, setNewHeadquartersName] = useState("")

  const createMutation = useCreateHeadquarters()

  const handleCreateHeadquarters = (e: React.FormEvent) => {
    e.preventDefault()
    if (newHeadquartersName.trim() && subject) {
      createMutation.mutate({ name: newHeadquartersName, description: "" }, {
        onSuccess: () => {
          setIsOpen(false)
          setNewHeadquartersName("")
        }
      })
    }
  }

  return (
    <div className="py-10 mx-auto p-6 container">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Headquarters</h1>
          <p className="text-muted-foreground mt-1">
            Access your electronic headquarters or create a new one
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Headquarters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Headquarters</DialogTitle>
              <DialogDescription>
                Add a new electronic headquarters to manage your procedures.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateHeadquarters}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Headquarters Name</Label>
                  <Input
                    id="name"
                    value={newHeadquartersName}
                    onChange={(e) => setNewHeadquartersName(e.target.value)}
                    placeholder="Ex: City Council of..."
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newHeadquartersName.trim() || createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Headquarters"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {headquarters.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">You don&apos;t have any headquarters assigned</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Create your first headquarters or ask an admin for an invitation.
            </p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create my first headquarters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {headquarters.map((h) => (
            <HeadquartersCard key={h.headquartersId} headquarters={h} currentUser={subject} />
          )
          )}
        </div>
      )}
    </div>
  )
}
