'use server';

import type { TramiteType } from '@/lib/types';
import { readDB } from './index';

export async function getTramites(sedeId: string): Promise<TramiteType[]> {
  const db = await readDB();
  return db.tramiteTypes.filter((t) => t.sedeId === sedeId);
}

export async function getTramitesByParams(params: { sedeId: string }): Promise<TramiteType[]> {
  return getTramites(params.sedeId);
}