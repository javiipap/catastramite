'use server';

import { useCases } from '@/use-cases';
import { masterAction } from '@/lib/safe-action';
import * as v from 'valibot';
import { revalidatePath } from 'next/cache';

export const getHeadquartersUsersAction = masterAction
  .inputSchema(v.object({ headquartersId: v.string() }))
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.headquarters.getHeadquartersUsers({ headquartersId }, user);
  });

export const addUserToHeadquartersAction = masterAction
  .inputSchema(
    v.object({
      headquartersId: v.string(),
      email: v.string(),
      role: v.picklist(['master', 'slave']),
    })
  )
  .action(
    async ({
      parsedInput: { headquartersId, email, role },
      ctx: { user: actor },
    }) => {
      const user = await useCases.headquarters.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      await useCases.headquarters.addUserToHeadquarters(
        {
          userId: user.id,
          headquartersId: headquartersId,
          role: role,
        },
        actor
      );

      revalidatePath(`/master/${headquartersId}/users`);
    }
  );

export const removeUserFromHeadquartersAction = masterAction
  .inputSchema(
    v.object({
      headquartersId: v.string(),
      userId: v.string(),
    })
  )
  .action(
    async ({
      parsedInput: { headquartersId, userId },
      ctx: { user: actor },
    }) => {
      await useCases.headquarters.removeUserFromHeadquarters(
        userId,
        headquartersId,
        actor
      );
      revalidatePath(`/master/${headquartersId}/users`);
    }
  );
