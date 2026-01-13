import type { DatabaseAdapter } from '@/lib/db/types';
import type { Headquarters, UserHeadquarters } from '@/lib/types';
import type { User } from 'better-auth';

export class HeadquartersUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createHeadquarters(
    hq: Headquarters,
    user: Pick<UserHeadquarters, 'userId'>
  ): Promise<Headquarters> {
    return this.db.createHeadquarters(hq, user.userId);
  }

  async getHeadquarters(
    params: Pick<Headquarters, 'headquartersId'>,
    user: Pick<User, 'id'>
  ): Promise<Headquarters | undefined> {
    const role = await this.db.getUserRole(user.id, params.headquartersId);
    if (!role) {
      throw new Error('Unauthorized: Access denied');
    }
    return this.db.getHeadquartersById(params.headquartersId);
  }

  async updateHeadquarters(
    id: string,
    updates: Partial<Headquarters>,
    user: Pick<User, 'id'>
  ): Promise<Headquarters> {
    const role = await this.db.getUserRole(user.id, id);
    if (role !== 'master') {
      throw new Error('Unauthorized: Admin access required');
    }
    return this.db.updateHeadquarters(id, updates);
  }

  async addUserToHeadquarters(
    uh: UserHeadquarters,
    actor: Pick<User, 'id'>
  ): Promise<void> {
    const role = await this.db.getUserRole(actor.id, uh.headquartersId);
    if (role !== 'master') {
      throw new Error('Unauthorized: Admin access required');
    }
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

  async getHeadquartersUsers(
    params: Pick<UserHeadquarters, 'headquartersId'>,
    user: Pick<User, 'id'>
  ) {
    const role = await this.db.getUserRole(user.id, params.headquartersId);
    if (role !== 'master') {
      throw new Error('Unauthorized: Admin access required');
    }
    return this.db.getUsersByHeadquarters(params.headquartersId);
  }

  async removeUserFromHeadquarters(
    userId: string,
    headquartersId: string,
    actor: Pick<User, 'id'>
  ): Promise<void> {
    const role = await this.db.getUserRole(actor.id, headquartersId);
    if (role !== 'master') {
      throw new Error('Unauthorized: Admin access required');
    }
    return this.db.removeUserFromHeadquarters(userId, headquartersId);
  }

  async getUserByEmail(email: string) {
    return this.db.getUserByEmail(email);
  }
}
