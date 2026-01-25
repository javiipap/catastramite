'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getHeadquartersAction } from '@/lib/actions/headquarters';
import { getUserHeadquartersAction, getMasterHeadquartersAction } from '@/lib/actions/headquarters';
import type { Headquarters } from '@/lib/types';

export const { Provider: HeadquartersListProvider, useStore: useHeadquartersListStore } =
  createQueryStore<Headquarters[]>({
    baseQueryKey: ['user-headquarters-list'],
    clientFetcher: async () => {
      const result = await getUserHeadquartersAction();
      return result?.data || [];
    },
  });

export const { Provider: MasterHeadquartersListProvider, useStore: useMasterHeadquartersListStore } =
  createQueryStore<Headquarters[]>({
    baseQueryKey: ['master-headquarters-list'],
    clientFetcher: async () => {
      const result = await getMasterHeadquartersAction();
      return result?.data || [];
    },
  });

export const { Provider: HeadquartersProvider, useStore: useHeadquartersStore } =
  createQueryStore<Headquarters, { headquartersId: string }>({
    baseQueryKey: ['headquarters-detail'],
    clientFetcher: async ({ headquartersId }) => {
      const result = await getHeadquartersAction({ headquartersId });
      if (!result?.data) {
        throw new Error('Headquarters not found');
      }

      return result.data;
    },
  });
