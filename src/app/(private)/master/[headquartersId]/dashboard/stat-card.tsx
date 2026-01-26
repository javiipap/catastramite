import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  description: string
  icon: LucideIcon
  color: string
  bg: string
  borderColor: string
  iconBg: string
}

export function StatCard({ title, value, description, icon: Icon, color, bg, borderColor, iconBg }: StatCardProps) {
  return (
    <Card className={`relative overflow-hidden bg-card/50 gap-1 ${borderColor} ${bg}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${iconBg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{value}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
