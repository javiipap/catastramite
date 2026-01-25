"use client"

import { useState } from "react"
import { useHeadquartersStore } from "@/lib/queries/headquarters"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Users, Crown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAddUserToHeadquarters, useRemoveUserFromHeadquarters, useUpdateUserRoleInHeadquarters } from "@/lib/mutations/headquarters"
import type { UserRole } from "@/lib/types"
import { InviteUserDialog } from '@/components/invite-user-dialog'
import { useUserHeadquartersStore } from '@/lib/queries/user-headquarters'
import { stringToColor } from '@/lib/colors'

export default function MasterUsersPage() {
  const { data: headquarters } = useHeadquartersStore()

  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("slave")

  const { data: users } = useUserHeadquartersStore();

  // Mutations
  const { mutateAsync: addUser, isPending: isAddingUser } = useAddUserToHeadquarters();
  const { mutate: removeUser, isPending: isRemovingUser } = useRemoveUserFromHeadquarters();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRoleInHeadquarters();

  const handleSubmit = async () => {
    await addUser({
      headquartersId: headquarters.headquartersId,
      email,
      role
    });

    setIsOpen(false);
    setEmail("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-sm lg:text-base text-muted-foreground">Manage members of this headquarters</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-auto">
              <InviteUserDialog headquartersId={headquarters.headquartersId} className="w-full md:w-auto" />
            </div>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add User to Headquarters</DialogTitle>
              <DialogDescription>
                Enter the email of an existing user to add them to this headquarters.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">Master (Master)</SelectItem>
                    <SelectItem value="slave">Employee (Slave)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={isAddingUser || !email}
              >
                {isAddingUser ? "Adding..." : "Add User"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users found in this headquarters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.userId}>
              <CardContent className="px-4 py-2 relative">
                {/* Role Badge */}
                <div className="md:hidden absolute top-4 right-4 text-xs font-medium px-3 py-1.5 rounded-full border bg-orange-950/30 text-orange-500 border-orange-900/50 flex items-center gap-1.5 backdrop-blur-sm">
                  {user.role === 'master' ? <Crown className="h-3.5 w-3.5 fill-orange-500/20" /> : <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                  {user.role === 'master' ? 'Master' : 'Slave'}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 md:pt-0">
                  <div className="flex flex-row items-center gap-4 w-full md:w-auto text-left">
                    <div className={`h-16 w-16 md:h-14 md:w-14 rounded-2xl bg-gradient-to-br ${stringToColor(user.name || user.email)} flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0`}>
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-base lg:text-lg font-bold text-foreground leading-tight">{user.name}</p>
                      <div className="flex items-center justify-start gap-1.5 text-xs lg:text-sm text-muted-foreground/80">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3.5 h-3.5"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto bg-muted/40 p-1.5 rounded-xl border border-white/5">
                    <Select
                      value={user.role}
                      onValueChange={(newRole) => {
                        if (headquarters) {
                          updateRole({
                            headquartersId: headquarters.headquartersId,
                            userId: user.userId,
                            role: newRole as UserRole
                          });
                        }
                      }}
                      disabled={isUpdatingRole}
                    >
                      <SelectTrigger className="w-auto h-10 bg-transparent border-0 hover:bg-white/5 focus:ring-0 gap-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="master">
                          <div className="flex items-center gap-2">
                            <Crown className="size-4 text-orange-500" />
                            <span>Master (Owner)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="slave">Slave (Member)</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="h-6 w-px bg-border/50" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      onClick={() => {
                        if (confirm("Are you sure you want to remove this user?")) {
                          if (headquarters) {
                            removeUser({
                              headquartersId: headquarters.headquartersId,
                              userId: user.userId
                            });
                          }
                        }
                      }}
                      disabled={isRemovingUser}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
