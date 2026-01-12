'use server';

import { useCases } from '@/use-cases';
import type { Procedure } from '@/lib/types';

export async function getProcedures(headquartersId: string): Promise<Procedure[]> {
  return useCases.procedures.getProcedures(headquartersId);
}

export async function getProceduresByParams(params: { headquartersId: string }): Promise<Procedure[]> {
  return getProcedures(params.headquartersId);
}