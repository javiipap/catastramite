import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addNotificationAction } from "@/lib/actions/notifications";
import { Notification } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export function useCreateNotification() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: addNotificationAction,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({
        queryKey: ["notifications", newItem.headquartersId],
      });
      const previousNotifications =
        queryClient.getQueryData<Notification[]>([
          "notifications",
          newItem.headquartersId,
        ]) ?? [];

      const optNotif: Notification = {
        notificationId: "temp-" + Date.now(),
        headquartersId: newItem.headquartersId,
        title: newItem.title,
        message: newItem.message,
        priority: newItem.priority,
        createdAt: new Date(),
        createdBy: user?.userId || "",
      };
      queryClient.setQueryData<Notification[]>(
        ["notifications", newItem.headquartersId],
        [...previousNotifications, optNotif],
      );

      return { previousNotifications };
    },
    onSuccess: (result, vars, context) => {
      toast.success("Notification created successfully");

      queryClient.setQueryData(
        ["notifications", vars.headquartersId],
        [...(context.previousNotifications ?? []), result],
      );

      queryClient.invalidateQueries({
        queryKey: ["notifications", vars.headquartersId],
      });
    },
    onError: (err, vars, context) => {
      toast.error("Failed to create notification");
      console.error(err);

      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications", vars.headquartersId],
          context.previousNotifications,
        );
      }
    },
  });
}
