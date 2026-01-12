'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { Notification } from '@/lib/types';
import { getNotificationsAction } from "@/lib/actions/notifications"

export const { Provider: NotificationsProvider, useStore: useNotificationsStore } =
  createQueryStore<Notification[], { headquartersId: string }>({
    baseQueryKey: ['notifications'],
    clientFetcher: async ({ headquartersId }) => {
      const result = await getNotificationsAction({ headquartersId });
      return result?.data || [];
    },
  });
