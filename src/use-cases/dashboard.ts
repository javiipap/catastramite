import { DatabaseAdapter } from "@/lib/db/types";
import { Headquarters, Procedure, Request, DashboardData } from "@/lib/types";

import { getCurrentUserId } from "@/lib/server-auth";

export class DashboardUseCases {
    constructor(private db: DatabaseAdapter) {}

    async getAdminDashboardData(hqId: string): Promise<DashboardData> {
        const [headquarters, procedures, requests] = await Promise.all([
             this.db.getHeadquartersById(hqId),
             this.db.getProcedures(hqId),
             this.db.getRequests(hqId)
        ]);

        return {
            headquarters,
            procedures,
            requests
        };
    }

    async getAdminStats(headquartersId: string, userId: string): Promise<DashboardData> {
        // Correcting the call to match existing getAdminDashboardData signature
        return this.getAdminDashboardData(headquartersId)
    }

    /**
     * Orchestrates fetching dashboard data checking auth.
     * This is designed to be used by the server component directly.
     */
    async getDashboardDataServer(headquartersId: string, userId: string): Promise<DashboardData> {
        // In a real scenario, we might verify permissions here or in getAdminDashboardData
        // For now, we delegate to getAdminDashboardData which uses the db adapter.
        // Correcting the call to match existing getAdminDashboardData signature
        return this.getAdminDashboardData(headquartersId)
    }

    async getSlaveDashboardData(hqId: string, userId: string): Promise<DashboardData> {
        const [headquarters, procedures, requests] = await Promise.all([
             this.db.getHeadquartersById(hqId),
             this.db.getProcedures(hqId),
             this.db.getUserRequests(hqId, userId)
        ]);
        
        return {
             headquarters,
             procedures,
             requests
        };
    }

    async getAdminDashboardDataByParams(params: { headquartersId: string }): Promise<DashboardData> {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("Unauthorized");

        const role = await this.db.getUserRole(userId, params.headquartersId);
        if (role !== 'master') throw new Error("Unauthorized: Admin access required");

        return this.getAdminDashboardData(params.headquartersId);
    }

    async getSlaveDashboardDataByParams(params: { headquartersId: string }): Promise<DashboardData> {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("Unauthorized");

        const role = await this.db.getUserRole(userId, params.headquartersId);
        if (!role) throw new Error("Unauthorized: Access denied");

        return this.getSlaveDashboardData(params.headquartersId, userId);
    }
}
