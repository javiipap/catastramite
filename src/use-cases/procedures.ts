
import { DatabaseAdapter } from "@/lib/db/types";
import { Procedure, UserHeadquarters } from "@/lib/types";

import { getCurrentUserId } from "@/lib/server-auth";

export class ProceduresUseCases {
    constructor(private db: DatabaseAdapter) {}

    async createProcedure(procedure: Procedure): Promise<Procedure> {
        return this.db.createProcedure(procedure);
    }

    async getProcedures(hq: Pick<UserHeadquarters, 'headquartersId'>): Promise<Procedure[]> {
        return this.db.getProcedures(hq.headquartersId);
    }
}
