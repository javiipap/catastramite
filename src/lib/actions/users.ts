'use server';

import { useCases } from '@/use-cases';
import { slaveAction } from '@/lib/safe-action';
import { getUserRoleSchema } from '@/lib/schemas/users';

export const getUserRoleAction = slaveAction
  .inputSchema(getUserRoleSchema)
  .action(async ({ parsedInput: { userId, headquartersId } }) => {
    return useCases.users.getUserRole({ userId }, { headquartersId });
  });
