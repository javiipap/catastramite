'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getHeadquartersAction } from '@/lib/actions/headquarters';
import { getUserHeadquartersAction, getAdminHeadquartersAction } from '@/lib/actions/headquarters';
import { Headquarters } from '@/lib/types';

export const { Provider: HeadquartersListProvider, useStore: useHeadquartersListStore } =
  createQueryStore<Headquarters[]>({
    baseQueryKey: ['user-headquarters-list'],
    clientFetcher: async () => {
      const result = await getUserHeadquartersAction();
      return result?.data || [];
    },
  });

export const { Provider: AdminHeadquartersListProvider, useStore: useAdminHeadquartersListStore } =
  createQueryStore<Headquarters[]>({
    baseQueryKey: ['admin-headquarters-list'],
    clientFetcher: async () => {
      const result = await getAdminHeadquartersAction();
      return result?.data || [];
    },
  });

export const { Provider: HeadquartersProvider, useStore: useHeadquartersStore } =
  createQueryStore<Headquarters | undefined, { headquartersId: string }>({
    baseQueryKey: ['headquarters-detail'],
    clientFetcher: async ({ headquartersId }) => {
      const result = await getHeadquartersAction({ headquartersId });
      return result?.data;
    },
  });
