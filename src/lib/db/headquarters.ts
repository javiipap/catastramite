'use server';

import { db } from './index';
import type { Headquarters } from '@/lib/types';

export async function getHeadquarters(): Promise<Headquarters[]> {
  return db.getHeadquarters();
}


export async function getHeadquartersById(id: string): Promise<Headquarters | undefined> {
  return db.getHeadquartersById(id);
}

export async function getHeadquartersByParams(params: { headquartersId: string }): Promise<Headquarters | undefined> {
  return getHeadquartersById(params.headquartersId);
}
