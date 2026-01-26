import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface DashboardListElementProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  title: string
  subtitle: ReactNode
  endContent: ReactNode
}

export function DashboardListElement({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  endContent,
}: DashboardListElementProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="font-medium text-sm">{title}</p>
          <div className="text-xs text-muted-foreground">
            {subtitle}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {endContent}
      </div>
    </div>
  )
}
