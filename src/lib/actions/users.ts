'use server';

import { useCases } from '@/use-cases';
import { slaveAction } from '@/lib/safe-action';
import * as v from 'valibot';

export const getUserRoleAction = slaveAction
  .inputSchema(v.object({ userId: v.string(), headquartersId: v.string() }))
  .action(async ({ parsedInput: { userId, headquartersId } }) => {
    return useCases.users.getUserRole({ userId }, { headquartersId });
  });
