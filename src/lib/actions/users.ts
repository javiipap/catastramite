"use server";

import { useCases } from "@/use-cases";
import { slaveAction } from "@/lib/safe-action";
import { getUserRoleSchema, updateUserSchema } from "@/lib/schemas/users";

export const getUserRoleAction = slaveAction
  .inputSchema(getUserRoleSchema)
  .action(async ({ parsedInput: { userId, headquartersId } }) => {
    return useCases.users.getUserRole({ userId }, { headquartersId });
  });

export const updateUserAction = slaveAction
  .inputSchema(updateUserSchema) // Use slaveAction/mutateAction but we need context of current user.
  // Actually, wait, updateUserAction should update the CURRENT user right?
  // slaveAction gives us ctx.user.
  // But wait, slaveAction requires headquarters? No, it just checks session authorized.
  // Check safe-action.ts: slaveAction just checks session.authorized and returns user.
  .action(async ({ parsedInput, ctx: { user } }) => {
    return useCases.users.updateUser(user.userId, parsedInput);
  });
