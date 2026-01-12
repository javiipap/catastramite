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

export const getHeadquartersAction = slaveAction
  .inputSchema(v.object({ headquartersId: v.string() }))
  .action(async ({ parsedInput: { headquartersId } }) => {
    return useCases.headquarters.getHeadquarters({ headquartersId });
  });

export const addUserToHeadquarters = adminAction
  .inputSchema(
    v.object({
      userHeadquarters: v.object({
        userId: v.string(),
        headquartersId: v.string(),
        role: v.picklist(['master', 'slave']),
      }),
    })
  )
  .action(async ({ parsedInput: { userHeadquarters } }) => {
    await useCases.headquarters.addUserToHeadquarters(userHeadquarters);
    return userHeadquarters;
  });

export const getUserHeadquartersRelationsAction = slaveAction
  .inputSchema(v.object({ userId: v.string() }))
  .action(async ({ parsedInput: { userId } }) => {
    return useCases.headquarters.getUserHeadquarters({ userId });
  });

export const getUserHeadquartersObjectsAction = slaveAction
  .inputSchema(v.object({ userId: v.string() }))
  .action(async ({ parsedInput: { userId } }) => {
    return useCases.headquarters.getUserHeadquartersObjects({ userId });
  });

export const getUserHeadquartersAction = slaveAction.action(
  async ({ ctx: { userId } }) => {
    return useCases.headquarters.getUserHeadquartersObjects({ userId });
  }
);

export const getAdminHeadquartersAction = slaveAction.action(
  async ({ ctx: { userId } }) => {
    return useCases.headquarters.getAdminHeadquarters({ userId });
  }
);
