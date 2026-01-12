'use server';

import { useCases } from '@/use-cases';
import type { Notification } from '@/lib/types';

export async function getNotifications(headquartersId: string): Promise<Notification[]> {
  return useCases.notifications.getNotifications(headquartersId);
}

export async function getNotificationsByParams(params: { headquartersId: string }): Promise<Notification[]> {
  return getNotifications(params.headquartersId);
}
