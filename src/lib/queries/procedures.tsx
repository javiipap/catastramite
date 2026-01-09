'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getProcedures } from '@/lib/db/procedures';
import { Procedure } from '@/lib/types';

export const { Provider: ProceduresProvider, useStore: useProceduresStore } =
  createQueryStore<Procedure[], { headquartersId: string }>({
    baseQueryKey: ['procedures'],
    clientFetcher: async ({ headquartersId }) => getProcedures(headquartersId),
  });
