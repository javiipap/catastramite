"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, FileText, FolderOpen, Bell } from "lucide-react"

interface CitizenNavProps {
  headquartersId: string
}

export function CitizenNav({ headquartersId }: CitizenNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Home",
      href: `/slave/${headquartersId}/dashboard`,
      icon: Home,
    },
    {
      title: "Notifications",
      href: `/slave/${headquartersId}/notifications`,
      icon: Bell,
    },
    {
      title: "Available Procedures",
      href: `/slave/${headquartersId}/procedures`,
      icon: FileText,
    },
    {
      title: "My Requests",
      href: `/slave/${headquartersId}/requests`,
      icon: FolderOpen,
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
