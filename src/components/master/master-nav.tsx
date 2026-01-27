"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, FolderOpen, Bell, Users } from "lucide-react"

export function MasterNav() {
  const pathname = usePathname()
  const pathParams = useParams();

  const headquartersId = pathParams.headquartersId

  if (!headquartersId) return null

  const navItems = [
    {
      title: "Dashboard",
      href: `/master/${headquartersId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Notifications",
      href: `/master/${headquartersId}/notifications`,
      icon: Bell,
    },
    {
      title: "Procedures",
      href: `/master/${headquartersId}/procedures`,
      icon: FileText,
    },
    {
      title: "Requests",
      href: `/master/${headquartersId}/requests`,
      icon: FolderOpen,
    },
    {
      title: "Users",
      href: `/master/${headquartersId}/users`,
      icon: Users,
    },
  ]

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
