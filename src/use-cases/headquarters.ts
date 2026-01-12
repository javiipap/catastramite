
import { DatabaseAdapter } from "@/lib/db/types";
import { Headquarters } from "@/lib/types";

export class HeadquartersUseCases {
    constructor(private db: DatabaseAdapter) {}

    async createHeadquarters(hq: Headquarters, userId: string): Promise<Headquarters> {
        return this.db.createHeadquarters(hq, userId);
    }

    async getHeadquartersById(id: string): Promise<Headquarters | undefined> {
        return this.db.getHeadquartersById(id);
    }

    async getHeadquartersByParams(params: { headquartersId: string }): Promise<Headquarters | undefined> {
        return this.db.getHeadquartersById(params.headquartersId);
    }
    
    async getHeadquarters(): Promise<Headquarters[]> {
        return this.db.getHeadquarters();
    }

    async updateHeadquarters(id: string, updates: Partial<Headquarters>): Promise<Headquarters> {
        return this.db.updateHeadquarters(id, updates);
    }
}
