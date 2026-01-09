'use server';

import { readDB, writeDB } from '@/lib/db';
import { Notification } from '@/lib/types';

export async function getNotifications(sedeId: string): Promise<Notification[]> {
  const db = await readDB();
  return db.notifications.filter((n) => n.sedeId === sedeId);
}

import { getUserRole } from './users';

export async function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>, userId: string): Promise<Notification> {
  const role = await getUserRole(userId, notification.sedeId);
  if (role !== 'administrador') {
      throw new Error('Unauthorized: Only administrators can create notifications');
  }

  const db = await readDB();
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  
  db.notifications.push(newNotification);
  await writeDB(db);
  return newNotification;
}

export async function getNotificationsByParams(params: { sedeId: string }): Promise<Notification[]> {
  return getNotifications(params.sedeId);
}
