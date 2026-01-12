'use server';

import { useCases } from '@/use-cases';
import type { Request as AppRequest } from '@/lib/types';

export async function getRequests(headquartersId: string): Promise<AppRequest[]> {
  return useCases.requests.getRequests(headquartersId);
}

export async function getUserRequests(headquartersId: string, userId: string): Promise<AppRequest[]> {
   return useCases.requests.getUserRequests(headquartersId, userId);
}

export async function getRequestsByParams(params: { headquartersId: string }): Promise<AppRequest[]> {
  return getRequests(params.headquartersId);
}
