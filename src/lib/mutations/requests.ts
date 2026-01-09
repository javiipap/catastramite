import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { addRequest, updateRequestStatus } from "@/lib/actions/requests"
import { Request } from "@/lib/types"

export function useCreateRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addRequest,
    onSuccess: (result) => {
        if (result?.serverError || result?.validationErrors) {
             toast.error("Error creating request")
             return
        }
        toast.success("Request submitted successfully")
        // Invalidate both slave and admin lists
        queryClient.invalidateQueries({ queryKey: ["requests"] })
        queryClient.invalidateQueries({ queryKey: ["slave-dashboard"] })
    },
    onError: () => {
       toast.error("Failed to submit request")
    }
  })
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateRequestStatus,
    onMutate: async (vars) => {
        await queryClient.cancelQueries({ queryKey: ["requests"] })
        const previousRequests = queryClient.getQueryData<Request[]>(["requests"])

        if (previousRequests) {
            queryClient.setQueryData<Request[]>(["requests"], previousRequests.map(r => 
                r.id === vars.id ? { ...r, status: vars.status } : r
            ))
        }
        
        return { previousRequests }
    },
    onSuccess: (result, vars, context) => {
        if (result?.serverError || result?.validationErrors) {
             toast.error("Error updating status")
             if (context?.previousRequests) {
                queryClient.setQueryData(["requests"], context.previousRequests)
             }
             return
        }
        toast.success("Status updated successfully")
        queryClient.invalidateQueries({ queryKey: ["requests"] })
    },
    onError: (err, vars, context) => {
        toast.error("Failed to update status")
        if (context?.previousRequests) {
            queryClient.setQueryData(["requests"], context.previousRequests)
        }
    }
  })
}
