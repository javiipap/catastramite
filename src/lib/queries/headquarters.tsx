'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getHeadquarters, getHeadquartersById } from '@/lib/db/headquarters';
import { Headquarters } from '@/lib/types';

export const { Provider: HeadquartersListProvider, useStore: useHeadquartersListStore } =
  createQueryStore<Headquarters[]>({
    baseQueryKey: ['headquarters'],
    clientFetcher: async () => {
      // In a real app we might fetch from an API route here if we don't use server actions directly in client
      // But creating a store with clientFetcher set to the server action works in Next.js
      return getHeadquarters();
    },
  });

export const { Provider: HeadquartersProvider, useStore: useHeadquartersStore } =
  createQueryStore<Headquarters | undefined, { headquartersId: string }>({
    baseQueryKey: ['headquarters-detail'],
    clientFetcher: async ({ headquartersId }) => getHeadquartersById(headquartersId),
  });
