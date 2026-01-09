'use server';

import { readDB } from './index';
import type { Sede } from '@/lib/types';

export async function getSedes(): Promise<Sede[]> {
  const db = await readDB();
  return db.sedes.map(sede => ({
    ...sede,
    userSedes: db.userSedes.filter(us => us.sedeId === sede.id)
  }));
}

export async function getSede(id: string): Promise<Sede | undefined> {
  const db = await readDB();
  const sede = db.sedes.find((s) => s.id === id);
  if (sede) {
     return {
         ...sede,
         userSedes: db.userSedes.filter(us => us.sedeId === sede.id)
     }
  }
  return undefined;
}

export async function getSedeByParams(params: { sedeId: string }): Promise<Sede | undefined> {
  return getSede(params.sedeId);
}
