'use client';

// This store is deprecated or needs to be refactored to support passing userId.
// Since createQueryStore makes a static client fetcher, we can't easily pass the user ID from the component 
// unless we change the store signature or just use the actions directly in the components via standard React Query or SWR.
// However, to maintain the pattern, we'll create separate stores if needed, or better yet,
// since we now moved logic to Page components (Server Views) or using React Query directly in Client Components,
// let's verify where useDashboardStore is used.
// It was used in DashboardView, which is now replaced by Page.
// The new Page architecture should probably fetch data on the server or use the new actions directly with useQuery.

import { createQueryStore } from '@/lib/store/create-query';
import { getAdminDashboardData, getCitizenDashboardData, DashboardData } from '@/lib/actions/dashboard';

// We need a way to pass userId to these. The current createQueryStore helper
// takes params object. We can include userId in params.

export const { Provider: AdminDashboardProvider, useStore: useAdminDashboardStore } =
  createQueryStore<DashboardData, { sedeId: string, userId: string }>({
    baseQueryKey: ['admin-dashboard'],
    clientFetcher: async ({ sedeId, userId }) => getAdminDashboardData({ sedeId }, userId),
  });

export const { Provider: CitizenDashboardProvider, useStore: useCitizenDashboardStore } =
  createQueryStore<DashboardData, { sedeId: string, userId: string }>({
    baseQueryKey: ['citizen-dashboard'],
    clientFetcher: async ({ sedeId, userId }) => getCitizenDashboardData({ sedeId }, userId),
  });
