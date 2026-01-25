'use client';

import { createQueryStore } from '@/lib/store/create-query';
import type { Procedure } from '@/lib/types';
import { getProceduresAction } from "@/lib/actions/procedures"

export const { Provider: ProceduresProvider, useStore: useProceduresStore } =
  createQueryStore<Procedure[], { headquartersId: string }>({
    baseQueryKey: ['procedures'],
    clientFetcher: async ({ headquartersId }) => {
      const result = await getProceduresAction({ headquartersId });
      return result?.data || [];
    },
  });
