
import { DatabaseAdapter } from "@/lib/db/types";
import { Notification as AppNotification } from "@/lib/types";

import { getCurrentUserId } from "@/lib/server-auth";

export class NotificationsUseCases {
    constructor(private db: DatabaseAdapter) {}

    async createNotification(notification: AppNotification): Promise<AppNotification> {
        return this.db.createNotification(notification);
    }

    async getNotifications(hqId: string): Promise<AppNotification[]> {
        return this.db.getNotifications(hqId);
    }

    async getNotificationsByParams(params: { headquartersId: string }): Promise<AppNotification[]> {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error("Unauthorized");

        const role = await this.db.getUserRole(userId, params.headquartersId);
        if (!role) throw new Error("Unauthorized: Access denied");

        return this.getNotifications(params.headquartersId);
    }
}
