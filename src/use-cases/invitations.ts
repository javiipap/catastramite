import type { DatabaseAdapter } from "@/lib/db/types";
import type { User } from "better-auth";
import { generateToken, verifyToken } from "@/services/jwt";
import { UserRole } from "@/lib/types";

export interface InvitationPayload {
  headquartersId: string;
  role: "master" | "slave";
}

export class InvitationsUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createInvitationToken(
    headquartersId: string,
    role: UserRole,
    actor: Pick<User, "id">
  ): Promise<string> {
    const userRole = await this.db.getUserRole(actor.id, headquartersId);
    if (userRole !== "master") {
      throw new Error("Unauthorized: Master access required");
    }

    const payload: InvitationPayload = {
      headquartersId,
      role,
    };
    return generateToken(payload, "1d");
  }

  async acceptInvitation(
    token: string,
    user: Pick<User, "id">
  ): Promise<{ headquartersId: string }> {
    const payload = await verifyToken<InvitationPayload>(token);

    if (!payload || !payload.headquartersId || !payload.role) {
      throw new Error("Invalid or expired invitation token");
    }

    const { headquartersId, role } = payload;

    // Check if user is already a member
    const existingRole = await this.db.getUserRole(user.id, headquartersId);
    if (existingRole) {
      // User is already a member. Don't update role.
      return { headquartersId };
    }

    await this.db.addUserToHeadquarters({
      userId: user.id,
      headquartersId,
      role,
    });

    return { headquartersId };
  }
}
