"use client"

import { useState } from "react"
import type React from "react"

import { useHeadquartersListStore } from "@/lib/queries/headquarters"
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
import { generateInviteToken } from "@/lib/tokens"
import { toast } from "sonner"
import { useCreateHeadquarters } from "@/lib/mutations/headquarters"

export default function HeadquartersPage() {
  const { data: headquarters } = useHeadquartersListStore()
  const { user } = useAuth()
  const router = useRouter()
  
  const [isOpen, setIsOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [newHeadquartersName, setNewHeadquartersName] = useState("")
  // const [selectedHeadquartersId, setSelectedHeadquartersId] = useState<string | null>(null)
  const [inviteLink, setInviteLink] = useState<string | null>(null)

  const userHeadquarters = headquarters.filter((h) => 
    h.userHeadquarters?.some(uh => uh.userId === user?.id)
  )

  const createMutation = useCreateHeadquarters()

  const handleCreateHeadquarters = (e: React.FormEvent) => {
    e.preventDefault()
    if (newHeadquartersName.trim() && user) {
      createMutation.mutate({ name: newHeadquartersName, description: "", userId: user.id }, {
         onSuccess: () => {
             setIsOpen(false)
             setNewHeadquartersName("")
         }
      })
    }
  }

  const handleInvite = (headquartersId: string) => {
    // setSelectedHeadquartersId(headquartersId)
    const token = generateInviteToken(headquartersId)
    const link = `${window.location.origin}/login?token=${token}`
    setInviteLink(link)
    setInviteOpen(true)
  }

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
      toast.success("Link copied to clipboard")
    }
  }

  const handleEnterHeadquarters = (headquartersId: string) => {
     // Check role to determine destination
     const relation = headquarters.find(h => h.id === headquartersId)?.userHeadquarters?.find(uh => uh.userId === user?.id)
     if (relation?.role === 'master') {
         router.push(`/admin/${headquartersId}/dashboard`)
     } else {
         router.push(`/slave/${headquartersId}/dashboard`)
     }
  }

  if (!user) return null

  return (
    <div className="container py-10 max-w-5xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Headquarters</h1>
          <p className="text-muted-foreground mt-1">
            Manage your electronic headquarters and access their panels
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

      {userHeadquarters.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">You don't have any headquarters assigned</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Create your first headquarters to start managing electronic procedures or request access to an existing one.
            </p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create my first headquarters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userHeadquarters.map((h) => {
            const relation = h.userHeadquarters?.find(uh => uh.userId === user.id)
            const role = relation?.role || 'slave'
            const isAdmin = role === 'master'

            return (
              <Card key={h.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 w-full bg-primary" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1 text-xl">{h.name}</CardTitle>
                    {isAdmin ? (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>
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
                        ID: <span className="font-mono text-xs">{h.id.substring(0,8)}...</span>
                    </p>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto flex gap-2">
                  <Button className="flex-1" onClick={() => handleEnterHeadquarters(h.id)}>
                    Access <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" size="icon" onClick={() => handleInvite(h.id)} title="Invite users">
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
                <DialogTitle>Invite User</DialogTitle>
                <DialogDescription>Generate a secure link to invite users to this headquarters.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                {inviteLink ? (
                    <div className="space-y-2">
                        <Label>Invitation Link</Label>
                        <div className="flex gap-2">
                            <Input value={inviteLink} readOnly />
                            <Button size="icon" onClick={copyToClipboard}>
                                <Lock className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">This link expires in 24 hours.</p>
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
