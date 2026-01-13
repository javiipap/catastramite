import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addRequestAction,
  updateRequestStatusAction,
} from "@/lib/actions/requests";
import { Request } from "@/lib/types";

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRequestAction,
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["requests"] });
      const previousRequests =
        queryClient.getQueryData<Request[]>(["requests"]) ?? [];

      queryClient.setQueryData<Request[]>(
        ["requests"],
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
        ]
      );

      return { previousRequests };
    },
    onSuccess: (result, vars, context) => {
      toast.success("Request submitted successfully");
      // Invalidate both slave and master lists

      queryClient.setQueryData<Request[]>(
        ["requests"],
        [...context.previousRequests, result]
      );

      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["slave-dashboard"] });
    },
    onError: (err, vars, context) => {
      toast.error("Failed to submit request");
      console.error(err);

      queryClient.setQueryData<Request[]>(
        ["requests"],
        context?.previousRequests ?? []
      );
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRequestStatusAction,
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["requests"] });
      const previousRequests =
        queryClient.getQueryData<Request[]>(["requests"]) ?? [];

      queryClient.setQueryData<Request[]>(
        ["requests"],
        previousRequests.map((r) =>
          r.requestId === vars.requestId ? { ...r, status: vars.status } : r
        )
      );

      return { previousRequests };
    },
    onSuccess: (result, vars, context) => {
      toast.success("Status updated successfully");

      queryClient.setQueryData<Request[]>(
        ["requests"],
        context.previousRequests
      );

      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (err, vars, context) => {
      toast.error("Failed to update status");
      console.error(err);

      if (context?.previousRequests) {
        queryClient.setQueryData(["requests"], context.previousRequests);
      }
    },
  });
}
