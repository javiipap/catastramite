'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { UserHeadquarters } from '@/lib/types';
import { getUserHeadquartersAction } from '@/lib/actions/users';

export const { Provider: UserHeadquartersProvider, useStore: useUserHeadquartersStore } =
  createQueryStore<UserHeadquarters[], { userId: string }>({
    baseQueryKey: ['user-headquarters'],
    clientFetcher: async ({ userId }) => {
      const result = await getUserHeadquartersAction({ userId });
      return result?.data || [];
    },
  });
