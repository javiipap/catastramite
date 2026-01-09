import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createHeadquarters, updateHeadquarters } from "@/lib/actions/headquarters"
import { Headquarters } from "@/lib/types"

export function useCreateHeadquarters() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createHeadquarters,
    onMutate: async (newItem) => {
        // Optimistic Update
        await queryClient.cancelQueries({ queryKey: ["headquarters"] })
        const previousHeadquarters = queryClient.getQueryData<Headquarters[]>(["headquarters"])
        
        // Optimistically add
        if (previousHeadquarters && newItem) {
            queryClient.setQueryData<Headquarters[]>(["headquarters"], [
                ...previousHeadquarters,
                {
                    id: "temp-id-" + Date.now(),
                    name: newItem.name,
                    description: newItem.description,
                    createdAt: new Date(),
                    userHeadquarters: [] // Optimistically this user is admin
                } as Headquarters
            ])
        }

        return { previousHeadquarters }
    },
    onSuccess: (result) => {
        if (result?.serverError) {
             toast.error("Error creating headquarters: " + result.serverError)
             return
        }
        if (result?.validationErrors) {
             toast.error("Validation error creating headquarters")
             return
        }
        toast.success("Headquarters created successfully")
        queryClient.invalidateQueries({ queryKey: ["headquarters"] })
    },
    onError: (err, newItem, context) => {
       toast.error("Failed to create headquarters")
       if (context?.previousHeadquarters) {
         queryClient.setQueryData(["headquarters"], context.previousHeadquarters)
       }
    }
  })
}

export function useUpdateHeadquarters() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateHeadquarters,
        onSuccess: (result) => {
             if (result?.serverError || result?.validationErrors) {
                  toast.error("Error updating headquarters")
             } else {
                  toast.success("Headquarters updated successfully")
                  queryClient.invalidateQueries({ queryKey: ["headquarters"] })
                  // Also invalidate specific query
                  if (result.data?.id) {
                     queryClient.invalidateQueries({ queryKey: ["headquarters", result.data.id] })
                  }
             }
        },
        onError: () => toast.error("Failed to update headquarters")
    })
}
