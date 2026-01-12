'use server';

import { db } from './index';
import type { Request as AppRequest } from '@/lib/types';

export async function getRequests(headquartersId: string): Promise<AppRequest[]> {
  return db.getRequests(headquartersId);
}

export async function getUserRequests(headquartersId: string, userId: string): Promise<AppRequest[]> {
   return db.getUserRequests(headquartersId, userId);
}

export async function getRequestsByParams(params: { headquartersId: string }): Promise<AppRequest[]> {
  return getRequests(params.headquartersId);
}
