import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

interface DashboardListProps {
  title: string
  description: string
  actionLink: {
    href: string
    label: string
  }
  children: ReactNode
  isEmpty: boolean
  emptyState: {
    icon: LucideIcon
    text: string
  }
}

export function DashboardList({
  title,
  description,
  actionLink,
  children,
  isEmpty,
  emptyState: { icon: EmptyIcon, text: emptyText },
}: DashboardListProps) {
  return (
    <Card className="bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <Link
          href={actionLink.href}
          className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1"
        >
          {actionLink.label} &rarr;
        </Link>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <EmptyIcon className="h-8 w-8 mb-2 opacity-50" />
            <p>{emptyText}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
