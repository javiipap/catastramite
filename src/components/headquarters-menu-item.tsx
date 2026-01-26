import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Building2 } from "lucide-react"
import { Check } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import type { Headquarters } from "@/lib/types"

interface Props {
  headquarters: Headquarters;
}

export default function HeadquartersMenuItem({ headquarters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams();

  const currentHeadquartersId = params.headquartersId

  return (
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
  )
}