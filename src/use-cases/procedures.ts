import type { DatabaseAdapter } from '@/lib/db/types';
import type { Procedure, UserHeadquarters } from '@/lib/types';
import type { User } from 'better-auth';

export class ProceduresUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createProcedure(
    procedure: Procedure,
    user: Pick<User, 'id'>
  ): Promise<Procedure> {
    const role = await this.db.getUserRole(user.id, procedure.headquartersId);
    if (role !== 'master') {
      throw new Error('Unauthorized: Master access required');
    }
    return this.db.createProcedure(procedure);
  }

  async getProcedures(
    hq: Pick<UserHeadquarters, 'headquartersId'>,
    user: Pick<User, 'id'>
  ): Promise<Procedure[]> {
    const role = await this.db.getUserRole(user.id, hq.headquartersId);
    if (!role) {
      throw new Error('Unauthorized: Access denied');
    }
    return this.db.getProcedures(hq.headquartersId);
  }
}
