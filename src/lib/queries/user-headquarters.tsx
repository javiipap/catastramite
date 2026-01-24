'use client';

import { getHeadquartersUsersAction } from '@/lib/actions/headquarters-users';
import { createQueryStore } from '@/lib/store/create-query';
import { User, UserRole } from '@/lib/types';

export const { Provider: UserHeadquartersProvider, useStore: useUserHeadquartersStore } =
  createQueryStore<(User & { role: UserRole })[], { headquartersId: string }>({
    baseQueryKey: ['user-headquarters'],
    clientFetcher: async ({ headquartersId }) => {
      const result = await getHeadquartersUsersAction({ headquartersId });
      return result?.data || [];
    },
  });
