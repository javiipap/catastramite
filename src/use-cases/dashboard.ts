
import { DatabaseAdapter } from "@/lib/db/types";

export class DashboardUseCases {
    constructor(private db: DatabaseAdapter) {}

    async getAdminDashboardData(hqId: string) {
        // Aggregate data logic
        // Parallel fetching for performance
        const [procedures, requests] = await Promise.all([
             this.db.getProcedures(hqId),
             this.db.getRequests(hqId)
        ]);

        return {
            proceduresCount: procedures.length,
            requestsCount: requests.length,
            pendingRequestsCount: requests.filter((r) => r.status === 'pending').length,
            recentActivity: requests.slice(0, 5) // Mock logic, ideally sort by date
        };
    }

    async getSlaveDashboardData(hqId: string, userId: string) {
        const [myRequests] = await Promise.all([
             this.db.getUserRequests(hqId, userId)
        ]);
        
        return {
             myRequestsCount: myRequests.length,
             myPendingRequestsCount: myRequests.filter((r) => r.status === 'pending').length,
             recentActivity: myRequests.slice(0, 5)
        };
    }
}
