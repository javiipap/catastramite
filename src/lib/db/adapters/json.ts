import fs from "fs/promises";
import path from "path";
import { DatabaseAdapter } from "../types";
import {
  Headquarters,
  UserHeadquarters,
  Procedure,
  Request as AppRequest,
  Notification as AppNotification,
  UserRole,
  RequestStatus,
  User,
} from "@/lib/types";

const DB_PATH = path.join(process.cwd(), "data.json");

interface DB {
  headquarters: Headquarters[];
  userHeadquarters: UserHeadquarters[];
  notifications: AppNotification[];
  procedures: Procedure[];
  requests: AppRequest[];
  users: User[];
}

const INITIAL_DB: DB = {
  headquarters: [
    {
      headquartersId: "1",
      name: "Ayuntamiento de Madrid",
      description: "Sede electrónica del Ayuntamiento de Madrid",
      createdAt: new Date("2025-01-01"),
    },
    {
      headquartersId: "2",
      name: "Comunidad Autónoma de Madrid",
      description: "Sede electrónica de la Comunidad de Madrid",
      createdAt: new Date("2025-01-01"),
    },
  ],
  userHeadquarters: [
    { userId: "1", headquartersId: "1", role: "master" },
    { userId: "1", headquartersId: "2", role: "master" },
    { userId: "2", headquartersId: "1", role: "slave" },
    { userId: "2", headquartersId: "2", role: "slave" },
  ],
  notifications: [],
  procedures: [],
  requests: [],
  users: [
    {
      userId: "1",
      name: "Admin User",
      email: "admin@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
      role: "master" as any,
    },
    {
      userId: "2",
      name: "Standard User",
      email: "user@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
      role: "slave" as any,
    },
  ],
};

function reviver(key: string, value: unknown) {
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
  ) {
    return new Date(value);
  }
  return value;
}

async function readDB(): Promise<DB> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data, reviver);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await writeDB(INITIAL_DB);
      return INITIAL_DB;
    }
    throw error;
  }
}

async function writeDB(data: DB): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export class JsonAdapter implements DatabaseAdapter {
  async getUserRole(
    userId: string,
    headquartersId: string,
  ): Promise<UserRole | null> {
    const db = await readDB();
    const relation = db.userHeadquarters.find(
      (uh) => uh.userId === userId && uh.headquartersId === headquartersId,
    );
    return relation?.role || null;
  }

  async getUserHeadquarters(userId: string): Promise<UserHeadquarters[]> {
    const db = await readDB();
    return db.userHeadquarters.filter((uh) => uh.userId === userId);
  }

  async getUserHeadquartersObjects(userId: string): Promise<Headquarters[]> {
    const db = await readDB();
    const relations = db.userHeadquarters.filter((uh) => uh.userId === userId);
    const hqIds = relations.map((uh) => uh.headquartersId);
    return db.headquarters
      .filter((h) => hqIds.includes(h.headquartersId))
      .map((h) => ({
        ...h,
        userHeadquarters: relations.filter(
          (r) => r.headquartersId === h.headquartersId,
        ),
      }));
  }

  async addUserToHeadquarters(uh: UserHeadquarters): Promise<void> {
    const db = await readDB();
    const exists = db.userHeadquarters.some(
      (item) =>
        item.userId === uh.userId && item.headquartersId === uh.headquartersId,
    );

    if (!exists) {
      db.userHeadquarters.push(uh);
      await writeDB(db);
    }
  }

  async getUsersByHeadquarters(
    hqId: string,
  ): Promise<(User & { role: UserRole })[]> {
    const db = await readDB();
    const relations = db.userHeadquarters.filter(
      (uh) => uh.headquartersId === hqId,
    );

    const results: (User & { role: UserRole })[] = [];
    for (const rel of relations) {
      const user = db.users.find((u) => u.userId === rel.userId);
      if (user) {
        results.push({ ...user, role: rel.role });
      }
    }
    return results;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await readDB();
    return db.users.find((u) => u.email === email);
  }

  async getUser(userId: string): Promise<User | undefined> {
    const db = await readDB();
    return db.users.find((u) => u.userId === userId);
  }

  async createUser(user: User): Promise<User> {
    const db = await readDB();
    db.users.push(user);
    await writeDB(db);
    return user;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const db = await readDB();
    const index = db.users.findIndex((u) => u.userId === userId);
    if (index === -1) throw new Error("User not found");

    db.users[index] = { ...db.users[index], ...data, updatedAt: new Date() };
    await writeDB(db);
    return db.users[index];
  }

  async removeUserFromHeadquarters(
    userId: string,
    hqId: string,
  ): Promise<void> {
    const db = await readDB();
    db.userHeadquarters = db.userHeadquarters.filter(
      (uh) => !(uh.userId === userId && uh.headquartersId === hqId),
    );
    await writeDB(db);
  }

  async updateUserRoleInHeadquarters(
    userId: string,
    hqId: string,
    role: UserRole,
  ): Promise<void> {
    const db = await readDB();
    const index = db.userHeadquarters.findIndex(
      (uh) => uh.userId === userId && uh.headquartersId === hqId,
    );
    if (index !== -1) {
      db.userHeadquarters[index].role = role;
      await writeDB(db);
    }
  }

  async getHeadquartersById(id: string): Promise<Headquarters | undefined> {
    const db = await readDB();
    return db.headquarters.find((hq) => hq.headquartersId === id);
  }

  async createHeadquarters(
    hq: Headquarters,
    userId: string,
  ): Promise<Headquarters> {
    const db = await readDB();
    db.headquarters.push(hq);
    db.userHeadquarters.push({
      userId,
      headquartersId: hq.headquartersId,
      role: "master",
    });
    await writeDB(db);
    return hq;
  }

  async updateHeadquarters(
    id: string,
    updates: Partial<Headquarters>,
  ): Promise<Headquarters> {
    const db = await readDB();
    const index = db.headquarters.findIndex((h) => h.headquartersId === id);
    if (index === -1) throw new Error("Headquarters not found");

    db.headquarters[index] = { ...db.headquarters[index], ...updates };
    await writeDB(db);
    return db.headquarters[index];
  }

  async getProcedures(headquartersId: string): Promise<Procedure[]> {
    const db = await readDB();
    return db.procedures.filter((p) => p.headquartersId === headquartersId);
  }

  async createProcedure(procedure: Procedure): Promise<Procedure> {
    const db = await readDB();
    db.procedures.push(procedure);
    await writeDB(db);
    return procedure;
  }

  async getRequests(headquartersId: string): Promise<AppRequest[]> {
    const db = await readDB();
    return db.requests.filter((r) => r.headquartersId === headquartersId);
  }

  async getUserRequests(
    headquartersId: string,
    userId: string,
  ): Promise<AppRequest[]> {
    const db = await readDB();
    return db.requests.filter(
      (r) => r.applicantId === userId && r.headquartersId === headquartersId,
    );
  }

  async createRequest(request: AppRequest): Promise<AppRequest> {
    const db = await readDB();
    db.requests.push(request);
    await writeDB(db);
    return request;
  }

  async updateRequestStatus(
    id: string,
    status: RequestStatus,
    headquartersId: string,
    feedback?: string,
  ): Promise<AppRequest> {
    const db = await readDB();
    const index = db.requests.findIndex((r) => r.requestId === id);
    if (index === -1) throw new Error("Request not found");
    if (db.requests[index].headquartersId !== headquartersId)
      throw new Error("Request mismatch");

    db.requests[index].status = status;
    if (feedback !== undefined) {
      db.requests[index].feedback = feedback;
    }
    db.requests[index].updatedAt = new Date();
    await writeDB(db);
    return db.requests[index];
  }

  async getNotifications(headquartersId: string): Promise<AppNotification[]> {
    const db = await readDB();
    return db.notifications.filter((n) => n.headquartersId === headquartersId);
  }

  async createNotification(
    notification: AppNotification,
  ): Promise<AppNotification> {
    const db = await readDB();
    db.notifications.push(notification);
    await writeDB(db);
    return notification;
  }
}
