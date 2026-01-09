'use server';

import { getSede } from './headquarters';
import { getTramites } from './procedures';
import { getSolicitudes, getUserSolicitudes } from './requests';
import { Sede, TramiteType, Solicitud } from '@/lib/types';

export interface DashboardData {
  sede: Sede | undefined;
  tramites: TramiteType[];
  solicitudes: Solicitud[];
}

import { getUserRole } from './users';

export async function getAdminDashboardData(params: { sedeId: string }, userId: string): Promise<DashboardData> {
  const { sedeId } = params;
  
  // 1. Verify Role
  const role = await getUserRole(userId, sedeId);
  if (role !== 'administrador') {
      throw new Error('Unauthorized: User is not an administrator');
  }

  // 2. Fetch Data (Parallel)
  const [sede, tramites, solicitudes] = await Promise.all([
    getSede(sedeId),
    getTramites(sedeId),
    getSolicitudes(sedeId), // Admin sees all
  ]);

  return { sede, tramites, solicitudes };
}

export async function getCitizenDashboardData(params: { sedeId: string }, userId: string): Promise<DashboardData> {
  const { sedeId } = params;

  // 1. Verify Role (or just association)
  const role = await getUserRole(userId, sedeId);
  if (!role) {
      throw new Error('Unauthorized: User is not associated with this sede');
  }

  // 2. Fetch Data
  const [sede, tramites, solicitudes] = await Promise.all([
    getSede(sedeId),
    getTramites(sedeId),
    getUserSolicitudes(sedeId, userId), // Citizen sees only own
  ]);

  return { sede, tramites, solicitudes };
}
