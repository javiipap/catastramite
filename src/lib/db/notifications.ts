'use server';

import { readDB } from './index';
import type { Notification } from '@/lib/types';

export async function getNotifications(sedeId: string): Promise<Notification[]> {
  const db = await readDB();
  return db.notifications.filter((n) => n.sedeId === sedeId);
}

export async function getNotificationsByParams(params: { sedeId: string }): Promise<Notification[]> {
  return getNotifications(params.sedeId);
}
