'use server';

import { readDB } from './index';
import { UserHeadquarters } from '@/lib/types';
import { Headquarters } from '@/lib/types';

export async function getUserRole(userId: string, headquartersId: string): Promise<"admin" | "citizen" | null> {
    const db = await readDB();
    const relation = db.userHeadquarters.find((uh) => uh.userId === userId && uh.headquartersId === headquartersId);
    return relation?.role || null;
}

export async function getUserHeadquarters(userId: string): Promise<UserHeadquarters[]> {
  const db = await readDB();
  return db.userHeadquarters.filter((uh) => uh.userId === userId);
}

export async function getUserHeadquartersObjects(userId: string): Promise<Headquarters[]> {
  const db = await readDB();
  const userHeadquartersIds = db.userHeadquarters
    .filter((uh) => uh.userId === userId)
    .map((uh) => uh.headquartersId);
  return db.headquarters.filter((h) => userHeadquartersIds.includes(h.id));
}
