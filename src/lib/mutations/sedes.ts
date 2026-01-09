import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createSede, updateSede } from "@/lib/actions/sedes"
import { Sede } from "@/lib/types"

export function useCreateSede() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSede,
    onMutate: async (newItem) => {
        // Optimistic Update
        await queryClient.cancelQueries({ queryKey: ["sedes"] })
        const previousSedes = queryClient.getQueryData<Sede[]>(["sedes"])
        
        // Optimistically add
        // Note: actions expect validated input object as arg, but `useMutation` receives variables.
        // `createSede` is a safe-action client function.
        // It takes { nombre, descripcion, userId }
        
        if (previousSedes && newItem) {
            queryClient.setQueryData<Sede[]>(["sedes"], [
                ...previousSedes,
                {
                    id: "temp-id-" + Date.now(),
                    nombre: newItem.nombre,
                    descripcion: newItem.descripcion,
                    createdAt: new Date(),
                    userSedes: [] // Optimistically this user is admin, but relation object format is complex
                } as Sede
            ])
        }

        return { previousSedes }
    },
    onSuccess: (result) => {
        if (result?.serverError) {
             toast.error("Error creating sede: " + result.serverError)
             return
        }
        if (result?.validationErrors) {
             toast.error("Validation error creating sede")
             return
        }
        toast.success("Sede created successfully")
        queryClient.invalidateQueries({ queryKey: ["sedes"] })
    },
    onError: (err, newItem, context) => {
       toast.error("Failed to create sede")
       if (context?.previousSedes) {
         queryClient.setQueryData(["sedes"], context.previousSedes)
       }
    }
  })
}

export function useUpdateSede() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateSede,
        onSuccess: (result) => {
             if (result?.serverError || result?.validationErrors) {
                  toast.error("Error updating sede")
             } else {
                  toast.success("Sede updated successfully")
                  queryClient.invalidateQueries({ queryKey: ["sedes"] })
                  // Also invalidate specific sede query
                  if (result.data?.id) {
                     queryClient.invalidateQueries({ queryKey: ["sede", result.data.id] })
                  }
             }
        },
        onError: () => toast.error("Failed to update sede")
    })
}
