import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addProcedure } from "@/lib/actions/procedures";
import { Procedure } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export function useCreateProcedure() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: addProcedure,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["procedures"] });
      const previousProcedures =
        queryClient.getQueryData<Procedure[]>(["procedures"]) ?? [];

      const optProcedure: any = {
        id: "temp-" + Date.now(),
        headquartersId: newItem.headquartersId,
        name: newItem.name,
        description: newItem.description,
        fields: newItem.fields,
        createdAt: new Date(),
        createdBy: user?.userId || "",
      };
      queryClient.setQueryData(
        ["procedures"],
        [...previousProcedures, optProcedure]
      );

      return { previousProcedures };
    },
    onSuccess: (result, vars, context) => {
      toast.success("Procedure created successfully");

      queryClient.setQueryData<Procedure[]>(
        ["procedures"],
        [...(context?.previousProcedures || []), result]
      );

      queryClient.invalidateQueries({ queryKey: ["procedures"] });
    },
    onError: (err, vars, context) => {
      toast.error("Failed to create procedure");
      console.error(err);

      if (context?.previousProcedures) {
        queryClient.setQueryData<Procedure[]>(
          ["procedures"],
          context.previousProcedures
        );
      }
    },
  });
}
