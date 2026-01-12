'use server';

import { db } from './index';
import type { Notification } from '@/lib/types';

export async function getNotifications(headquartersId: string): Promise<Notification[]> {
  return db.getNotifications(headquartersId);
}

export async function getNotificationsByParams(params: { headquartersId: string }): Promise<Notification[]> {
  return getNotifications(params.headquartersId);
}
