'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getSedes, getSede } from '@/lib/actions/sedes';
import { Sede } from '@/lib/types';

export const { Provider: SedesProvider, useStore: useSedesStore } =
  createQueryStore<Sede[]>({
    baseQueryKey: ['sedes'],
    clientFetcher: async () => {
      // In a real app we might fetch from an API route here if we don't use server actions directly in client
      // But creating a store with clientFetcher set to the server action works in Next.js
      return getSedes();
    },
  });

export const { Provider: SedeProvider, useStore: useSedeStore } =
  createQueryStore<Sede | undefined, { sedeId: string }>({
    baseQueryKey: ['sede'],
    clientFetcher: async ({ sedeId }) => getSede(sedeId),
  });
