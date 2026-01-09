'use server';

import { readDB } from './index';
import type { Notification } from '@/lib/types';

export async function getNotifications(headquartersId: string): Promise<Notification[]> {
  const db = await readDB();
  return db.notifications.filter((n) => n.headquartersId === headquartersId);
}

export async function getNotificationsByParams(params: { headquartersId: string }): Promise<Notification[]> {
  return getNotifications(params.headquartersId);
}
