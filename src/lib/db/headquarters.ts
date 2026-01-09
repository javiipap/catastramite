'use server';

import { readDB } from './index';
import type { Headquarters } from '@/lib/types';

export async function getHeadquarters(): Promise<Headquarters[]> {
  const db = await readDB();
  return db.headquarters.map(hq => ({
    ...hq,
    userHeadquarters: db.userHeadquarters.filter(uh => uh.headquartersId === hq.id)
  }));
}

export async function getHeadquartersById(id: string): Promise<Headquarters | undefined> {
  const db = await readDB();
  const headquarters = db.headquarters.find((h) => h.id === id);
  if (headquarters) {
     return {
         ...headquarters,
         userHeadquarters: db.userHeadquarters.filter(uh => uh.headquartersId === headquarters.id)
     }
  }
  return undefined;
}

export async function getHeadquartersByParams(params: { headquartersId: string }): Promise<Headquarters | undefined> {
  return getHeadquartersById(params.headquartersId);
}
