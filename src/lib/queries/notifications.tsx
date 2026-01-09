'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getNotifications } from '@/lib/db/notifications';
import { Notification } from '@/lib/types';

export const { Provider: NotificationsProvider, useStore: useNotificationsStore } =
  createQueryStore<Notification[], { headquartersId: string }>({
    baseQueryKey: ['notifications'],
    clientFetcher: async ({ headquartersId }) => {
      return getNotifications(headquartersId);
    },
  });
