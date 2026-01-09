"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, FolderOpen, Bell } from "lucide-react"

interface AdminNavProps {
  sedeId: string
}

export function AdminNav({ sedeId }: AdminNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: `/admin/${sedeId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Notificaciones",
      href: `/admin/${sedeId}/notificaciones`,
      icon: Bell,
    },
    {
      title: "Tipos de Trámite",
      href: `/admin/${sedeId}/tramites`,
      icon: FileText,
    },
    {
      title: "Solicitudes",
      href: `/admin/${sedeId}/solicitudes`,
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
