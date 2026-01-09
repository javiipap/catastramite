'use server';

import { readDB, writeDB } from '@/lib/db';
import { Notification } from '@/lib/types';
import { adminAction } from '@/lib/safe-action';
import * as v from 'valibot';

const addNotificationSchema = v.object({
  sedeId: v.string(),
  title: v.string(),
  message: v.string(),
  priority: v.picklist(["low", "medium", "high"]),
  userId: v.string(), // For admin check and creation
});

export const addNotification = adminAction
    .inputSchema(addNotificationSchema)
    .action(async ({ parsedInput: { sedeId, title, message, priority, userId } }) => {
        const db = await readDB();
        const newNotification: Notification = {
            id: Date.now().toString(),
            sedeId,
            title,
            message,
            priority,
            createdAt: new Date(),
            createdBy: userId
        };
        
        db.notifications.push(newNotification);
        await writeDB(db);
        return newNotification;
    });
