import { DatabaseAdapter } from "@/lib/db/types";
import {
  Request as AppRequest,
  RequestStatus,
  UserHeadquarters,
} from "@/lib/types";
import { User } from "better-auth";
import {
  sendRequestCreatedEmail,
  sendRequestStatusUpdatedEmail,
} from "@/services/email";

export class RequestsUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createRequest(
    request: AppRequest,
    user: Pick<User, "id">,
  ): Promise<AppRequest> {
    if (request.applicantId !== user.id) {
      throw new Error("Unauthorized: Cannot create request for another user");
    }
    const role = await this.db.getUserRole(user.id, request.headquartersId);
    if (!role) {
      throw new Error("Unauthorized: Access denied");
    }

    const newRequest = await this.db.createRequest(request);

    // Send emails
    const hqUsers = await this.db.getUsersByHeadquarters(
      request.headquartersId,
    );
    const applicant = hqUsers.find((u) => u.userId === user.id);
    const masters = hqUsers.filter((u) => u.role === "master");

    if (applicant) {
      await sendRequestCreatedEmail(
        applicant.name,
        applicant.email,
        request.procedureName,
        newRequest.requestId,
      );
    }

    for (const master of masters) {
      // Avoid sending double email if master is also applicant (unlikely but possible)
      if (master.userId !== user.id) {
        await sendRequestCreatedEmail(
          master.name,
          master.email,
          request.procedureName,
          newRequest.requestId,
        );
      }
    }

    return newRequest;
  }

  async getRequests(
    hq: Pick<UserHeadquarters, "headquartersId">,
    user: Pick<User, "id">,
  ): Promise<AppRequest[]> {
    const role = await this.db.getUserRole(user.id, hq.headquartersId);
    if (role !== "master") {
      throw new Error("Unauthorized: Master access required");
    }
    return this.db.getRequests(hq.headquartersId);
  }

  async getUserRequests(
    hq: Pick<UserHeadquarters, "headquartersId">,
    user: Pick<User, "id">,
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
    feedback?: string,
  ): Promise<AppRequest> {
    const role = await this.db.getUserRole(user.id, hq.headquartersId);
    if (role !== "master") {
      throw new Error("Unauthorized: Master access required");
    }
    const updatedRequest = await this.db.updateRequestStatus(
      requestId,
      status,
      hq.headquartersId,
      feedback,
    );

    // Send email to applicant
    const hqUsers = await this.db.getUsersByHeadquarters(hq.headquartersId);
    const applicant = hqUsers.find(
      (u) => u.userId === updatedRequest.applicantId,
    );

    if (applicant) {
      await sendRequestStatusUpdatedEmail(
        applicant.name,
        applicant.email,
        updatedRequest.procedureName,
        updatedRequest.requestId,
        status,
        feedback,
      );
    }

    return updatedRequest;
  }
}
