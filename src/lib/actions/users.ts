'use server';

import { useCases } from '@/use-cases';
import { adminAction, slaveAction } from '@/lib/safe-action';
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
    await useCases.users.addUserToHeadquarters(userHeadquarters);
    return userHeadquarters;
  });

export const getUserHeadquartersAction = slaveAction
  .inputSchema(v.object({ userId: v.string() }))
  .action(async ({ parsedInput: { userId } }) => {
    return useCases.users.getUserHeadquarters({ userId });
  });

export const getUserHeadquartersObjectsAction = slaveAction
  .inputSchema(v.object({ userId: v.string() }))
  .action(async ({ parsedInput: { userId } }) => {
    return useCases.users.getUserHeadquartersObjects({ userId });
  });

export const getUserRoleAction = slaveAction
  .inputSchema(v.object({ userId: v.string(), headquartersId: v.string() }))
  .action(async ({ parsedInput: { userId, headquartersId } }) => {
    return useCases.users.getUserRole({ userId }, { headquartersId });
  });
