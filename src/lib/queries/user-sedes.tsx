'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getUserSedes } from '@/lib/db/users';
import { UserSede } from '@/lib/types';

export const { Provider: UserSedesProvider, useStore: useUserSedesStore } =
  createQueryStore<UserSede[], { userId: string }>({
    baseQueryKey: ['user-sedes'],
    clientFetcher: async ({ userId }) => {
      return getUserSedes(userId);
    },
  });
