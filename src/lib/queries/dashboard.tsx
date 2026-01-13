'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getMasterDashboardDataAction, getSlaveDashboardDataAction } from '@/lib/actions/dashboard';
import { DashboardData } from '@/lib/types';

export const { Provider: MasterDashboardProvider, useStore: useMasterDashboardStore } =
  createQueryStore<DashboardData, { headquartersId: string }>({
    baseQueryKey: ['master-dashboard'],
    clientFetcher: async ({ headquartersId }) => {
      const result = await getMasterDashboardDataAction({ headquartersId });
      if (result?.serverError) throw result.serverError;
      return result?.data as DashboardData;
    },
  });

export const { Provider: SlaveDashboardProvider, useStore: useSlaveDashboardStore } =
  createQueryStore<DashboardData, { headquartersId: string }>({
    baseQueryKey: ['slave-dashboard'],
    clientFetcher: async ({ headquartersId }) => {
      const result = await getSlaveDashboardDataAction({ headquartersId });
      if (result?.serverError) throw result.serverError;
      return result?.data as DashboardData;
    },
  });
