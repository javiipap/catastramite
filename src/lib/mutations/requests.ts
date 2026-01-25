import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addRequestAction,
  updateRequestStatusAction,
} from "@/lib/actions/requests";
import type { Request } from "@/lib/types";

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRequestAction,
    onMutate: async (vars) => {
      await queryClient.cancelQueries({
        queryKey: ["requests", vars.headquartersId],
      });
      const previousRequests =
        queryClient.getQueryData<Request[]>([
          "requests",
          vars.headquartersId,
        ]) ?? [];

      queryClient.setQueryData<Request[]>(
        ["requests", vars.headquartersId],
        [
          ...previousRequests,
          {
            requestId: Date.now().toString(),
            headquartersId: vars.headquartersId,
            procedureId: vars.procedureId,
            procedureName: vars.procedureName,
            applicantId: vars.applicantId,
            applicantName: vars.applicantName,
            status: vars.status,
            data: vars.data,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      );

      return { previousRequests };
    },
    onSuccess: (result, vars, context) => {
      toast.success("Request submitted successfully");
      // Invalidate both slave and master lists

      queryClient.setQueryData<Request[]>(
        ["requests", vars.headquartersId],
        [...context.previousRequests, result],
      );

      queryClient.invalidateQueries({
        queryKey: ["requests", vars.headquartersId],
      });
      queryClient.invalidateQueries({
        queryKey: ["slave-dashboard", vars.headquartersId],
      });
      queryClient.invalidateQueries({
        queryKey: ["master-dashboard", vars.headquartersId],
      });
    },
    onError: (err, vars, context) => {
      toast.error("Failed to submit request");
      console.error(err);

      queryClient.setQueryData<Request[]>(
        ["requests", vars.headquartersId],
        context?.previousRequests ?? [],
      );
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRequestStatusAction,
    onMutate: async (vars) => {
      await queryClient.cancelQueries({
        queryKey: ["requests", vars.headquartersId],
      });
      const previousRequests =
        queryClient.getQueryData<Request[]>([
          "requests",
          vars.headquartersId,
        ]) ?? [];

      queryClient.setQueryData<Request[]>(
        ["requests", vars.headquartersId],
        previousRequests.map((r) =>
          r.requestId === vars.requestId ? { ...r, status: vars.status } : r,
        ),
      );

      return { previousRequests };
    },
    onSuccess: (result, vars, context) => {
      toast.success("Status updated successfully");

      queryClient.setQueryData<Request[]>(
        ["requests", vars.headquartersId],
        [...context.previousRequests, result],
      );

      queryClient.invalidateQueries({
        queryKey: ["requests", vars.headquartersId],
      });
      queryClient.invalidateQueries({
        queryKey: ["slave-dashboard", vars.headquartersId],
      });
      queryClient.invalidateQueries({
        queryKey: ["master-dashboard", vars.headquartersId],
      });
    },
    onError: (err, vars, context) => {
      toast.error("Failed to update status");
      console.error(err);

      if (context?.previousRequests) {
        queryClient.setQueryData(
          ["requests", vars.headquartersId],
          context.previousRequests,
        );
      }
    },
  });
}
