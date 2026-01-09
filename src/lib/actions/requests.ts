'use server';

import { readDB, writeDB } from '@/lib/db';
import { Request } from '@/lib/types';
import { adminAction, citizenAction } from '@/lib/safe-action';
import * as v from 'valibot';
import { getUserRole } from '@/lib/db/users';

const addRequestSchema = v.object({
  headquartersId: v.string(),
  procedureId: v.string(),
  procedureName: v.string(),
  applicantId: v.string(),
  applicantName: v.string(),
  status: v.picklist(["pending", "in_review", "approved", "rejected"]),
  data: v.record(v.string(), v.unknown()),
  userId: v.string(), 
});

export const addRequest = citizenAction
    .inputSchema(addRequestSchema)
    .action(async ({ parsedInput: request }) => {
        const { userId } = request;

        // Additional check: Ensure user creating is the applicant (implicit in safeAction context?)
        if (request.applicantId !== userId) {
            throw new Error('Unauthorized: Cannot create request for another user');
        }

        const role = await getUserRole(userId, request.headquartersId);
        if (!role) {
            throw new Error('Unauthorized: User not associated with headquarters');
        }

        const db = await readDB();
        const newRequest: Request = {
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
        
        db.requests.push(newRequest);
        await writeDB(db);
        return newRequest;
    });

const updateRequestStatusSchema = v.object({
  id: v.string(), 
  status: v.picklist(["pending", "in_review", "approved", "rejected"] as const),
  headquartersId: v.string(),
  userId: v.string(),
});

export const updateRequestStatus = adminAction
    .inputSchema(updateRequestStatusSchema)
    .action(async ({ parsedInput: { id, status, headquartersId } }) => {
        // Role checked by middleware using input.headquartersId
        const db = await readDB();
        const index = db.requests.findIndex((r) => r.id === id);
        if (index === -1) {
            throw new Error('Request not found');
        }
        
        if (db.requests[index].headquartersId !== headquartersId) {
             throw new Error('Mismatch: Request does not belong to the provided Headquarters');
        }

        db.requests[index] = { 
            ...db.requests[index], 
            status, 
            updatedAt: new Date() 
        };
        await writeDB(db);
        return db.requests[index];
    });

