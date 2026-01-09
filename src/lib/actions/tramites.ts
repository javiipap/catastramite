'use server';

import { readDB, writeDB } from '@/lib/db';
import { TramiteType } from '@/lib/types';

export async function getTramites(sedeId: string): Promise<TramiteType[]> {
  const db = await readDB();
  return db.tramiteTypes.filter((t) => t.sedeId === sedeId);
}

import { getUserRole } from './users';

export async function addTramiteType(tramite: Omit<TramiteType, 'id' | 'createdAt'>, userId: string): Promise<TramiteType> {
  const role = await getUserRole(userId, tramite.sedeId);
  if (role !== 'administrador') {
      throw new Error('Unauthorized: Only administrators can create tramites');
  }

  const db = await readDB();
  const newTramite: TramiteType = {
    ...tramite,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  
  db.tramiteTypes.push(newTramite);
  await writeDB(db);
  return newTramite;
}

export async function getTramitesByParams(params: { sedeId: string }): Promise<TramiteType[]> {
  return getTramites(params.sedeId);
}
