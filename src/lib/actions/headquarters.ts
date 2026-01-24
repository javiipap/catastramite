"use server";

import { cookies as getCookies } from "next/headers";
import { useCases } from "@/use-cases";
import { Headquarters } from "@/lib/schemas/headquarters";
import {
  mutateAction,
  mutateHeadquartersAction,
  slaveAction,
} from "@/lib/safe-action";
import {
  createHeadquartersSchema,
  updateHeadquartersSchema,
  getHeadquartersSchema,
  getUserHeadquartersRelationsSchema,
} from "@/lib/schemas/headquarters";

export const createHeadquarters = mutateAction(
  createHeadquartersSchema,
  async ({ name, description }, { user }) => {
    const newHeadquarters: Headquarters = {
      headquartersId: Date.now().toString(),
      name,
      description: description ?? null,
      createdAt: new Date(),
    };

    await useCases.headquarters.createHeadquarters(newHeadquarters, {
      userId: user.userId,
    });

    const cookies = await getCookies();
    const headquarters = await useCases.headquarters.getUserHeadquarters({
      userId: user.userId,
    });

    cookies.set("HEADQUARTERS", JSON.stringify(headquarters), {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: false,
    });

    return {
      ...newHeadquarters,
      userHeadquarters: [
        {
          userId: user.userId,
          headquartersId: newHeadquarters.headquartersId,
          role: "master",
        },
      ],
    } as Headquarters;
  },
);

export const updateHeadquarters = mutateHeadquartersAction(
  updateHeadquartersSchema,
  async ({ headquartersId, name, description }, { user }) => {
    const updates: Partial<Headquarters> = { name };
    if (description !== undefined) {
      updates.description = description;
    }

    return useCases.headquarters.updateHeadquarters(
      headquartersId,
      updates,
      user,
    );
  },
);

export const getHeadquartersAction = slaveAction
  .inputSchema(getHeadquartersSchema)
  .action(async ({ parsedInput: { headquartersId }, ctx: { user } }) => {
    return useCases.headquarters.getHeadquarters({ headquartersId }, user);
  });

export const getUserHeadquartersRelationsAction = slaveAction
  .inputSchema(getUserHeadquartersRelationsSchema)
  .action(async ({ parsedInput: { userId } }) => {
    return useCases.headquarters.getUserHeadquarters({ userId });
  });

export const getUserHeadquartersObjectsAction = slaveAction
  .inputSchema(getUserHeadquartersRelationsSchema)
  .action(async ({ parsedInput: { userId } }) => {
    return useCases.headquarters.getUserHeadquartersObjects({ userId });
  });

export const getUserHeadquartersAction = slaveAction.action(
  async ({ ctx: { user } }) => {
    return useCases.headquarters.getUserHeadquartersObjects({
      userId: user.userId,
    });
  },
);

export const getMasterHeadquartersAction = slaveAction.action(
  async ({ ctx: { user } }) => {
    return useCases.headquarters.getMasterHeadquarters({ userId: user.userId });
  },
);
