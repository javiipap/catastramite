import {
  Headquarters,
  UserHeadquarters,
  UserRole,
  Procedure,
  Request as AppRequest,
  Notification as AppNotification,
  RequestStatus,
} from '@/lib/types';

export interface DatabaseAdapter {
  // Users
  getUserRole(userId: string, hqId: string): Promise<UserRole | null>;
  getUserHeadquarters(userId: string): Promise<UserHeadquarters[]>;
  getUserHeadquartersObjects(userId: string): Promise<Headquarters[]>;
  addUserToHeadquarters(uh: UserHeadquarters): Promise<void>;

  // Headquarters

  getHeadquartersById(id: string): Promise<Headquarters | undefined>;
  createHeadquarters(hq: Headquarters, userId: string): Promise<Headquarters>;
  updateHeadquarters(
    id: string,
    updates: Partial<Headquarters>
  ): Promise<Headquarters>;

  // Procedures
  getProcedures(hqId: string): Promise<Procedure[]>;
  createProcedure(procedure: Procedure): Promise<Procedure>;

  // Requests
  getRequests(hqId: string): Promise<AppRequest[]>;
  getUserRequests(hqId: string, userId: string): Promise<AppRequest[]>;
  createRequest(request: AppRequest): Promise<AppRequest>;
  updateRequestStatus(
    id: string,
    status: RequestStatus,
    headquartersId: string
  ): Promise<AppRequest>;

  // Notifications
  getNotifications(hqId: string): Promise<AppNotification[]>;
  createNotification(notification: AppNotification): Promise<AppNotification>;
}
