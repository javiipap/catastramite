import { DatabaseAdapter } from '@/lib/db/types';
import { Headquarters, UserHeadquarters } from '@/lib/types';

import { getCurrentUserId } from '@/lib/server-auth';

export class HeadquartersUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createHeadquarters(
    hq: Headquarters,
    user: Pick<UserHeadquarters, 'userId'>
  ): Promise<Headquarters> {
    return this.db.createHeadquarters(hq, user.userId);
  }

  async getHeadquarters(
    params: Pick<Headquarters, 'headquartersId'>
  ): Promise<Headquarters | undefined> {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Unauthorized');

    const role = await this.db.getUserRole(userId, params.headquartersId);
    if (!role) throw new Error('Unauthorized: Access denied');

    return this.db.getHeadquartersById(params.headquartersId);
  }

  async getAllHeadquarters(): Promise<Headquarters[]> {
    return this.db.getHeadquarters();
  }

  async updateHeadquarters(
    id: string,
    updates: Partial<Headquarters>
  ): Promise<Headquarters> {
    return this.db.updateHeadquarters(id, updates);
  }
}
