'use client';

import { createQueryStore } from '@/lib/store/create-query';
import { getNotifications } from '@/lib/db/notifications';
import { Notification } from '@/lib/types';

export const { Provider: NotificationsProvider, useStore: useNotificationsStore } =
  createQueryStore<Notification[], { sedeId: string }>({
    baseQueryKey: ['notifications'],
    clientFetcher: async ({ sedeId }) => {
      return getNotifications(sedeId);
    },
  });
