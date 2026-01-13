'use server';

import { useCases } from '@/use-cases';
import { DashboardData } from '@/lib/types';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function getMasterDashboardDataAction(params: {
  headquartersId: string;
}): Promise<DashboardData> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error('Unauthorized');

  return useCases.dashboard.getMasterDashboardData(params, {
    userId: session.user.id,
  });
}

export async function getSlaveDashboardDataAction(params: {
  headquartersId: string;
}): Promise<DashboardData> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error('Unauthorized');

  return useCases.dashboard.getSlaveDashboardData(params, {
    userId: session.user.id,
  });
}
