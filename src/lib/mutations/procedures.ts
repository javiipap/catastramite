import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { addProcedure } from "@/lib/actions/procedures"
import { Procedure } from "@/lib/types"

export function useCreateProcedure() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addProcedure,
    onMutate: async (newItem) => {
        await queryClient.cancelQueries({ queryKey: ["procedures"] })
        const previousProcedures = queryClient.getQueryData<Procedure[]>(["procedures"])
        
        if (previousProcedures) {
             // Optimistic add
             const optProcedure: any = {
                 id: "temp-" + Date.now(),
                 headquartersId: newItem.headquartersId,
                 name: newItem.name,
                 description: newItem.description,
                 fields: newItem.fields,
                 createdAt: new Date(),
                 createdBy: newItem.userId
             }
             queryClient.setQueryData(["procedures"], [...previousProcedures, optProcedure])
        }
        return { previousProcedures }
    },
    onSuccess: (result, vars, context) => {
        if (result?.serverError || result?.validationErrors) {
             toast.error("Error creating procedure")
             if (context?.previousProcedures) {
                queryClient.setQueryData(["procedures"], context.previousProcedures)
             }
             return
        }
        toast.success("Procedure created successfully")
        queryClient.invalidateQueries({ queryKey: ["procedures"] })
    },
    onError: (err, vars, context) => {
        toast.error("Failed to create procedure")
        if (context?.previousProcedures) {
            queryClient.setQueryData(["procedures"], context.previousProcedures)
        }
    }
  })
}
