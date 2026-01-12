'use server';

import { useCases } from '@/use-cases';
import type { Headquarters } from '@/lib/types';

export async function getHeadquarters(): Promise<Headquarters[]> {
  return useCases.headquarters.getHeadquarters();
}

export async function getHeadquartersById(id: string): Promise<Headquarters | undefined> {
  return useCases.headquarters.getHeadquartersById(id);
}

export async function getHeadquartersByParams(params: { headquartersId: string }): Promise<Headquarters | undefined> {
  return getHeadquartersById(params.headquartersId);
}
