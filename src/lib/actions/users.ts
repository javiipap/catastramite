'use server';

import { readDB, writeDB } from '@/lib/db';
import { UserSede } from '@/lib/types';
import { Sede } from '@/lib/types';

export async function getUserSedes(userId: string): Promise<UserSede[]> {
  const db = await readDB();
  return db.userSedes.filter((us) => us.userId === userId);
}

// Helper to get Sede objects for a user (what the UI often needs)
export async function getUserSedeObjects(userId: string): Promise<Sede[]> {
  const db = await readDB();
  const userSedeIds = db.userSedes
    .filter((us) => us.userId === userId)
    .map((us) => us.sedeId);
  return db.sedes.filter((s) => userSedeIds.includes(s.id));
}

export async function addUserToSede(userSede: UserSede): Promise<UserSede> {
  const db = await readDB();
  // Check if exists
  const exists = db.userSedes.some(
    (us) => us.userId === userSede.userId && us.sedeId === userSede.sedeId
  );
  
  if (!exists) {
      db.userSedes.push(userSede);
      await writeDB(db);
  }
  
  return userSede;
}

export async function getUserRole(userId: string, sedeId: string): Promise<"administrador" | "administrado" | null> {
    const db = await readDB();
    const relation = db.userSedes.find((us) => us.userId === userId && us.sedeId === sedeId);
    return relation?.role || null;
}
