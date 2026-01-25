"use client"

import { useState } from "react"
import { useHeadquartersStore } from "@/lib/queries/headquarters"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
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
import { useAddUserToHeadquarters } from "@/lib/mutations/headquarters"
import type { UserRole } from "@/lib/types"
import { InviteUserDialog } from '@/components/invite-user-dialog'
import { useUserHeadquartersStore } from '@/lib/queries/user-headquarters'
import { stringToColor } from '@/lib/colors'
import { UserCard } from './user-card'

export default function MasterUsersPage() {
  const { data: headquarters } = useHeadquartersStore()

  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("slave")

  const { data: users } = useUserHeadquartersStore();

  // Mutations
  const { mutateAsync: addUser, isPending: isAddingUser } = useAddUserToHeadquarters();


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
            <UserCard key={user.userId} user={user} headquarters={headquarters} />
          ))}
        </div>
      )}
    </div>
  )
}
