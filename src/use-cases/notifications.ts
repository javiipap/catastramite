
import { DatabaseAdapter } from "@/lib/db/types";
import { Notification as AppNotification } from "@/lib/types";

export class NotificationsUseCases {
    constructor(private db: DatabaseAdapter) {}

    async createNotification(notification: AppNotification): Promise<AppNotification> {
        return this.db.createNotification(notification);
    }

    async getNotifications(hqId: string): Promise<AppNotification[]> {
        return this.db.getNotifications(hqId);
    }
}
