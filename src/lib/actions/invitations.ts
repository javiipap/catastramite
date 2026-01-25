"use server";

import { useCases } from "@/use-cases";
import { mutateAction, mutateHeadquartersAction } from "@/lib/safe-action";
import {
  createInvitationSchema,
  acceptInvitationSchema,
} from "@/lib/schemas/invitations";
import { redirect } from "next/navigation";
import { setHeadquartersCookie } from "@/lib/auth/hq-token";

export const createInvitationTokenAction = mutateHeadquartersAction(
  createInvitationSchema,
  async ({ headquartersId, role }, { user }) => {
    return useCases.invitations.createInvitationToken(
      headquartersId,
      role,
      user,
    );
  },
);

export const acceptInvitationAction = mutateAction(
  acceptInvitationSchema,
  async ({ token }, { user }) => {
    await useCases.invitations.acceptInvitation(token, user);

    const headquarters = await useCases.headquarters.getUserHeadquarters({
      userId: user.userId,
    });

    await setHeadquartersCookie(user.userId, headquarters);

    redirect(`/headquarters`);
  },
);
