'use server';

import { db } from './index';
import { UserHeadquarters } from '@/lib/types';
import { Headquarters } from '@/lib/types';

export async function getUserRole(userId: string, headquartersId: string): Promise<'master' | 'slave' | null> {
    return db.getUserRole(userId, headquartersId);
}

export async function getUserHeadquarters(userId: string): Promise<UserHeadquarters[]> {
  return db.getUserHeadquarters(userId);
}

export async function getUserHeadquartersObjects(userId: string): Promise<Headquarters[]> {
  return db.getUserHeadquartersObjects(userId);
}
