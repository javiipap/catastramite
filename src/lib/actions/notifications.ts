"use server";

import { useCases } from "@/use-cases";
import type { Notification as AppNotification } from "@/lib/schemas/notifications";
import { mutateHeadquartersAction, slaveAction } from "@/lib/safe-action";
import {
  createNotificationSchema,
  getNotificationsSchema,
} from "@/lib/schemas/notifications";

export const addNotificationAction = mutateHeadquartersAction(
  createNotificationSchema,
  async ({ headquartersId, title, message, priority }, { user }) => {
    const newNotification: AppNotification = {
      notificationId: Date.now().toString(),
      headquartersId,
      title,
      message,
      priority,
      createdAt: new Date(),
      createdBy: user.userId,
    };

    return useCases.notifications.createNotification(newNotification, user);
  },
);

export const getNotificationsAction = slaveAction
  .inputSchema(getNotificationsSchema)
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.notifications.getNotifications({ headquartersId }, user);
  });
