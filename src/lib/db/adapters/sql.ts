import { DatabaseAdapter } from '../types';
import { 
  Headquarters, 
  UserHeadquarters, 
  UserRole, 
  Procedure, 
  Request as AppRequest, 
  Notification as AppNotification,
  FormField,
  RequestStatus
} from '@/lib/types';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { 
  headquarters, 
  userHeadquarters, 
  procedures, 
  requests, 
  notifications 
} from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

export class SqlAdapter implements DatabaseAdapter {
  
  // --- Users ---

  async getUserRole(userId: string, hqId: string): Promise<UserRole | null> {
    const result = await db.select()
      .from(userHeadquarters)
      .where(and(
        eq(userHeadquarters.userId, userId), 
        eq(userHeadquarters.headquartersId, hqId)
      ))
      .get();
      
    return result ? (result.role as UserRole) : null;
  }

  async getUserHeadquarters(userId: string): Promise<UserHeadquarters[]> {
    const results = await db.select()
      .from(userHeadquarters)
      .where(eq(userHeadquarters.userId, userId))
      .all();

    return results.map(r => ({
      userId: r.userId,
      headquartersId: r.headquartersId,
      role: r.role as UserRole
    }));
  }

  async getUserHeadquartersObjects(userId: string): Promise<Headquarters[]> {
    const userHqs = await this.getUserHeadquarters(userId);
    if (userHqs.length === 0) return [];

    const hqIds = userHqs.map(h => h.headquartersId);
    
    // In Drizzle we can use 'inArray', but let's loop for simplicity if needed, 
    // or properly use inArray from drizzle-orm
    // Importing inArray first... actually simpler to just map async if list is small, 
    // but correct way is `inArray`. Let's assume standard methods unless we need complex query.
    // For better perf, we should use `inArray`. I will iterate for now to avoid importing another operator unless strictly necessary, 
    // but `inArray` is standard. Let's do a loop or Promise.all for now to be safe on imports without checking docs for specific path.
    // Actually, I'll use Promise.all which is robust.
    
    const hqs = await Promise.all(hqIds.map(id => this.getHeadquartersById(id)));
    return hqs.filter((h): h is Headquarters => !!h);
  }

  async addUserToHeadquarters(uh: UserHeadquarters): Promise<void> {
    // Check if exists
    const existing = await this.getUserRole(uh.userId, uh.headquartersId);
    if (!existing) {
      await db.insert(userHeadquarters).values({
        userId: uh.userId,
        headquartersId: uh.headquartersId,
        role: uh.role
      }).run();
    }
  }

  // --- Headquarters ---

  async getHeadquarters(): Promise<Headquarters[]> {
    const results = await db.select().from(headquarters).all();
    return results.map(this.mapToHeadquarters);
  }

  async getHeadquartersById(id: string): Promise<Headquarters | undefined> {
    const result = await db.select()
      .from(headquarters)
      .where(eq(headquarters.id, id))
      .get();
      
    return result ? this.mapToHeadquarters(result) : undefined;
  }

  async createHeadquarters(hq: Headquarters, userId: string): Promise<Headquarters> {
    // Transaction
    db.transaction(() => {
        db.insert(headquarters).values({
            id: hq.id,
            name: hq.name,
            description: hq.description || null,
            createdAt: hq.createdAt
        }).run();

        db.insert(userHeadquarters).values({
            userId: userId,
            headquartersId: hq.id,
            role: 'master'
        }).run();
    });
    
    return hq;
  }

  async updateHeadquarters(id: string, updates: Partial<Headquarters>): Promise<Headquarters> {
    if (Object.keys(updates).length === 0) {
        const hq = await this.getHeadquartersById(id);
        if (!hq) throw new Error("Headquarters not found");
        return hq;
    }

    await db.update(headquarters)
        .set({
            name: updates.name,
            description: updates.description,
        })
        .where(eq(headquarters.id, id))
        .run();

    const updated = await this.getHeadquartersById(id);
    if (!updated) throw new Error("Headquarters not found after update");
    return updated;
  }

  // --- Procedures ---

  async getProcedures(hqId: string): Promise<Procedure[]> {
    const results = await db.select()
        .from(procedures)
        .where(eq(procedures.headquartersId, hqId))
        .all();
        
    return results.map(this.mapToProcedure);
  }

  async createProcedure(procedure: Procedure): Promise<Procedure> {
    await db.insert(procedures).values({
        id: procedure.id,
        headquartersId: procedure.headquartersId,
        name: procedure.name,
        description: procedure.description,
        fields: procedure.fields as unknown as string, // JSON handled by Drizzle schema? No, better-sqlite3 needs stringify if we didn't use valid json mode.
        // Wait, I defined it as `text(..., { mode: 'json' })`. Drizzle handles parsing/stringifying.
        // But TS might complain about type mismatch if strict.
        createdAt: procedure.createdAt,
        createdBy: procedure.createdBy
    }).run();
    
    return procedure;
  }

  // --- Requests ---

  async getRequests(hqId: string): Promise<AppRequest[]> {
     const results = await db.select()
        .from(requests)
        .where(eq(requests.headquartersId, hqId))
        .all();
        
     return results.map(this.mapToRequest); 
  }

  async getUserRequests(hqId: string, userId: string): Promise<AppRequest[]> {
    const results = await db.select()
        .from(requests)
        .where(and(
            eq(requests.headquartersId, hqId),
            eq(requests.applicantId, userId)
        ))
        .all();

     return results.map(this.mapToRequest);
  }

  async createRequest(request: AppRequest): Promise<AppRequest> {
    await db.insert(requests).values({
        id: request.id,
        headquartersId: request.headquartersId,
        procedureId: request.procedureId,
        procedureName: request.procedureName,
        applicantId: request.applicantId,
        applicantName: request.applicantName,
        status: request.status,
        data: request.data as unknown as string, // Handled by mode: 'json'
        createdAt: request.createdAt,
        updatedAt: request.updatedAt
    }).run();
    return request;
  }

  async updateRequestStatus(id: string, status: RequestStatus, headquartersId: string): Promise<AppRequest> {
    // Verify ownership/HQ match implicitly by where clause or separate check?
    // Adapter interface implies we trust caller or we check.
    // For safety let's check or scope update.
    
    await db.update(requests)
        .set({ 
            status: status,
            updatedAt: new Date()
        })
        .where(and(
            eq(requests.id, id),
            eq(requests.headquartersId, headquartersId)
        ))
        .run();
        
    const updated = await db.select().from(requests).where(eq(requests.id, id)).get();
    if (!updated) throw new Error("Request not found");
    
    return this.mapToRequest(updated);
  }

  // --- Notifications ---

  async getNotifications(hqId: string): Promise<AppNotification[]> {
      const results = await db.select()
        .from(notifications)
        .where(eq(notifications.headquartersId, hqId))
        .all();
        
      return results.map(this.mapToNotification);
  }

  async createNotification(notification: AppNotification): Promise<AppNotification> {
      await db.insert(notifications).values({
        id: notification.id,
        headquartersId: notification.headquartersId,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        createdAt: notification.createdAt,
        createdBy: notification.createdBy
      }).run();
      
      return notification;
  }

  // --- Mappers ---

  private mapToHeadquarters(row: typeof headquarters.$inferSelect): Headquarters {
      return {
          id: row.id,
          name: row.name,
          description: row.description || undefined,
          createdAt: row.createdAt
      };
  }

  private mapToProcedure(row: typeof procedures.$inferSelect): Procedure {
      return {
          id: row.id,
          headquartersId: row.headquartersId,
          name: row.name,
          description: row.description,
          fields: row.fields as unknown as FormField[],
          createdAt: row.createdAt,
          createdBy: row.createdBy
      };
  }

  private mapToRequest(row: typeof requests.$inferSelect): AppRequest {
      return {
          id: row.id,
          headquartersId: row.headquartersId,
          procedureId: row.procedureId,
          procedureName: row.procedureName,
          applicantId: row.applicantId,
          applicantName: row.applicantName,
          status: row.status as RequestStatus,
          data: row.data as Record<string, unknown>,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt
      };
  }

  private mapToNotification(row: typeof notifications.$inferSelect): AppNotification {
      return {
          id: row.id,
          headquartersId: row.headquartersId,
          title: row.title,
          message: row.message,
          priority: row.priority as "low" | "medium" | "high",
          createdAt: row.createdAt,
          createdBy: row.createdBy
      };
  }
}
