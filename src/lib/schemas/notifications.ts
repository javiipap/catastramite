import { z } from 'zod';

export const notificationSchema = z.object({
  notificationId: z.string(),
  headquartersId: z.string(),
  title: z.string(),
  message: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  createdAt: z.date(),
  createdBy: z.string(),
});

export const createNotificationSchema = notificationSchema.pick({
  headquartersId: true,
  title: true,
  message: true,
  priority: true,
});

export const getNotificationsSchema = z.object({
  headquartersId: z.string(),
});

export type Notification = z.infer<typeof notificationSchema>;
