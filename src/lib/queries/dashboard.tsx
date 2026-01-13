'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getMasterDashboardDataAction, getSlaveDashboardDataAction } from '@/lib/actions/dashboard';
import { DashboardData } from '@/lib/types';

export const { Provider: MasterDashboardProvider, useStore: useMasterDashboardStore } =
  createQueryStore<DashboardData, { headquartersId: string }>({
    baseQueryKey: ['master-dashboard'],
    clientFetcher: async ({ headquartersId }) => getMasterDashboardDataAction({ headquartersId }),
  });

export const { Provider: SlaveDashboardProvider, useStore: useSlaveDashboardStore } =
  createQueryStore<DashboardData, { headquartersId: string }>({
    baseQueryKey: ['slave-dashboard'],
    clientFetcher: async ({ headquartersId }) => getSlaveDashboardDataAction({ headquartersId }),
  });
