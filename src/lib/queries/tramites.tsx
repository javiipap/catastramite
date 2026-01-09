'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getTramites } from '@/lib/db/procedures';
import { TramiteType } from '@/lib/types';

export const { Provider: TramitesProvider, useStore: useTramitesStore } =
  createQueryStore<TramiteType[], { sedeId: string }>({
    baseQueryKey: ['tramites'],
    clientFetcher: async ({ sedeId }) => getTramites(sedeId),
  });
