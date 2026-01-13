import type { DatabaseAdapter } from '@/lib/db/types';
import type { DashboardData, User, UserHeadquarters } from '@/lib/types';

export class DashboardUseCases {
  constructor(private db: DatabaseAdapter) {}

  async getMasterDashboardData(
    hq: Pick<UserHeadquarters, 'headquartersId'>,
    user: Pick<User, 'userId'>
  ): Promise<DashboardData> {
    const role = await this.db.getUserRole(user.userId, hq.headquartersId);
    if (role !== 'master') {
      throw new Error('Unauthorized: Master access required');
    }

    const [headquarters, procedures, requests] = await Promise.all([
      this.db.getHeadquartersById(hq.headquartersId),
      this.db.getProcedures(hq.headquartersId),
      this.db.getRequests(hq.headquartersId),
    ]);

    return {
      headquarters,
      procedures,
      requests,
    };
  }

  async getSlaveDashboardData(
    hq: Pick<UserHeadquarters, 'headquartersId'>,
    user: Pick<User, 'userId'>
  ): Promise<DashboardData> {
    const role = await this.db.getUserRole(user.userId, hq.headquartersId);
    if (!role) {
      throw new Error('Unauthorized: Access denied');
    }

    const [headquarters, procedures, requests] = await Promise.all([
      this.db.getHeadquartersById(hq.headquartersId),
      this.db.getProcedures(hq.headquartersId),
      this.db.getUserRequests(hq.headquartersId, user.userId),
    ]);

    return {
      headquarters,
      procedures,
      requests,
    };
  }
}
