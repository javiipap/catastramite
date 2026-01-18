import { DatabaseAdapter } from "@/lib/db/types";
import { Notification as AppNotification, UserHeadquarters } from "@/lib/types";
import { User } from "better-auth";
import { sendNotificationCreatedEmail } from "@/services/email";

export class NotificationsUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createNotification(
    notification: AppNotification,
    user: Pick<User, "id">,
  ): Promise<AppNotification> {
    const role = await this.db.getUserRole(
      user.id,
      notification.headquartersId,
    );
    if (role !== "master") {
      throw new Error("Unauthorized: Master access required");
    }

    const newNotification = await this.db.createNotification(notification);

    // Send emails to all users in the headquarters
    const hqUsers = await this.db.getUsersByHeadquarters(
      notification.headquartersId,
    );

    for (const member of hqUsers) {
      await sendNotificationCreatedEmail(
        member.name,
        member.email,
        notification.title,
        notification.message,
      );
    }

    return newNotification;
  }

  async getNotifications(
    hq: Pick<UserHeadquarters, "headquartersId">,
    user: Pick<User, "id">,
  ): Promise<AppNotification[]> {
    const role = await this.db.getUserRole(user.id, hq.headquartersId);
    if (!role) {
      throw new Error("Unauthorized: Access denied");
    }

    return this.db.getNotifications(hq.headquartersId);
  }
}
