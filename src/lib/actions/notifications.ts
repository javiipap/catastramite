"use server";

import { useCases } from "@/use-cases";
import { Notification as AppNotification } from "@/lib/schemas/notifications";
import { mutateMasterAction, slaveAction } from "@/lib/safe-action";
import {
  createNotificationSchema,
  getNotificationsSchema,
} from "@/lib/schemas/notifications";

export const addNotificationAction = mutateMasterAction(
  createNotificationSchema,
  async ({ headquartersId, title, message, priority }, { user }) => {
    const newNotification: AppNotification = {
      notificationId: Date.now().toString(),
      headquartersId,
      title,
      message,
      priority,
      createdAt: new Date(),
      createdBy: user.id,
    };

    return useCases.notifications.createNotification(newNotification, user);
  }
);

export const getNotificationsAction = slaveAction
  .inputSchema(getNotificationsSchema)
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.notifications.getNotifications({ headquartersId }, user);
  });
