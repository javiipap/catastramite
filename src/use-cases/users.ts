import type { DatabaseAdapter } from '@/lib/db/types';
import type { UserHeadquarters, UserRole } from '@/lib/types';

export class UsersUseCases {
  constructor(private db: DatabaseAdapter) {}

  async getUserRole(
    user: Pick<UserHeadquarters, 'userId'>,
    hq: Pick<UserHeadquarters, 'headquartersId'>
  ): Promise<UserRole | null> {
    return this.db.getUserRole(user.userId, hq.headquartersId);
  }
}
