'use server';

import { useCases } from '@/use-cases';
import { Notification as AppNotification } from '@/lib/types';
import { masterAction, slaveAction } from '@/lib/safe-action';
import * as v from 'valibot';

const addNotificationSchema = v.object({
  headquartersId: v.string(),
  title: v.string(),
  message: v.string(),
  priority: v.picklist(['low', 'medium', 'high']),
});

export const addNotification = masterAction
  .inputSchema(addNotificationSchema)
  .action(
    async ({
      parsedInput: { headquartersId, title, message, priority },
      ctx: { user },
    }) => {
      const newNotification: AppNotification = {
        id: Date.now().toString(),
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
  .inputSchema(v.object({ headquartersId: v.string() }))
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.notifications.getNotifications({ headquartersId }, user);
  });
