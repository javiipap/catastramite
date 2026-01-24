"use client"

import { useState } from "react"
import { useHeadquartersStore } from "@/lib/queries/headquarters"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Users } from "lucide-react"
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage members of this headquarters</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center gap-4">
            <InviteUserDialog headquartersId={headquarters.headquartersId} />
            <DialogTrigger asChild>
              <Button>
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
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="ml-4">
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
                      <SelectTrigger className="w-[180px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="master">Master (Master)</SelectItem>
                        <SelectItem value="slave">Employee (Slave)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
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
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
