import type { DatabaseAdapter } from '@/lib/db/types';
import type { Procedure, UserHeadquarters } from '@/lib/types';

export class ProceduresUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createProcedure(procedure: Procedure): Promise<Procedure> {
    return this.db.createProcedure(procedure);
  }

  async getProcedures(
    hq: Pick<UserHeadquarters, 'headquartersId'>
  ): Promise<Procedure[]> {
    return this.db.getProcedures(hq.headquartersId);
  }
}
