'use server';

import { useCases } from '@/use-cases';
import { Headquarters } from '@/lib/schemas/headquarters';
import { masterAction, slaveAction } from '@/lib/safe-action';
import {
  createHeadquartersSchema,
  updateHeadquartersSchema,
  getHeadquartersSchema,
  getUserHeadquartersRelationsSchema,
} from '@/lib/schemas/headquarters';

export const createHeadquarters = masterAction
  .inputSchema(createHeadquartersSchema)
  .action(async ({ parsedInput: { name, description }, ctx: { user } }) => {
    const newHeadquarters: Headquarters = {
      headquartersId: Date.now().toString(),
      name,
      description: description ?? null,
      createdAt: new Date(),
    };

    await useCases.headquarters.createHeadquarters(newHeadquarters, {
      userId: user.id,
    });

    return {
      ...newHeadquarters,
      userHeadquarters: [
        {
          userId: user.id,
          headquartersId: newHeadquarters.headquartersId,
          role: 'master',
        },
      ],
    };
  });

export const updateHeadquarters = masterAction
  .inputSchema(updateHeadquartersSchema)
  .action(
    async ({
      parsedInput: { headquartersId, name, description },
      ctx: { user },
    }) => {
      // Role check already done by middleware
      const updates: Partial<Headquarters> = { name };
      if (description !== undefined) {
        updates.description = description;
      }

      return useCases.headquarters.updateHeadquarters(
        headquartersId,
        updates,
        user
      );
    }
  );

export const getHeadquartersAction = slaveAction
  .inputSchema(getHeadquartersSchema)
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.headquarters.getHeadquarters({ headquartersId }, user);
  });

export const getUserHeadquartersRelationsAction = slaveAction
  .inputSchema(getUserHeadquartersRelationsSchema)
  .action(async ({ parsedInput: { userId } }) => {
    return useCases.headquarters.getUserHeadquarters({ userId });
  });

export const getUserHeadquartersObjectsAction = slaveAction
  .inputSchema(getUserHeadquartersRelationsSchema)
  .action(async ({ parsedInput: { userId } }) => {
    return useCases.headquarters.getUserHeadquartersObjects({ userId });
  });

export const getUserHeadquartersAction = slaveAction.action(
  async ({ ctx: { user } }) => {
    return useCases.headquarters.getUserHeadquartersObjects({
      userId: user.id,
    });
  }
);

export const getMasterHeadquartersAction = slaveAction.action(
  async ({ ctx: { user } }) => {
    return useCases.headquarters.getMasterHeadquarters({ userId: user.id });
  }
);
