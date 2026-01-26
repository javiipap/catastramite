"use client"

import { useProceduresStore } from "@/lib/queries/procedures"
import { Card, CardContent } from "@/components/ui/card"
import ProcedureCard from '@/app/(private)/slave/[headquartersId]/procedures/procedure-card'

export default function SlaveProceduresPage() {
  const { data: procedures } = useProceduresStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Available Procedures</h2>
        <p className="text-muted-foreground">Select the procedure you wish to perform</p>
      </div>

      {procedures.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No digital procedures available at this headquarters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {procedures.map((procedure) => (
            <ProcedureCard key={procedure.procedureId} procedure={procedure} />
          ))}
        </div>
      )}
    </div>
  )
}
