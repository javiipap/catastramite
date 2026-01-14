import { DatabaseAdapter } from "@/lib/db/types";
import {
  Request as AppRequest,
  RequestStatus,
  UserHeadquarters,
} from "@/lib/types";
import { User } from "better-auth";

export class RequestsUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createRequest(
    request: AppRequest,
    user: Pick<User, "id">
  ): Promise<AppRequest> {
    if (request.applicantId !== user.id) {
      throw new Error("Unauthorized: Cannot create request for another user");
    }
    const role = await this.db.getUserRole(user.id, request.headquartersId);
    if (!role) {
      throw new Error("Unauthorized: Access denied");
    }
    return this.db.createRequest(request);
  }

  async getRequests(
    hq: Pick<UserHeadquarters, "headquartersId">,
    user: Pick<User, "id">
  ): Promise<AppRequest[]> {
    const role = await this.db.getUserRole(user.id, hq.headquartersId);
    if (role !== "master") {
      throw new Error("Unauthorized: Master access required");
    }
    return this.db.getRequests(hq.headquartersId);
  }

  async getUserRequests(
    hq: Pick<UserHeadquarters, "headquartersId">,
    user: Pick<User, "id">
  ): Promise<AppRequest[]> {
    const role = await this.db.getUserRole(user.id, hq.headquartersId);
    if (!role) {
      throw new Error("Unauthorized: Access denied");
    }
    return this.db.getUserRequests(hq.headquartersId, user.id);
  }

  async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    hq: Pick<UserHeadquarters, "headquartersId">,
    user: Pick<User, "id">,
    feedback?: string
  ): Promise<AppRequest> {
    const role = await this.db.getUserRole(user.id, hq.headquartersId);
    if (role !== "master") {
      throw new Error("Unauthorized: Master access required");
    }
    return this.db.updateRequestStatus(
      requestId,
      status,
      hq.headquartersId,
      feedback
    );
  }
}
