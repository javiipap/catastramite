import { z } from 'zod';

export const formFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['text', 'number', 'date', 'email', 'textarea', 'select']),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

export const procedureSchema = z.object({
  procedureId: z.string(),
  headquartersId: z.string(),
  name: z.string(),
  description: z.string(),
  fields: z.array(formFieldSchema),
  createdAt: z.date(),
  createdBy: z.string(),
});

export const createProcedureSchema = procedureSchema.pick({
  headquartersId: true,
  name: true,
  description: true,
  fields: true,
});

export const getProceduresSchema = z.object({
  headquartersId: z.string(),
});

export type FormField = z.infer<typeof formFieldSchema>;
export type Procedure = z.infer<typeof procedureSchema>;
