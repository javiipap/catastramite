
import { DatabaseAdapter } from "@/lib/db/types";
import { Procedure } from "@/lib/types";

import { getCurrentUserId } from "@/lib/server-auth";

export class ProceduresUseCases {
    constructor(private db: DatabaseAdapter) {}

    async createProcedure(procedure: Procedure): Promise<Procedure> {
        return this.db.createProcedure(procedure);
    }

    async getProcedures(hqId: string): Promise<Procedure[]> {
        return this.db.getProcedures(hqId);
    }

    async getProceduresByParams(params: { headquartersId: string }): Promise<Procedure[]> {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("Unauthorized");

        const role = await this.db.getUserRole(userId, params.headquartersId);
        if (!role) throw new Error("Unauthorized: Access denied");

        return this.getProcedures(params.headquartersId);
    }
}
