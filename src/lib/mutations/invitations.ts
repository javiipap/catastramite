import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createInvitationTokenAction } from "@/lib/actions/invitations";

export function useCreateInvitationToken() {
  return useMutation({
    mutationFn: createInvitationTokenAction,
    onSuccess: () => {
      toast.success("Invitation link generated successfully");
    },
    onError: (error) => {
      toast.error("Failed to generate invitation link");
      console.error("Invitation error:", error);
    },
  });
}
