"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Procedure } from "@/lib/types"

interface Props {
  procedure: Procedure;
}

export default function ProcedureCard({ procedure }: Props) {
  const { name, description, fields, procedureId, headquartersId } = procedure;

  return (
    <Card key={procedureId} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Requirements: {fields.length} fields to complete</p>
        </div>
        <Button className="w-full" asChild>
          <Link href={`/slave/${headquartersId}/procedures/${procedureId}`}>Start Procedure</Link>
        </Button>
      </CardContent>
    </Card>
  )
}