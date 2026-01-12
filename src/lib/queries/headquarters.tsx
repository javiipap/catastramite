'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getHeadquarters, getHeadquartersById } from '@/lib/db/headquarters';
import { Headquarters } from '@/lib/types';

export const { Provider: HeadquartersListProvider, useStore: useHeadquartersListStore } =
  createQueryStore<Headquarters[]>({
    baseQueryKey: ['headquarters'],
    clientFetcher: async () => {
      return getHeadquarters();
    },
  });

export const { Provider: HeadquartersProvider, useStore: useHeadquartersStore } =
  createQueryStore<Headquarters | undefined, { headquartersId: string }>({
    baseQueryKey: ['headquarters-detail'],
    clientFetcher: async ({ headquartersId }) => getHeadquartersById(headquartersId),
  });
