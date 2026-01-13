import { z } from 'zod';
import { userHeadquartersSchema } from './users';

export const headquartersSchema = z.object({
  headquartersId: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.date(),
  userHeadquarters: z.array(userHeadquartersSchema).optional(),
});

export const createHeadquartersSchema = headquartersSchema
  .pick({
    name: true,
  })
  .extend({
    description: z.string().optional(),
  });

export const updateHeadquartersSchema = headquartersSchema
  .pick({
    headquartersId: true,
    name: true,
  })
  .extend({
    description: z.string().optional(),
    // headquartersId: z.string(), // Already picked
  });

export const getHeadquartersSchema = z.object({
  headquartersId: z.string(),
});

export const getUserHeadquartersRelationsSchema = z.object({
  userId: z.string(),
});

export type Headquarters = z.infer<typeof headquartersSchema>;
