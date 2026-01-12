import type { DatabaseAdapter } from '@/lib/db/types';
import type { DashboardData, UserHeadquarters } from '@/lib/types';

import { getCurrentUserId } from '@/lib/server-auth';

export class DashboardUseCases {
  constructor(private db: DatabaseAdapter) {}

  async getAdminDashboardData(
    hq: Pick<UserHeadquarters, 'headquartersId'>
  ): Promise<DashboardData> {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');

    const role = await this.db.getUserRole(userId, hq.headquartersId);
    if (role !== 'master')
      throw new Error('Unauthorized: Admin access required');

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
    hq: Pick<UserHeadquarters, 'headquartersId'>
  ): Promise<DashboardData> {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');

    const role = await this.db.getUserRole(userId, hq.headquartersId);
    if (!role) throw new Error('Unauthorized: Access denied');

    const [headquarters, procedures, requests] = await Promise.all([
      this.db.getHeadquartersById(hq.headquartersId),
      this.db.getProcedures(hq.headquartersId),
      this.db.getUserRequests(hq.headquartersId, userId),
    ]);

    return {
      headquarters,
      procedures,
      requests,
    };
  }
}
