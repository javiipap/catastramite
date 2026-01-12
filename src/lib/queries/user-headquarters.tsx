'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { UserHeadquarters } from '@/lib/types';
import { getUserHeadquartersRelationsAction } from '@/lib/actions/headquarters';

export const { Provider: UserHeadquartersProvider, useStore: useUserHeadquartersStore } =
  createQueryStore<UserHeadquarters[], { userId: string }>({
    baseQueryKey: ['user-headquarters'],
    clientFetcher: async ({ userId }) => {
      const result = await getUserHeadquartersRelationsAction({ userId });
      return result?.data || [];
    },
  });
