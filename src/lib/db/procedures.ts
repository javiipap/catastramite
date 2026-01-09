'use server';

import type { Procedure } from '@/lib/types';
import { readDB } from './index';

export async function getProcedures(headquartersId: string): Promise<Procedure[]> {
  const db = await readDB();
  return db.procedures.filter((p) => p.headquartersId === headquartersId);
}

export async function getProceduresByParams(params: { headquartersId: string }): Promise<Procedure[]> {
  return getProcedures(params.headquartersId);
}