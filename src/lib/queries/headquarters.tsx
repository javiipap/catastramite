'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getAllHeadquartersAction, getHeadquartersAction } from '@/lib/actions/headquarters';
import { Headquarters } from '@/lib/types';

export const { Provider: HeadquartersListProvider, useStore: useHeadquartersListStore } =
  createQueryStore<Headquarters[]>({
    baseQueryKey: ['headquarters'],
    clientFetcher: async () => {
      const result = await getAllHeadquartersAction();
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
