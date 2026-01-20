import { DatabaseAdapter } from "@/lib/db/types";
import { Notification as AppNotification, UserHeadquarters } from "@/lib/types";
import { User } from "@/lib/types";
import { sendNotificationCreatedEmail } from "@/services/email";

export class NotificationsUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createNotification(
    notification: AppNotification,
    user: Pick<User, "userId">,
  ): Promise<AppNotification> {
    const role = await this.db.getUserRole(
      user.userId,
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
    user: Pick<User, "userId">,
  ): Promise<AppNotification[]> {
    const role = await this.db.getUserRole(user.userId, hq.headquartersId);
    if (!role) {
      throw new Error("Unauthorized: Access denied");
    }

    return this.db.getNotifications(hq.headquartersId);
  }
}
