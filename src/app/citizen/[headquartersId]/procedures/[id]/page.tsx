"use client"

import { useParams, useRouter } from "next/navigation"
import { useProceduresStore } from "@/lib/queries/procedures"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useCreateRequest } from "@/lib/mutations/requests"

export default function CitizenProcedurePage() {
  const params = useParams()
  const router = useRouter()
  const { data: procedures } = useProceduresStore()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState<Record<string, string>>({})

  // Find Procedure from store
  const procedure = procedures.find((p) => p.id === params.id)

  const addMutation = useCreateRequest()

  if (!procedure) {
    return (
      <div className="space-y-6">
        <Link href={`/citizen/${params.headquartersId}/procedures`}>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Procedures
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Procedure not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user && procedure) {
        addMutation.mutate({
        procedureId: procedure.id,
        procedureName: procedure.name,
        headquartersId: procedure.headquartersId,
        applicantId: user.id,
        applicantName: user.name,
        status: "pending",
        data: formData,
        userId: user.id
      }, {
          onSuccess: () => {
              router.push(`/citizen/${params.headquartersId}/requests`)
          }
      })
    }
  }

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const isFormValid = procedure.fields
    .filter((f) => f.required)
    .every((f) => formData[f.name] && formData[f.name].trim() !== "")

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href={`/citizen/${params.headquartersId}/procedures`}>
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Procedures
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{procedure.name}</CardTitle>
          <CardDescription>{procedure.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {procedure.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.name}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    rows={4}
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={!isFormValid || addMutation.isPending} className="flex-1">
                {addMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
              <Link href={`/citizen/${params.headquartersId}/procedures`} className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
