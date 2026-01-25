"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Crown } from "lucide-react"
import { stringToColor } from '@/lib/colors'
import { User, Headquarters } from "@/lib/types"
import type { UserRole } from "@/lib/types"
import { useRemoveUserFromHeadquarters, useUpdateUserRoleInHeadquarters } from "@/lib/mutations/headquarters"

interface UserCardProps {
  user: User
  headquarters: Headquarters
}

export function UserCard({ user, headquarters }: UserCardProps) {
  const { mutate: removeUser, isPending: isRemovingUser } = useRemoveUserFromHeadquarters();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRoleInHeadquarters();

  const handleRoleChange = (newRole: string) => {
    if (headquarters) {
      updateRole({
        headquartersId: headquarters.headquartersId,
        userId: user.userId,
        role: newRole as UserRole
      });
    }
  }

  const handleRemoveUser = () => {
    if (confirm("Are you sure you want to remove this user?")) {
      if (headquarters) {
        removeUser({
          headquartersId: headquarters.headquartersId,
          userId: user.userId
        });
      }
    }
  }

  return (
    <Card>
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
              value={user.role as string}
              onValueChange={handleRoleChange}
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
              onClick={handleRemoveUser}
              disabled={isRemovingUser}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
