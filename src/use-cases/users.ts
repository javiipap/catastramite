import type { DatabaseAdapter } from "@/lib/db/types";
import type { UserHeadquarters, UserRole } from "@/lib/types";

export class UsersUseCases {
  constructor(private db: DatabaseAdapter) {}

  async getUserRole(
    user: Pick<UserHeadquarters, "userId">,
    hq: Pick<UserHeadquarters, "headquartersId">,
  ): Promise<UserRole | null> {
    return this.db.getUserRole(user.userId, hq.headquartersId);
  }

  async getUser(
    userId: string,
  ): Promise<import("@/lib/types").User | undefined> {
    return this.db.getUser(userId);
  }

  async getUserByEmail(
    email: string,
  ): Promise<import("@/lib/types").User | undefined> {
    return this.db.getUserByEmail(email);
  }

  async createUser(
    user: import("@/lib/types").User,
  ): Promise<import("@/lib/types").User> {
    return this.db.createUser(user);
  }

  async updateUser(
    userId: string,
    data: Partial<import("@/lib/types").User>,
  ): Promise<import("@/lib/types").User> {
    return this.db.updateUser(userId, data);
  }
}
