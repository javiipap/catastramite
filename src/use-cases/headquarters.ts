import { DatabaseAdapter } from '@/lib/db/types';
import { Headquarters, UserHeadquarters, UserRole } from '@/lib/types';

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

  async updateHeadquarters(
    id: string,
    updates: Partial<Headquarters>
  ): Promise<Headquarters> {
    return this.db.updateHeadquarters(id, updates);
  }

  async addUserToHeadquarters(uh: UserHeadquarters): Promise<void> {
    return this.db.addUserToHeadquarters(uh);
  }

  async getUserHeadquarters(
    user: Pick<UserHeadquarters, 'userId'>
  ): Promise<UserHeadquarters[]> {
    return this.db.getUserHeadquarters(user.userId);
  }

  async getUserHeadquartersObjects(
    user: Pick<UserHeadquarters, 'userId'>
  ): Promise<Headquarters[]> {
    return this.db.getUserHeadquartersObjects(user.userId);
  }

  async getAdminHeadquarters(
    user: Pick<UserHeadquarters, 'userId'>
  ): Promise<Headquarters[]> {
    const allHqs = await this.db.getUserHeadquartersObjects(user.userId);
    return allHqs.filter((hq) =>
      hq.userHeadquarters?.some(
        (uh) => uh.userId === user.userId && uh.role === 'master'
      )
    );
  }
}
