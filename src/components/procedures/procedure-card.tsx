import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { type Procedure } from '@/lib/types'

interface Props {
  procedure: Procedure
  variant?: 'default' | 'actionable'
}

export default function ProcedureCard({ procedure, variant = 'default' }: Props) {
  const { name, description, fields, procedureId, headquartersId } = procedure;

  return (
    <Card key={procedureId} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {variant === 'default' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Form fields:</span>
              <span className="font-medium">{fields.length}</span>
            </div>
            <div className="space-y-1">
              {fields.slice(0, 3).map((field) => (
                <div key={field.id} className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  {field.name} ({field.type})
                </div>
              ))}
              {fields.length > 3 && (
                <p className="text-xs text-muted-foreground italic">+{fields.length - 3} more...</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Requirements: {fields.length} fields to complete</p>
            </div>
            <Button className="w-full" asChild>
              <Link href={`/slave/${headquartersId}/procedures/${procedureId}`}>Start Procedure</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}