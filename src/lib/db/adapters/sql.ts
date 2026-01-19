import { DatabaseAdapter } from "../types";
import {
  Headquarters,
  UserHeadquarters,
  UserRole,
  Procedure,
  Request as AppRequest,
  Notification as AppNotification,
  FormField,
  RequestStatus,
  User,
} from "@/lib/types";
import { db } from "../drizzle/client";
import {
  headquarters,
  userHeadquarters,
  user,
  procedures,
  requests,
  notifications,
} from "../drizzle/schema";
import { eq, and, inArray } from "drizzle-orm";

export class SqlAdapter implements DatabaseAdapter {
  // --- Users ---

  async getUserRole(userId: string, hqId: string): Promise<UserRole | null> {
    const result = await db
      .select()
      .from(userHeadquarters)
      .where(
        and(
          eq(userHeadquarters.userId, userId),
          eq(userHeadquarters.headquartersId, hqId),
        ),
      )
      .limit(1);

    const maxRole = result.reduce(
      (max, current) => {
        if (!max) {
          return current.role;
        }

        if (current.role === "master") {
          return current.role;
        }

        return max;
      },
      null as UserRole | null,
    );

    return maxRole;
  }

  async getUserHeadquarters(userId: string): Promise<UserHeadquarters[]> {
    const results = await db
      .select()
      .from(userHeadquarters)
      .where(eq(userHeadquarters.userId, userId));

    return results.map((r) => ({
      userId: r.userId,
      headquartersId: r.headquartersId,
      role: r.role as UserRole,
    }));
  }

  async getUserHeadquartersObjects(userId: string): Promise<Headquarters[]> {
    const userHqs = await this.getUserHeadquarters(userId);
    if (userHqs.length === 0) return [];

    const hqIds = userHqs.map((h) => h.headquartersId);

    const hqsResult = await db
      .select()
      .from(headquarters)
      .where(inArray(headquarters.id, hqIds));

    return hqsResult.map((row) => {
      const hq = this.mapToHeadquarters(row);
      return {
        ...hq,
        userHeadquarters: userHqs.filter(
          (uh) => uh.headquartersId === hq.headquartersId,
        ),
      };
    });
  }

  async addUserToHeadquarters(uh: UserHeadquarters): Promise<void> {
    // Check if exists
    const existing = await this.getUserRole(uh.userId, uh.headquartersId);
    if (!existing) {
      await db.insert(userHeadquarters).values({
        userId: uh.userId,
        headquartersId: uh.headquartersId,
        role: uh.role,
      });
    }
  }

  async removeUserFromHeadquarters(
    userId: string,
    hqId: string,
  ): Promise<void> {
    await db
      .delete(userHeadquarters)
      .where(
        and(
          eq(userHeadquarters.userId, userId),
          eq(userHeadquarters.headquartersId, hqId),
        ),
      );
  }

  async getUsersByHeadquarters(
    hqId: string,
  ): Promise<(User & { role: UserRole })[]> {
    const results = await db
      .select({
        user: user,
        role: userHeadquarters.role,
      })
      .from(userHeadquarters)
      .innerJoin(user, eq(userHeadquarters.userId, user.id))
      .where(eq(userHeadquarters.headquartersId, hqId));

    return results.map(({ user, role }) => ({
      ...user,
      userId: user.id,
      role: role as UserRole,
    }));
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [result] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!result) return undefined;
    return {
      ...result,
      userId: result.id,
    };
  }

  // --- Headquarters ---

  async getHeadquartersById(id: string): Promise<Headquarters | undefined> {
    const [result] = await db
      .select()
      .from(headquarters)
      .where(eq(headquarters.id, id))
      .limit(1);

    return result ? this.mapToHeadquarters(result) : undefined;
  }

  async createHeadquarters(
    hq: Headquarters,
    userId: string,
  ): Promise<Headquarters> {
    // Transaction
    await db.transaction(async (tx) => {
      await tx.insert(headquarters).values({
        id: hq.headquartersId,
        name: hq.name,
        description: hq.description || null,
        createdAt: hq.createdAt,
      });

      await tx.insert(userHeadquarters).values({
        userId: userId,
        headquartersId: hq.headquartersId,
        role: "master",
      });
    });

    return hq;
  }

  async updateHeadquarters(
    id: string,
    updates: Partial<Headquarters>,
  ): Promise<Headquarters> {
    if (Object.keys(updates).length === 0) {
      const hq = await this.getHeadquartersById(id);
      if (!hq) throw new Error("Headquarters not found");
      return hq;
    }

    await db
      .update(headquarters)
      .set({
        name: updates.name,
        description: updates.description,
      })
      .where(eq(headquarters.id, id));

    const updated = await this.getHeadquartersById(id);
    if (!updated) throw new Error("Headquarters not found after update");
    return updated;
  }

  // --- Procedures ---

  async getProcedures(hqId: string): Promise<Procedure[]> {
    const results = await db
      .select()
      .from(procedures)
      .where(eq(procedures.headquartersId, hqId));

    return results.map(this.mapToProcedure);
  }

  async createProcedure(procedure: Procedure): Promise<Procedure> {
    await db.insert(procedures).values({
      id: procedure.procedureId,
      headquartersId: procedure.headquartersId,
      name: procedure.name,
      description: procedure.description,
      fields: procedure.fields as any,
      createdAt: procedure.createdAt,
      createdBy: procedure.createdBy,
    });

    return procedure;
  }

  // --- Requests ---

  async getRequests(hqId: string): Promise<AppRequest[]> {
    const results = await db
      .select()
      .from(requests)
      .where(eq(requests.headquartersId, hqId));

    return results.map(this.mapToRequest);
  }

  async getUserRequests(hqId: string, userId: string): Promise<AppRequest[]> {
    const results = await db
      .select()
      .from(requests)
      .where(
        and(
          eq(requests.headquartersId, hqId),
          eq(requests.applicantId, userId),
        ),
      );

    return results.map(this.mapToRequest);
  }

  async createRequest(request: AppRequest): Promise<AppRequest> {
    await db.insert(requests).values({
      id: request.requestId,
      headquartersId: request.headquartersId,
      procedureId: request.procedureId,
      procedureName: request.procedureName,
      applicantId: request.applicantId,
      applicantName: request.applicantName,
      status: request.status,
      data: request.data as any,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    });
    return request;
  }

  async updateRequestStatus(
    id: string,
    status: RequestStatus,
    headquartersId: string,
    feedback?: string,
  ): Promise<AppRequest> {
    await db
      .update(requests)
      .set({
        status: status,
        feedback: feedback,
        updatedAt: new Date(),
      })
      .where(
        and(eq(requests.id, id), eq(requests.headquartersId, headquartersId)),
      );

    const [updated] = await db
      .select()
      .from(requests)
      .where(eq(requests.id, id))
      .limit(1);
    if (!updated) throw new Error("Request not found");

    return this.mapToRequest(updated);
  }

  // --- Notifications ---

  async getNotifications(hqId: string): Promise<AppNotification[]> {
    const results = await db
      .select()
      .from(notifications)
      .where(eq(notifications.headquartersId, hqId));

    return results.map(this.mapToNotification);
  }

  async createNotification(
    notification: AppNotification,
  ): Promise<AppNotification> {
    await db.insert(notifications).values({
      id: notification.notificationId,
      headquartersId: notification.headquartersId,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      createdAt: notification.createdAt,
      createdBy: notification.createdBy,
    });

    return notification;
  }

  // --- Mappers ---

  private mapToHeadquarters(
    row: typeof headquarters.$inferSelect,
  ): Headquarters {
    return {
      headquartersId: row.id,
      name: row.name,
      description: row.description || undefined,
      createdAt: row.createdAt,
    };
  }

  private mapToProcedure(row: typeof procedures.$inferSelect): Procedure {
    return {
      procedureId: row.id,
      headquartersId: row.headquartersId,
      name: row.name,
      description: row.description,
      fields: row.fields as unknown as FormField[],
      createdAt: row.createdAt,
      createdBy: row.createdBy,
    };
  }

  private mapToRequest(row: typeof requests.$inferSelect): AppRequest {
    return {
      requestId: row.id,
      headquartersId: row.headquartersId,
      procedureId: row.procedureId,
      procedureName: row.procedureName,
      applicantId: row.applicantId,
      applicantName: row.applicantName,
      status: row.status as RequestStatus,
      data: row.data as Record<string, unknown>,
      feedback: row.feedback || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private mapToNotification(
    row: typeof notifications.$inferSelect,
  ): AppNotification {
    return {
      notificationId: row.id,
      headquartersId: row.headquartersId,
      title: row.title,
      message: row.message,
      priority: row.priority as "low" | "medium" | "high",
      createdAt: row.createdAt,
      createdBy: row.createdBy,
    };
  }
}
