'use server';

import { getHeadquartersById } from './headquarters';
import { getProcedures } from './procedures';
import { getRequests, getUserRequests } from './requests';
import { Headquarters, Procedure, Request } from '@/lib/types';

export interface DashboardData {
  headquarters: Headquarters | undefined;
  procedures: Procedure[];
  requests: Request[];
}

import { getUserRole } from './users';

export async function getAdminDashboardData(params: { headquartersId: string }, userId: string): Promise<DashboardData> {
  const { headquartersId } = params;
  
  // 1. Verify Role
  const role = await getUserRole(userId, headquartersId);
  if (role !== 'admin') {
      throw new Error('Unauthorized: User is not an administrator');
  }

  // 2. Fetch Data (Parallel)
  const [headquarters, procedures, requests] = await Promise.all([
    getHeadquartersById(headquartersId),
    getProcedures(headquartersId),
    getRequests(headquartersId), // Admin sees all
  ]);

  return { headquarters, procedures, requests };
}

export async function getCitizenDashboardData(params: { headquartersId: string }, userId: string): Promise<DashboardData> {
  const { headquartersId } = params;

  // 1. Verify Role (or just association)
  const role = await getUserRole(userId, headquartersId);
  if (!role) {
      throw new Error('Unauthorized: User is not associated with this headquarters');
  }

  // 2. Fetch Data
  const [headquarters, procedures, requests] = await Promise.all([
    getHeadquartersById(headquartersId),
    getProcedures(headquartersId),
    getUserRequests(headquartersId, userId), // Citizen sees only own
  ]);

  return { headquarters, procedures, requests };
}
