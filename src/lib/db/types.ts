import {
  Headquarters,
  UserHeadquarters,
  UserRole,
  Procedure,
  Request as AppRequest,
  Notification as AppNotification,
  RequestStatus,
  User,
} from "@/lib/types";

export interface DatabaseAdapter {
  // Users
  getUserRole(userId: string, headquartersId: string): Promise<UserRole | null>;
  getUserHeadquarters(userId: string): Promise<UserHeadquarters[]>;
  getUserHeadquartersObjects(userId: string): Promise<Headquarters[]>;
  getUserHeadquartersObjects(userId: string): Promise<Headquarters[]>;
  addUserToHeadquarters(uh: UserHeadquarters): Promise<void>;
  getUsersByHeadquarters(
    headquartersId: string
  ): Promise<(User & { role: UserRole })[]>;
  getUserByEmail(email: string): Promise<User | undefined>;
  removeUserFromHeadquarters(
    userId: string,
    headquartersId: string
  ): Promise<void>;

  // Headquarters

  getHeadquartersById(
    headquartersId: string
  ): Promise<Headquarters | undefined>;
  createHeadquarters(hq: Headquarters, userId: string): Promise<Headquarters>;
  updateHeadquarters(
    headquartersId: string,
    updates: Partial<Headquarters>
  ): Promise<Headquarters>;

  // Procedures
  getProcedures(headquartersId: string): Promise<Procedure[]>;
  createProcedure(procedure: Procedure): Promise<Procedure>;

  // Requests
  getRequests(headquartersId: string): Promise<AppRequest[]>;
  getUserRequests(
    headquartersId: string,
    userId: string
  ): Promise<AppRequest[]>;
  createRequest(request: AppRequest): Promise<AppRequest>;
  updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    headquartersId: string,
    feedback?: string
  ): Promise<AppRequest>;

  // Notifications
  getNotifications(headquartersId: string): Promise<AppNotification[]>;
  createNotification(notification: AppNotification): Promise<AppNotification>;
}
