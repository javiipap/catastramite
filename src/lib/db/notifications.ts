'use server';

import { db } from '@/lib/db';
import type { Notification } from '@/lib/types';

export async function getNotifications(headquartersId: string): Promise<Notification[]> {
  return db.getNotifications(headquartersId);
}
