import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { User } from "better-auth";
import { z } from "zod";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    console.error(error);
    return error;
  },
});

export const masterAction = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error();
  }

  if (!session.user.headquarters.some((h: any) => h.role === "master")) {
    throw new Error();
  }

  return next({ ctx: { user: session.user } });
});

export const slaveAction = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error();
  }

  return next({ ctx: { user: session.user } });
});

export const mutateHeadquartersAction =
  <
    TSchema extends z.ZodType<
      {
        headquartersId: string;
      } & Record<string, any>
    >,
    TData,
  >(
    schema: TSchema,
    handler: (data: z.infer<TSchema>, ctx: { user: User }) => Promise<TData>,
  ) =>
  async (rawData: z.infer<TSchema>) => {
    const parsedInput = schema.parse(rawData);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error();
    }

    const headquarters = session.user.headquarters.find(
      (h: any) => h.id === parsedInput.headquartersId,
    );

    if (!headquarters || headquarters.role !== "master") {
      throw new Error();
    }

    return handler(parsedInput, { user: session.user });
  };

export const mutateAction =
  <TSchema extends z.ZodType, TData>(
    schema: TSchema,
    handler: (data: z.infer<TSchema>, ctx: { user: User }) => Promise<TData>,
  ) =>
  async (rawData: z.infer<TSchema>) => {
    const parsedInput = schema.parse(rawData);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error();
    }

    return handler(parsedInput, { user: session.user });
  };
