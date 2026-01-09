import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { addNotification } from "@/lib/actions/notifications"
import { Notification } from "@/lib/types"

export function useCreateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addNotification,
    onMutate: async (newItem) => {
        await queryClient.cancelQueries({ queryKey: ["notifications"] })
        const previousNotifications = queryClient.getQueryData<Notification[]>(["notifications"])
        
        if (previousNotifications) {
            const optNotif: any = {
                id: "temp-" + Date.now(),
                sedeId: newItem.sedeId,
                title: newItem.title,
                message: newItem.message,
                priority: newItem.priority,
                createdAt: new Date(),
                createdBy: newItem.userId
            }
            queryClient.setQueryData(["notifications"], [...previousNotifications, optNotif])
        }
        
        return { previousNotifications }
    },
    onSuccess: (result, vars, context) => {
        if (result?.serverError || result?.validationErrors) {
             toast.error("Error creating notification")
             if (context?.previousNotifications) {
                queryClient.setQueryData(["notifications"], context.previousNotifications)
             }
             return
        }
        toast.success("Notification created successfully")
        queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
    onError: (err, vars, context) => {
        toast.error("Failed to create notification")
        if (context?.previousNotifications) {
            queryClient.setQueryData(["notifications"], context.previousNotifications)
        }
    }
  })
}
