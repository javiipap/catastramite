'use server';

import { useCases } from '@/use-cases';
import { Request as AppRequest } from '@/lib/types';
import { adminAction, slaveAction } from '@/lib/safe-action';
import * as v from 'valibot';

const addRequestSchema = v.object({
  headquartersId: v.string(),
  procedureId: v.string(),
  procedureName: v.string(),
  applicantId: v.string(),
  applicantName: v.string(),
  status: v.picklist(['pending', 'in_review', 'approved', 'rejected']),
  data: v.record(v.string(), v.unknown()),
  userId: v.string(),
});

export const addRequest = slaveAction
  .inputSchema(addRequestSchema)
  .action(async ({ parsedInput: request }) => {
    const { userId } = request;

    // Additional check: Ensure user creating is the applicant (implicit in safeAction context?)
    if (request.applicantId !== userId) {
      throw new Error('Unauthorized: Cannot create request for another user');
    }

    const role = await useCases.users.getUserRole(
      { userId },
      { headquartersId: request.headquartersId }
    );
    if (!role) {
      throw new Error('Unauthorized: User not associated with headquarters');
    }

    const newRequest: AppRequest = {
      id: Date.now().toString(),
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

    return useCases.requests.createRequest(newRequest);
  });

const updateRequestStatusSchema = v.object({
  id: v.string(),
  status: v.picklist(['pending', 'in_review', 'approved', 'rejected'] as const),
  headquartersId: v.string(),
  userId: v.string(),
});

export const updateRequestStatus = adminAction
  .inputSchema(updateRequestStatusSchema)
  .action(async ({ parsedInput: { id, status, headquartersId } }) => {
    // Role checked by middleware using input.headquartersId

    return useCases.requests.updateRequestStatus(id, status, {
      headquartersId,
    });
  });

export const getRequestsAction = slaveAction
  .inputSchema(v.object({ headquartersId: v.string() }))
  .action(async ({ parsedInput: { headquartersId } }) => {
    return useCases.requests.getRequests({ headquartersId });
  });

export const getUserRequestsAction = slaveAction
  .inputSchema(v.object({ headquartersId: v.string() }))
  .action(async ({ parsedInput: { headquartersId } }) => {
    return useCases.requests.getUserRequests({ headquartersId });
  });
