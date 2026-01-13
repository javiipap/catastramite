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

  if (session.user.role !== "master") {
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

export const mutateMasterAction =
  <TSchema extends z.ZodType, TData>(
    schema: TSchema,
    handler: (data: z.infer<TSchema>, ctx: { user: User }) => Promise<TData>
  ) =>
  async (rawData: z.infer<TSchema>) => {
    const parsedInput = schema.parse(rawData);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error();
    }

    if (session.user.role !== "master") {
      throw new Error();
    }

    return handler(parsedInput, { user: session.user });
  };

export const mutateSlaveAction =
  <TSchema extends z.ZodType, TData>(
    schema: TSchema,
    handler: (data: z.infer<TSchema>, ctx: { user: User }) => Promise<TData>
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
