import { DatabaseAdapter } from '@/lib/db/types';
import { Notification as AppNotification, UserHeadquarters } from '@/lib/types';
import { User } from 'better-auth';

export class NotificationsUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createNotification(
    notification: AppNotification,
    user: Pick<User, 'id'>
  ): Promise<AppNotification> {
    const role = await this.db.getUserRole(
      user.id,
      notification.headquartersId
    );
    if (role !== 'master') {
      throw new Error('Unauthorized: Admin access required');
    }
    return this.db.createNotification(notification);
  }

  async getNotifications(
    hq: Pick<UserHeadquarters, 'headquartersId'>,
    user: Pick<User, 'id'>
  ): Promise<AppNotification[]> {
    const role = await this.db.getUserRole(user.id, hq.headquartersId);
    if (!role) {
      throw new Error('Unauthorized: Access denied');
    }

    return this.db.getNotifications(hq.headquartersId);
  }
}
