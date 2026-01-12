
import { DatabaseAdapter } from "@/lib/db/types";
import { UserHeadquarters, Headquarters, UserRole } from "@/lib/types";

export class UsersUseCases {
    constructor(private db: DatabaseAdapter) {}

    async getUserRole(user: Pick<UserHeadquarters, 'userId'>, hq: Pick<UserHeadquarters, 'headquartersId'>): Promise<UserRole | null> {
        return this.db.getUserRole(user.userId, hq.headquartersId);
    }

    async addUserToHeadquarters(uh: UserHeadquarters): Promise<void> {
        return this.db.addUserToHeadquarters(uh);
    }
    
    async getUserHeadquarters(user: Pick<UserHeadquarters, 'userId'>): Promise<UserHeadquarters[]> {
        return this.db.getUserHeadquarters(user.userId);
    }

    async getUserHeadquartersObjects(user: Pick<UserHeadquarters, 'userId'>): Promise<Headquarters[]> {
        return this.db.getUserHeadquartersObjects(user.userId);
    }
}
