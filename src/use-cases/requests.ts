import { DatabaseAdapter } from "@/lib/db/types";
import {
  Request as AppRequest,
  RequestStatus,
  UserHeadquarters,
} from "@/lib/types";
import { User } from "@/lib/types";
import {
  sendRequestCreatedEmail,
  sendRequestStatusUpdatedEmail,
} from "@/services/email";

export class RequestsUseCases {
  constructor(private db: DatabaseAdapter) {}

  async createRequest(
    request: AppRequest,
    user: Pick<User, "userId">,
  ): Promise<AppRequest> {
    if (request.applicantId !== user.userId) {
      throw new Error("Unauthorized: Cannot create request for another user");
    }
    const role = await this.db.getUserRole(user.userId, request.headquartersId);
    if (!role) {
      throw new Error("Unauthorized: Access denied");
    }

    const newRequest = await this.db.createRequest(request);

    // Send emails
    const hqUsers = await this.db.getUsersByHeadquarters(
      request.headquartersId,
    );
    const applicant = hqUsers.find((u) => u.userId === user.userId);
    const masters = hqUsers.filter((u) => u.role === "master");

    if (applicant) {
      await sendRequestCreatedEmail(
        applicant.name,
        applicant.email,
        request.procedureName,
        newRequest.requestId,
      );
    }

    await Promise.allSettled(
      masters.map((master) =>
        sendRequestCreatedEmail(
          master.name,
          master.email,
          request.procedureName,
          newRequest.requestId,
        ),
      ),
    );

    return newRequest;
  }

  async getRequests(
    hq: Pick<UserHeadquarters, "headquartersId">,
    user: Pick<User, "userId">,
  ): Promise<AppRequest[]> {
    const role = await this.db.getUserRole(user.userId, hq.headquartersId);
    if (role !== "master") {
      throw new Error("Unauthorized: Master access required");
    }
    return this.db.getRequests(hq.headquartersId);
  }

  async getUserRequests(
    hq: Pick<UserHeadquarters, "headquartersId">,
    user: Pick<User, "userId">,
  ): Promise<AppRequest[]> {
    const role = await this.db.getUserRole(user.userId, hq.headquartersId);
    if (!role) {
      throw new Error("Unauthorized: Access denied");
    }
    return this.db.getUserRequests(hq.headquartersId, user.userId);
  }

  async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    hq: Pick<UserHeadquarters, "headquartersId">,
    user: Pick<User, "userId">,
    feedback?: string,
  ): Promise<AppRequest> {
    const role = await this.db.getUserRole(user.userId, hq.headquartersId);
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
