'use server';

import { useCases } from '@/use-cases';
import { Headquarters, Procedure, Request } from '@/lib/types';

export interface DashboardData {
  headquarters: Headquarters | undefined;
  procedures: Procedure[];
  requests: Request[];
}

export async function getAdminDashboardData(params: { headquartersId: string }, userId: string): Promise<DashboardData> {
  const { headquartersId } = params;
  
  // 1. Verify Role
  const role = await useCases.users.getUserRole(userId, headquartersId);
  if (role !== 'master') {
      throw new Error('Unauthorized: User is not an administrator');
  }

  // 2. Fetch Data (Parallel)
  const [headquarters, procedures, requests] = await Promise.all([
    useCases.headquarters.getHeadquartersById(headquartersId),
    useCases.procedures.getProcedures(headquartersId),
    useCases.requests.getRequests(headquartersId), // Admin sees all
  ]);

  return { headquarters, procedures, requests };
}

export async function getSlaveDashboardData(params: { headquartersId: string }, userId: string): Promise<DashboardData> {
  const { headquartersId } = params;

  // 1. Verify Role (or just association)
  const role = await useCases.users.getUserRole(userId, headquartersId);
  if (!role) {
      throw new Error('Unauthorized: User is not associated with this headquarters');
  }

  // 2. Fetch Data
  const [headquarters, procedures, requests] = await Promise.all([
    useCases.headquarters.getHeadquartersById(headquartersId),
    useCases.procedures.getProcedures(headquartersId),
    useCases.requests.getUserRequests(headquartersId, userId), // Slave sees only own
  ]);

  return { headquarters, procedures, requests };
}
