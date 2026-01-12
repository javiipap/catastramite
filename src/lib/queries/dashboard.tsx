'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getAdminDashboardDataAction, getSlaveDashboardDataAction } from '@/lib/actions/dashboard';
import { DashboardData } from '@/lib/types';

export const { Provider: AdminDashboardProvider, useStore: useAdminDashboardStore } =
  createQueryStore<DashboardData, { headquartersId: string }>({
    baseQueryKey: ['admin-dashboard'],
    clientFetcher: async ({ headquartersId }) => getAdminDashboardDataAction({ headquartersId }),
  });

export const { Provider: SlaveDashboardProvider, useStore: useSlaveDashboardStore } =
  createQueryStore<DashboardData, { headquartersId: string }>({
    baseQueryKey: ['slave-dashboard'],
    clientFetcher: async ({ headquartersId }) => getSlaveDashboardDataAction({ headquartersId }),
  });
