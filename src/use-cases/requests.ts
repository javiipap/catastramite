
import { DatabaseAdapter } from "@/lib/db/types";
import { Request as AppRequest, RequestStatus, UserHeadquarters } from "@/lib/types";

import { getCurrentUserId } from "@/lib/server-auth";

export class RequestsUseCases {
    constructor(private db: DatabaseAdapter) {}

    async createRequest(request: AppRequest): Promise<AppRequest> {
        return this.db.createRequest(request);
    }

    async getRequests(hq: Pick<UserHeadquarters, 'headquartersId'>): Promise<AppRequest[]> {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("Unauthorized");
        
        const role = await this.db.getUserRole(userId, hq.headquartersId);
        if (role !== 'master') throw new Error("Unauthorized: Admin access required");

        return this.db.getRequests(hq.headquartersId);
    }

    async getUserRequests(hq: Pick<UserHeadquarters, 'headquartersId'>): Promise<AppRequest[]> {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("Unauthorized");
    
        const role = await this.db.getUserRole(userId, hq.headquartersId);
        if (!role) throw new Error("Unauthorized: Access denied");
        
        return this.db.getUserRequests(hq.headquartersId, userId);
    }

    async updateRequestStatus(id: string, status: RequestStatus, hq: Pick<UserHeadquarters, 'headquartersId'>): Promise<AppRequest> {
        return this.db.updateRequestStatus(id, status, hq.headquartersId);
    }
}
