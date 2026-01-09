import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { addSolicitud, updateSolicitudEstado } from "@/lib/actions/solicitudes"
import { Solicitud } from "@/lib/types"

export function useCreateSolicitud() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addSolicitud,
    onSuccess: (result) => {
        if (result?.serverError || result?.validationErrors) {
             toast.error("Error creating solicitud")
             return
        }
        toast.success("Solicitud submitted successfully")
        // Invalidate both citizen and admin lists
        queryClient.invalidateQueries({ queryKey: ["solicitudes"] })
        queryClient.invalidateQueries({ queryKey: ["citizen-dashboard"] })
    },
    onError: () => {
       toast.error("Failed to submit solicitud")
    }
  })
}

export function useUpdateSolicitudInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSolicitudEstado,
    onMutate: async (vars) => {
        await queryClient.cancelQueries({ queryKey: ["solicitudes"] })
        const previousSolicitudes = queryClient.getQueryData<Solicitud[]>(["solicitudes"])

        if (previousSolicitudes) {
            queryClient.setQueryData<Solicitud[]>(["solicitudes"], previousSolicitudes.map(s => 
                s.id === vars.id ? { ...s, estado: vars.estado } : s
            ))
        }
        
        return { previousSolicitudes }
    },
    onSuccess: (result, vars, context) => {
        if (result?.serverError || result?.validationErrors) {
             toast.error("Error updating status")
             if (context?.previousSolicitudes) {
                queryClient.setQueryData(["solicitudes"], context.previousSolicitudes)
             }
             return
        }
        toast.success("Status updated successfully")
        queryClient.invalidateQueries({ queryKey: ["solicitudes"] })
    },
    onError: (err, vars, context) => {
        toast.error("Failed to update status")
        if (context?.previousSolicitudes) {
            queryClient.setQueryData(["solicitudes"], context.previousSolicitudes)
        }
    }
  })
}
