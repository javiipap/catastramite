"use client"

import { useState } from "react"
import { useHeadquartersStore } from "@/lib/queries/headquarters"
import { useProceduresStore } from "@/lib/queries/procedures"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQueryClient } from "@tanstack/react-query"
import type { FormField } from "@/lib/types"
import { useCreateProcedure } from "@/lib/mutations/procedures"

export default function AdminProceduresPage() {
  const { data: headquarters } = useHeadquartersStore()
  const { data: procedures } = useProceduresStore()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<Omit<FormField, "id">[]>([])
  const [newField, setNewField] = useState({
    name: "",
    type: "text" as FormField["type"],
    required: true,
  })

  // Filter is redundant if we assume layout provides correct context, but keeping logical consistency is fine
  // Actually no, `useProceduresStore` comes from `withServerData` which ALREADY filters by headquartersId on server.
  // So `procedures` IS the headquartersProcedures.
  const headquartersProcedures = procedures; 

  const addMutation = useCreateProcedure()

  const handleAddField = () => {
    if (newField.name) {
      setFields([...fields, newField])
      setNewField({ name: "", type: "text", required: true })
    }
  }

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (name && description && fields.length > 0 && user && headquarters) {
      addMutation.mutate({
        headquartersId: headquarters.id,
        name,
        description,
        fields: fields.map((c, i) => ({ ...c, id: `${i + 1}` })),
        userId: user.id,
      }, {
           onSuccess: () => {
               setName("")
               setDescription("")
               setFields([])
               setIsOpen(false)
           }
      })
    }
  }

  if (!headquarters) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Procedures</h2>
          <p className="text-muted-foreground">Manage available procedures for citizens</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Procedure Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Procedure Type</DialogTitle>
              <DialogDescription>Define details and form fields for this procedure</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Procedure Name</Label>
                <Input
                  id="name"
                  placeholder="Ex: Residence Certificate"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this procedure"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Form Fields</Label>
                  <span className="text-xs text-muted-foreground">{fields.length} fields added</span>
                </div>

                <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <Input
                        placeholder="Field name"
                        value={newField.name}
                        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                      />
                    </div>
                    <div className="col-span-4">
                      <Select
                        value={newField.type}
                        onValueChange={(value) =>
                          setNewField({ ...newField, type: value as FormField["type"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="textarea">Text Area</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Button onClick={handleAddField} className="w-full" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {fields.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      {fields.map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-background border">
                          <div className="flex-1">
                            <span className="text-sm font-medium">{field.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">({field.type})</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveField(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={!name || !description || fields.length === 0 || addMutation.isPending}
              >
                {addMutation.isPending ? "Creating..." : "Create Procedure Type"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {headquartersProcedures.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No procedure types created in this headquarters</p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create first procedure type
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {headquartersProcedures.map((procedure) => (
            <Card key={procedure.id} className="hover:shadow-lg transition-shadow">
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
          ))}
        </div>
      )}
    </div>
  )
}
