
import { DatabaseAdapter } from "@/lib/db/types";
import { UserHeadquarters, Headquarters, UserRole } from "@/lib/types";

export class UsersUseCases {
    constructor(private db: DatabaseAdapter) {}

    async getUserRole(userId: string, hqId: string): Promise<UserRole | null> {
        return this.db.getUserRole(userId, hqId);
    }

    async addUserToHeadquarters(uh: UserHeadquarters): Promise<void> {
        return this.db.addUserToHeadquarters(uh);
    }
    
    async getUserHeadquarters(userId: string): Promise<UserHeadquarters[]> {
        return this.db.getUserHeadquarters(userId);
    }

    async getUserHeadquartersObjects(userId: string): Promise<Headquarters[]> {
        return this.db.getUserHeadquartersObjects(userId);
    }
}
