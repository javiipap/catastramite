'use server';

import { useCases } from '@/use-cases';
import { UserHeadquarters } from '@/lib/types';
import { Headquarters } from '@/lib/types';

export async function getUserRole(userId: string, headquartersId: string): Promise<'master' | 'slave' | null> {
    return useCases.users.getUserRole(userId, headquartersId);
}

export async function getUserHeadquarters(userId: string): Promise<UserHeadquarters[]> {
  return useCases.users.getUserHeadquarters(userId);
}

export async function getUserHeadquartersObjects(userId: string): Promise<Headquarters[]> {
  return useCases.users.getUserHeadquartersObjects(userId);
}
