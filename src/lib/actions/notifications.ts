'use server';

import { useCases } from '@/use-cases';
import { Notification as AppNotification } from '@/lib/types';
import { adminAction } from '@/lib/safe-action';
import * as v from 'valibot';

const addNotificationSchema = v.object({
  headquartersId: v.string(),
  title: v.string(),
  message: v.string(),
  priority: v.picklist(["low", "medium", "high"]),
  userId: v.string(), // For admin check and creation
});

export const addNotification = adminAction
    .inputSchema(addNotificationSchema)
    .action(async ({ parsedInput: { headquartersId, title, message, priority, userId } }) => {
        const newNotification: AppNotification = {
            id: Date.now().toString(),
            headquartersId,
            title,
            message,
            priority,
            createdAt: new Date(),
            createdBy: userId
        };
        
        return useCases.notifications.createNotification(newNotification);
    });
