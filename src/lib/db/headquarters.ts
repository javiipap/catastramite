'use server';

import { db } from '@/lib/db';
import type { Headquarters } from '@/lib/types';

export async function getHeadquarters(): Promise<Headquarters[]> {
  return db.getHeadquarters();
}

export async function getHeadquartersById(id: string): Promise<Headquarters | undefined> {
  return db.getHeadquartersById(id);
}
