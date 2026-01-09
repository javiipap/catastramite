'use server';

import { readDB } from './index';
import type { Request } from '@/lib/types';

export async function getRequests(headquartersId: string): Promise<Request[]> {
  const db = await readDB();
  return db.requests.filter((r) => r.headquartersId === headquartersId);
}

export async function getUserRequests(headquartersId: string, userId: string): Promise<Request[]> {
  const db = await readDB();
  const userRequests = db.requests.filter(r => r.applicantId === userId && r.headquartersId === headquartersId);
  return userRequests;
}

export async function getRequestsByParams(params: { headquartersId: string }): Promise<Request[]> {
  return getRequests(params.headquartersId);
}
