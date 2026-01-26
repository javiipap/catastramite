"use client"

import { useAuth } from "@/lib/auth/context"
// import { useDataStore } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Building2, ChevronDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { getUserHeadquartersObjectsAction } from "@/lib/actions/headquarters"
import { useParams } from "next/navigation"
import HeadquartersMenuItem from '@/components/headquarters-menu-item'

export function HeadquartersSelector() {
  const { subject: user } = useAuth()
  const params = useParams()

  // Get current headquartersId from URL params if available
  const currentHeadquartersId = params?.headquartersId as string | undefined

  // Fetch user headquarters on client side
  const { data: userHeadquarters = [] } = useQuery({
    queryKey: ['userHeadquarters', user?.userId],
    queryFn: async () => {
      if (!user) return []
      const result = await getUserHeadquartersObjectsAction({ userId: user.userId })
      return result?.data || []
    },
    enabled: !!user
  })

  // Find current headquarters name
  const currentHeadquarters = userHeadquarters.find((h) => h.headquartersId === currentHeadquartersId)

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 w-full md:w-[200px] justify-between bg-transparent">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium truncate">{currentHeadquarters ? currentHeadquarters.name : "Select Headquarters"}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        <DropdownMenuLabel>My Headquarters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userHeadquarters.map((headquarters) => (
          <HeadquartersMenuItem key={headquarters.headquartersId} headquarters={headquarters} />
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/headquarters" className="w-full cursor-pointer font-medium text-primary">
            Manage Headquarters
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
