'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getUserHeadquarters } from '@/lib/db/users';
import { UserHeadquarters } from '@/lib/types';

export const { Provider: UserHeadquartersProvider, useStore: useUserHeadquartersStore } =
  createQueryStore<UserHeadquarters[], { userId: string }>({
    baseQueryKey: ['user-headquarters'],
    clientFetcher: async ({ userId }) => {
      return getUserHeadquarters(userId);
    },
  });
