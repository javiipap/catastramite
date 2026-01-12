
import { DatabaseAdapter } from "@/lib/db/types";
import { Request as AppRequest, RequestStatus } from "@/lib/types";

import { getCurrentUserId } from "@/lib/server-auth";

export class RequestsUseCases {
    constructor(private db: DatabaseAdapter) {}

    async createRequest(request: AppRequest): Promise<AppRequest> {
        return this.db.createRequest(request);
    }

    async getRequests(hqId: string): Promise<AppRequest[]> {
        return this.db.getRequests(hqId);
    }

    async getUserRequests(hqId: string, userId: string): Promise<AppRequest[]> {
        return this.db.getUserRequests(hqId, userId);
    }

    async updateRequestStatus(id: string, status: RequestStatus, headquartersId: string): Promise<AppRequest> {
        return this.db.updateRequestStatus(id, status, headquartersId);
    }

    async getAdminRequestsByParams(params: { headquartersId: string }): Promise<AppRequest[]> {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("Unauthorized");
        
        const role = await this.db.getUserRole(userId, params.headquartersId);
        if (role !== 'master') throw new Error("Unauthorized: Admin access required");

        return this.getRequests(params.headquartersId);
    }

    async getUserRequestsByParams(params: { headquartersId: string }): Promise<AppRequest[]> {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("Unauthorized");

        const role = await this.db.getUserRole(userId, params.headquartersId);
        if (!role) throw new Error("Unauthorized: Access denied");

        return this.getUserRequests(params.headquartersId, userId);
    }
}
