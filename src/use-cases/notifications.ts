
import { DatabaseAdapter } from "@/lib/db/types";
import { Notification as AppNotification, UserHeadquarters } from "@/lib/types";

import { getCurrentUserId } from "@/lib/server-auth";

export class NotificationsUseCases {
    constructor(private db: DatabaseAdapter) {}

    async createNotification(notification: AppNotification): Promise<AppNotification> {
        return this.db.createNotification(notification);
    }

    async getNotifications(hq: Pick<UserHeadquarters, 'headquartersId'>): Promise<AppNotification[]> {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("Unauthorized");
    
        const role = await this.db.getUserRole(userId, hq.headquartersId);
        if (!role) throw new Error("Unauthorized: Access denied");
        
        return this.db.getNotifications(hq.headquartersId);
    }
}
