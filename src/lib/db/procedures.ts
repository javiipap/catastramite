'use server';

import { db } from '@/lib/db';
import type { Procedure } from '@/lib/types';

export async function getProcedures(headquartersId: string): Promise<Procedure[]> {
  return db.getProcedures(headquartersId);
}