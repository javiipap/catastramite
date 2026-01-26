'use client'

import { Button } from '@/components/ui/button'
import { useHeadquartersStore } from '@/lib/queries/headquarters'
import { FormField } from '@/lib/types'
import { Trash2 } from 'lucide-react'

interface Props {
  field: Omit<FormField, 'id'>
  index: number
  handleRemoveField: (index: number) => void
}

export default function ProcedureField({ field, index, handleRemoveField }: Props) {
  const { data: headquarters } = useHeadquartersStore();

  return (
    <div key={`procedure_${headquarters.headquartersId}-${index}`} className="flex items-center justify-between p-2 rounded bg-background border">
      <div className="flex-1">
        <span className="text-sm font-medium">{field.name}</span>
        <span className="text-xs text-muted-foreground ml-2">({field.type})</span>
      </div>
      <Button variant="ghost" size="sm" onClick={() => handleRemoveField(index)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}