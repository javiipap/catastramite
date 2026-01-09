"use client"

import { useProceduresStore } from "@/lib/queries/procedures"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CitizenProceduresPage() {
  const { data: procedures } = useProceduresStore()
  const params = useParams()
  const headquartersId = params.headquartersId

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
            <Card key={procedure.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{procedure.name}</CardTitle>
                <CardDescription className="line-clamp-2">{procedure.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>Requirements: {procedure.fields.length} fields to complete</p>
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/citizen/${headquartersId}/procedures/${procedure.id}`}>Start Procedure</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
