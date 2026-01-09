'use server';

import { readDB } from './index';
import { UserSede } from '@/lib/types';
import { Sede } from '@/lib/types';

export async function getUserRole(userId: string, sedeId: string): Promise<"administrador" | "administrado" | null> {
    const db = await readDB();
    const relation = db.userSedes.find((us) => us.userId === userId && us.sedeId === sedeId);
    return relation?.role || null;
}

export async function getUserSedes(userId: string): Promise<UserSede[]> {
  const db = await readDB();
  return db.userSedes.filter((us) => us.userId === userId);
}

export async function getUserSedeObjects(userId: string): Promise<Sede[]> {
  const db = await readDB();
  const userSedeIds = db.userSedes
    .filter((us) => us.userId === userId)
    .map((us) => us.sedeId);
  return db.sedes.filter((s) => userSedeIds.includes(s.id));
}
