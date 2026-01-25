"use server";

import { useCases } from "@/use-cases";
import type { Request as AppRequest } from "@/lib/schemas/requests";
import { mutateHeadquartersAction, slaveAction } from "@/lib/safe-action";
import {
  createRequestSchema,
  updateRequestStatusSchema,
  getRequestsSchema,
} from "@/lib/schemas/requests";

export const addRequestAction = mutateHeadquartersAction(
  createRequestSchema,
  async (request, { user }) => {
    if (request.applicantId !== user.userId) {
      throw new Error("Unauthorized: Cannot create request for another user");
    }

    const newRequest: AppRequest = {
      requestId: Date.now().toString(),
      headquartersId: request.headquartersId,
      procedureId: request.procedureId,
      procedureName: request.procedureName,
      applicantId: request.applicantId,
      applicantName: request.applicantName,
      status: request.status,
      data: request.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return useCases.requests.createRequest(newRequest, user);
  },
);

export const updateRequestStatusAction = mutateHeadquartersAction(
  updateRequestStatusSchema,
  async ({ requestId, status, headquartersId, feedback }, { user }) => {
    return useCases.requests.updateRequestStatus(
      requestId,
      status,
      { headquartersId },
      user,
      feedback,
    );
  },
);

export const getRequestsAction = slaveAction
  .inputSchema(getRequestsSchema)
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.requests.getRequests({ headquartersId }, user);
  });

export const getUserRequestsAction = slaveAction
  .inputSchema(getRequestsSchema)
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.requests.getUserRequests({ headquartersId }, user);
  });
