'use server';

import { db } from './index';
import type { Procedure } from '@/lib/types';

export async function getProcedures(headquartersId: string): Promise<Procedure[]> {
  return db.getProcedures(headquartersId);
}

export async function getProceduresByParams(params: { headquartersId: string }): Promise<Procedure[]> {
  return getProcedures(params.headquartersId);
}