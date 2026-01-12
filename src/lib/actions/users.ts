'use server';

import { db } from '@/lib/db';
import { adminAction } from '@/lib/safe-action';
import * as v from 'valibot';

const addUserToHeadquartersSchema = v.object({
    userHeadquarters: v.object({
        userId: v.string(),
        headquartersId: v.string(),
        role: v.picklist(['master', 'slave']),
    }),
});

export const addUserToHeadquarters = adminAction
    .inputSchema(addUserToHeadquartersSchema)
    .action(async ({ parsedInput: { userHeadquarters } }) => {
      await db.addUserToHeadquarters(userHeadquarters);
      return userHeadquarters;
    });
