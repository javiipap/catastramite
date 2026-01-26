'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type Procedure } from '@/lib/types'

interface Props {
  procedure: Procedure
}

export default function ProcedureCard({ procedure }: Props) {
  return (
    <Card key={procedure.procedureId} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{procedure.name}</CardTitle>
        <CardDescription className="line-clamp-2">{procedure.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Form fields:</span>
            <span className="font-medium">{procedure.fields.length}</span>
          </div>
          <div className="space-y-1">
            {procedure.fields.slice(0, 3).map((field) => (
              <div key={field.id} className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                {field.name} ({field.type})
              </div>
            ))}
            {procedure.fields.length > 3 && (
              <p className="text-xs text-muted-foreground italic">+{procedure.fields.length - 3} more...</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}