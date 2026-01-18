"use client"

import { useAuth } from "@/lib/auth-context"
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
import { useParams, useRouter, usePathname } from "next/navigation"

export function HeadquartersSelector() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get current headquartersId from URL params if available
  const currentHeadquartersId = params?.headquartersId as string | undefined

  // Fetch user headquarters on client side
  const { data: userHeadquarters = [] } = useQuery({
    queryKey: ['userHeadquarters', user?.id],
    queryFn: async () => {
      if (!user) return []
      const result = await getUserHeadquartersObjectsAction({ userId: user.id })
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
        <Button variant="outline" className="gap-2 min-w-[200px] justify-between bg-transparent">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">{currentHeadquarters ? currentHeadquarters.name : "Select Headquarters"}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        <DropdownMenuLabel>My Headquarters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userHeadquarters.map((headquarters) => (
          <DropdownMenuItem
            key={headquarters.headquartersId}
            className="gap-2"
            onSelect={() => {
              // Determine destination based on current context
              if (pathname?.startsWith("/master")) {
                router.push(`/master/${headquarters.headquartersId}/dashboard`)
              } else if (pathname?.startsWith("/slave")) {
                router.push(`/slave/${headquarters.headquartersId}/dashboard`)
              } else {
                // Default fallback
                router.push(`/master/${headquarters.headquartersId}/dashboard`)
              }
            }}
          >
            <Building2 className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">{headquarters.name}</div>
            </div>
            {currentHeadquartersId === headquarters.headquartersId && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
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
