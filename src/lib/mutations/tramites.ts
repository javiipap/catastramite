import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { addTramiteType } from "@/lib/actions/tramites"
import { TramiteType } from "@/lib/types"

export function useCreateTramite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTramiteType,
    onMutate: async (newItem) => {
        await queryClient.cancelQueries({ queryKey: ["tramites"] })
        const previousTramites = queryClient.getQueryData<TramiteType[]>(["tramites"])
        
        if (previousTramites) {
             // Optimistic add
             const optTramite: any = {
                 id: "temp-" + Date.now(),
                 sedeId: newItem.sedeId,
                 nombre: newItem.nombre,
                 descripcion: newItem.descripcion,
                 campos: newItem.campos,
                 createdAt: new Date(),
                 createdBy: newItem.userId
             }
             queryClient.setQueryData(["tramites"], [...previousTramites, optTramite])
        }
        return { previousTramites }
    },
    onSuccess: (result, vars, context) => {
        if (result?.serverError || result?.validationErrors) {
             toast.error("Error creating tramite")
             if (context?.previousTramites) {
                queryClient.setQueryData(["tramites"], context.previousTramites)
             }
             return
        }
        toast.success("Tramite created successfully")
        queryClient.invalidateQueries({ queryKey: ["tramites"] })
    },
    onError: (err, vars, context) => {
        toast.error("Failed to create tramite")
        if (context?.previousTramites) {
            queryClient.setQueryData(["tramites"], context.previousTramites)
        }
    }
  })
}
