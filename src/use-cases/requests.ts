
import { DatabaseAdapter } from "@/lib/db/types";
import { Request as AppRequest, RequestStatus } from "@/lib/types";

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
}
