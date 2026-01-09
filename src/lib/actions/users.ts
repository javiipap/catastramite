'use server';

import { readDB, writeDB } from '@/lib/db';
import { adminAction } from '@/lib/safe-action';
import * as v from 'valibot';

const addUserToSedeSchema = v.object({
    userSede: v.object({
        userId: v.string(),
        sedeId: v.string(),
        role: v.picklist(['administrador', 'administrado']),
    }),
});

export const addUserToSede = adminAction
    .inputSchema(addUserToSedeSchema)
    .action(async ({ parsedInput: { userSede } }) => {
      const db = await readDB();
      // Check if exists
      const exists = db.userSedes.some(
        (us) => us.userId === userSede.userId && us.sedeId === userSede.sedeId
      );
      
      if (!exists) {
          db.userSedes.push(userSede);
          await writeDB(db);
      }
      
      return userSede;
    });
