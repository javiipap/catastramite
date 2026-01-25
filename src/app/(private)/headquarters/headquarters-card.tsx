"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ExternalLink, Link as LinkIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { InviteUserDialog } from '@/components/invite-user-dialog'
import { stringToColor } from '@/lib/colors'
import { Headquarters } from "@/lib/types"

interface HeadquartersCardProps {
  headquarters: Headquarters
  currentUser: { userId: string }
}

export function HeadquartersCard({ headquarters: h, currentUser }: HeadquartersCardProps) {
  const router = useRouter()

  const relation = h.userHeadquarters?.find(uh => uh.userId === currentUser.userId)
  const role = relation?.role || 'slave'
  const isMaster = role === 'master'

  const handleEnterHeadquarters = () => {
    if (isMaster) {
      router.push(`/master/${h.headquartersId}/dashboard`)
    } else {
      router.push(`/slave/${h.headquartersId}/dashboard`)
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
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
        <Button className={`flex-1 bg-gradient-to-r text-background ${stringToColor(h.name)}`} onClick={handleEnterHeadquarters}>
          Access <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
        {isMaster && (
          <InviteUserDialog headquartersId={h.headquartersId} icon={<LinkIcon className="h-4 w-4" />} />
        )}
      </div>
    </Card>
  )
}
