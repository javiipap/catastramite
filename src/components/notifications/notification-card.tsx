
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import type { Notification } from '@/lib/types'
import { stringifyDate } from '@/lib/utils'

interface Props {
  notification: Notification
}

export default function NotificationCard({ notification }: Props) {
  const { createdAt, title, message, priority } = notification;

  const isHighPriority = priority === 'high'

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/20 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            {title}
            {isHighPriority && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                Important
              </span>
            )}
          </CardTitle>
        </div>
        <span className="text-xs text-muted-foreground flex items-center">
          <Calendar className="mr-1 h-3 w-3" />
          {stringifyDate(createdAt)}
        </span>
      </CardHeader>
      <CardContent className={'pt-4'}>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{message}</p>
      </CardContent>
    </Card>
  )
}
