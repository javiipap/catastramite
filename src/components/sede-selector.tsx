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
import { getUserSedeObjects } from "@/lib/actions/users"
import { useParams, useRouter, usePathname } from "next/navigation"

export function SedeSelector() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Get current sedeId from URL params if available
  const currentSedeId = params?.sedeId as string | undefined

  // Fetch user sedes on client side
  const { data: userSedes = [] } = useQuery({
    queryKey: ['userSedes', user?.id],
    queryFn: async () => {
        if (!user) return []
        return getUserSedeObjects(user.id)
    },
    enabled: !!user
  })

  // Find current sede name
  const currentSede = userSedes.find((s) => s.id === currentSedeId)

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 min-w-[200px] justify-between bg-transparent">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">{currentSede ? currentSede.nombre : "Selecciona una sede"}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        <DropdownMenuLabel>Mis Sedes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userSedes.map((sede) => (
          <DropdownMenuItem 
            key={sede.id} 
            className="gap-2"
            onSelect={() => {
                // Determine destination based on current context
                if (pathname?.startsWith("/admin")) {
                    router.push(`/admin/${sede.id}/dashboard`)
                } else if (pathname?.startsWith("/ciudadano")) {
                    router.push(`/ciudadano/${sede.id}/dashboard`)
                } else {
                    // Default fallback
                    router.push(`/admin/${sede.id}/dashboard`)
                }
            }}
          >
            <Building2 className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">{sede.nombre}</div>
            </div>
            {currentSedeId === sede.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
            <a href="/admin/sedes" className="w-full cursor-pointer font-medium text-primary">
                Gestionar mis Sedes
            </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
