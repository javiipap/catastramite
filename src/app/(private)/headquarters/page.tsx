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

  const handleEnterHeadquarters = (headquartersId: string) => {
    // Check role to determine destination
    const relation = headquarters.find(h => h.headquartersId === headquartersId)?.userHeadquarters?.find(uh => uh.userId === subject?.userId)
    if (relation?.role === 'master') {
      router.push(`/master/${headquartersId}/dashboard`)
    } else {
      router.push(`/slave/${headquartersId}/dashboard`)
    }
  }

  if (!subject) return null

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
          {headquarters.map((h) => {
            const relation = h.userHeadquarters?.find(uh => uh.userId === subject.userId)
            const role = relation?.role || 'slave' // Fallback to slave if logic fails but relation should exist
            const isMaster = role === 'master'

            return (
              <Card key={h.headquartersId} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-2 w-full bg-gradient-to-r ${stringToColor(h.name)}`} />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1 text-xl">{h.name}</CardTitle>
                    {isMaster ? (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Master</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">User</span>
                    )}
                  </div>
                  <CardDescription>Electronic Headquarters</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      ID: <span className="font-mono text-xs">{h.headquartersId.substring(0, 8)}...</span>
                    </p>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto flex gap-2">
                  <Button className={`flex-1 bg-gradient-to-r text-background ${stringToColor(h.name)}`} onClick={() => handleEnterHeadquarters(h.headquartersId)}>
                    Access <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                  {isMaster && (
                    <InviteUserDialog headquartersId={h.headquartersId} icon={<LinkIcon className="h-4 w-4" />} />
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
