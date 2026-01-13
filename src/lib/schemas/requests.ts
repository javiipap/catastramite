import { z } from 'zod';

export const requestStatusSchema = z.enum([
  'pending',
  'in_review',
  'approved',
  'rejected',
]);

export const requestSchema = z.object({
  requestId: z.string(),
  headquartersId: z.string(),
  procedureId: z.string(),
  procedureName: z.string(),
  applicantId: z.string(),
  applicantName: z.string(),
  status: requestStatusSchema,
  data: z.record(z.string(), z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createRequestSchema = requestSchema.pick({
  headquartersId: true,
  procedureId: true,
  procedureName: true,
  applicantId: true,
  applicantName: true,
  status: true,
  data: true,
});

export const updateRequestStatusSchema = requestSchema
  .pick({
    requestId: true,
    status: true,
  })
  .extend({
    headquartersId: z.string(),
  });

export const getRequestsSchema = z.object({
  headquartersId: z.string(),
});

export type RequestStatus = z.infer<typeof requestStatusSchema>;
export type Request = z.infer<typeof requestSchema>;
