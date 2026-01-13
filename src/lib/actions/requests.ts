'use server';

import { useCases } from '@/use-cases';
import { Request as AppRequest } from '@/lib/types';
import { masterAction, slaveAction } from '@/lib/safe-action';
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
  .action(async ({ parsedInput: request, ctx: { user } }) => {
    // Additional check: Ensure user creating is the applicant (implicit in safeAction context?)
    if (request.applicantId !== user.id) {
      throw new Error('Unauthorized: Cannot create request for another user');
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

    return useCases.requests.createRequest(newRequest, user);
  });

const updateRequestStatusSchema = v.object({
  id: v.string(),
  status: v.picklist(['pending', 'in_review', 'approved', 'rejected'] as const),
  headquartersId: v.string(),
});

export const updateRequestStatus = masterAction
  .inputSchema(updateRequestStatusSchema)
  .action(
    async ({ parsedInput: { id, status, headquartersId }, ctx: { user } }) => {
      return useCases.requests.updateRequestStatus(
        id,
        status,
        { headquartersId },
        user
      );
    }
  );

export const getRequestsAction = slaveAction
  .inputSchema(v.object({ headquartersId: v.string() }))
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.requests.getRequests({ headquartersId }, user);
  });

export const getUserRequestsAction = slaveAction
  .inputSchema(v.object({ headquartersId: v.string() }))
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.requests.getUserRequests({ headquartersId }, user);
  });
