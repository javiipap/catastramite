
import { DatabaseAdapter } from "@/lib/db/types";
import { Procedure } from "@/lib/types";

export class ProceduresUseCases {
    constructor(private db: DatabaseAdapter) {}

    async createProcedure(procedure: Procedure): Promise<Procedure> {
        return this.db.createProcedure(procedure);
    }

    async getProcedures(hqId: string): Promise<Procedure[]> {
        return this.db.getProcedures(hqId);
    }
}
