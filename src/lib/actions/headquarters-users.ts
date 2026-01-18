"use server";

import { useCases } from "@/use-cases";
import { masterAction, mutateHeadquartersAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import {
  getHeadquartersUsersSchema,
  addUserToHeadquartersSchema,
  removeUserFromHeadquartersSchema,
} from "@/lib/schemas/users";

export const getHeadquartersUsersAction = masterAction
  .inputSchema(getHeadquartersUsersSchema)
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.headquarters.getHeadquartersUsers({ headquartersId }, user);
  });

export const addUserToHeadquartersAction = mutateHeadquartersAction(
  addUserToHeadquartersSchema,
  async ({ headquartersId, email, role }, { user: actor }) => {
    const user = await useCases.headquarters.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    await useCases.headquarters.addUserToHeadquarters(
      {
        userId: user.userId,
        headquartersId: headquartersId,
        role: role,
      },
      actor,
    );

    revalidatePath(`/master/${headquartersId}/users`);
  },
);

export const removeUserFromHeadquartersAction = mutateHeadquartersAction(
  removeUserFromHeadquartersSchema,
  async ({ headquartersId, userId }, { user: actor }) => {
    await useCases.headquarters.removeUserFromHeadquarters(
      userId,
      headquartersId,
      actor,
    );
    revalidatePath(`/master/${headquartersId}/users`);
  },
);
