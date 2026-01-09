'use server';

import { readDB, writeDB } from '@/lib/db';
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
      const db = await readDB();
      // Check if exists
      const exists = db.userHeadquarters.some(
        (uh) => uh.userId === userHeadquarters.userId && uh.headquartersId === userHeadquarters.headquartersId
      );
      
      if (!exists) {
          db.userHeadquarters.push(userHeadquarters);
          await writeDB(db);
      }
      
      return userHeadquarters;
    });
