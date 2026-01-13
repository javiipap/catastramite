import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createHeadquarters,
  updateHeadquarters,
} from "@/lib/actions/headquarters";
import { Headquarters } from "@/lib/types";

export function useCreateHeadquarters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHeadquarters,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({
        queryKey: ["master-headquarters-list"],
      });
      const previousHeadquarters =
        queryClient.getQueryData<Headquarters[]>([
          "master-headquarters-list",
        ]) ?? [];

      if (previousHeadquarters && newItem) {
        queryClient.setQueryData<Headquarters[]>(
          ["master-headquarters-list"],
          [
            ...previousHeadquarters,
            {
              headquartersId: "temp-id-" + Date.now(),
              name: newItem.name,
              description: newItem.description,
              createdAt: new Date(),
              userHeadquarters: [],
            },
          ]
        );
      }

      return { previousHeadquarters };
    },
    onSuccess: (result, newItem, context) => {
      toast.success("Headquarters created successfully");
      queryClient.setQueryData<Headquarters[]>(
        ["master-headquarters-list"],
        [...(context.previousHeadquarters || []), result]
      );

      queryClient.invalidateQueries({ queryKey: ["master-headquarters-list"] });
    },
    onError: (err, newItem, context) => {
      toast.error("Failed to create headquarters");

      if (context?.previousHeadquarters) {
        queryClient.setQueryData(
          ["master-headquarters-list"],
          context.previousHeadquarters
        );
      }
    },
  });
}

export function useUpdateHeadquarters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHeadquarters,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({
        queryKey: ["master-headquarters-list"],
      });
      const previousHeadquarters =
        queryClient.getQueryData<Headquarters[]>([
          "master-headquarters-list",
        ]) ?? [];

      queryClient.setQueryData<Headquarters[]>(
        ["master-headquarters-list"],
        [
          ...previousHeadquarters,
          {
            headquartersId: "temp-id-" + Date.now(),
            name: newItem.name,
            description: newItem.description,
            createdAt: new Date(),
            userHeadquarters: [],
          },
        ]
      );

      return { previousHeadquarters };
    },
    onSuccess: (result, newItem, context) => {
      toast.success("Headquarters updated successfully");
      queryClient.setQueryData<Headquarters[]>(
        ["master-headquarters-list"],
        [...(context.previousHeadquarters || []), result]
      );

      queryClient.invalidateQueries({ queryKey: ["master-headquarters-list"] });
      queryClient.invalidateQueries({
        queryKey: ["master-headquarters-list", result.headquartersId],
      });
    },
    onError: (err, newItem, context) => {
      toast.error("Failed to update headquarters");

      if (context?.previousHeadquarters) {
        queryClient.setQueryData(
          ["master-headquarters-list"],
          context.previousHeadquarters
        );
      }
    },
  });
}
