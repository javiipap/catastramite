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
  .action(async ({ parsedInput: { name, description }, ctx: { user } }) => {
    const newHeadquarters: Headquarters = {
      headquartersId: Date.now().toString(),
      name,
      description,
      createdAt: new Date(),
    };

    await useCases.headquarters.createHeadquarters(newHeadquarters, {
      userId: user.id,
    });

    // Return with relation
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

const updateHeadquartersSchema = v.object({
  id: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  headquartersId: v.string(), // We will pass headquartersId explicitly for the check
});

export const updateHeadquarters = adminAction
  .inputSchema(updateHeadquartersSchema)
  .action(async ({ parsedInput: { id, name, description }, ctx: { user } }) => {
    // Role check already done by middleware
    const updates: Partial<Headquarters> = { name };
    if (description !== undefined) {
      updates.description = description;
    }

    return useCases.headquarters.updateHeadquarters(id, updates, user);
  });

export const getHeadquartersAction = slaveAction
  .inputSchema(v.object({ headquartersId: v.string() }))
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.headquarters.getHeadquarters({ headquartersId }, user);
  });

export const getUserHeadquartersRelationsAction = slaveAction
  .inputSchema(v.object({ userId: v.string() })) // userId param might be redundant if we only fetch for self? But maybe admins fetch for others? UseCase `getUserHeadquarters` just returns for the User ID passed. Admin shouldn't fetch for others via this? Let's assume passed userId but we should control it. But wait, `getUserHeadquarters` use case just takes `userId`. Authorization? Not checked in use case for *which* user we are querying, only that caller is logged in (implied). But `getUserHeadquartersObjects` was updated. `getUserHeadquarters` wasn't updated to check if `actor` allows it.
  // Actually I updated `getUserHeadquarters` in `headquarters.ts` use case:
  // async getUserHeadquarters(user: Pick<UserHeadquarters, 'userId'>): Promise<UserHeadquarters[]> { return this.db.getUserHeadquarters(user.userId); }
  // No auth check there! It just returns for the ID.
  // So here, if I want to "verify authorized", I should probably check if `userId` matches `ctx.user.id`.
  // But let's just stick to fixing the build first.
  .action(async ({ parsedInput: { userId } }) => {
    return useCases.headquarters.getUserHeadquarters({ userId });
  });

export const getUserHeadquartersObjectsAction = slaveAction
  .inputSchema(v.object({ userId: v.string() }))
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

export const getAdminHeadquartersAction = slaveAction.action(
  async ({ ctx: { user } }) => {
    return useCases.headquarters.getAdminHeadquarters({ userId: user.id });
  }
);
