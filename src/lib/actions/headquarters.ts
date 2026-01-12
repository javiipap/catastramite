'use server';

import { useCases } from '@/use-cases';
import { Headquarters } from '@/lib/types';
import { adminAction, slaveAction } from '@/lib/safe-action';
import * as v from 'valibot';

const createHeadquartersSchema = v.object({
  name: v.string(),
  description: v.optional(v.string()),
  userId: v.string(),
});

export const createHeadquarters = slaveAction
  .inputSchema(createHeadquartersSchema)
  .action(async ({ parsedInput: { name, description, userId } }) => {
    const newHeadquarters: Headquarters = {
      headquartersId: Date.now().toString(),
      name,
      description,
      createdAt: new Date(),
    };

    await useCases.headquarters.createHeadquarters(newHeadquarters, { userId });

    // Return with relation
    return {
      ...newHeadquarters,
      userHeadquarters: [
        {
          userId,
          headquartersId: newHeadquarters.headquartersId,
          role: 'master',
        },
      ],
    };
  });

const updateHeadquartersSchema = v.object({
  id: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  userId: v.string(),
  headquartersId: v.string(), // We will pass headquartersId explicitly for the check
});

export const updateHeadquarters = adminAction
  .inputSchema(updateHeadquartersSchema)
  .action(async ({ parsedInput: { id, name, description } }) => {
    // Role check already done by middleware
    const updates: Partial<Headquarters> = { name };
    if (description !== undefined) {
      updates.description = description;
    }

    return useCases.headquarters.updateHeadquarters(id, updates);
  });
