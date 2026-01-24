import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { SessionUser } from "@/lib/auth"; // Import User from our auth lib
import { z } from "zod";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    console.error(error);
    return error;
  },
});

export const masterAction = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session.authorized) {
    throw new Error();
  }

  if (!session.subject.headquarters.some((h) => h.role === "master")) {
    throw new Error();
  }

  return next({ ctx: { user: session.subject } });
});

export const slaveAction = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session.authorized) {
    throw new Error();
  }

  return next({ ctx: { user: session.subject } });
});

export const mutateHeadquartersAction =
  <
    TSchema extends z.ZodType<
      {
        headquartersId: string;
      } & Record<string, unknown>
    >,
    TData,
  >(
    schema: TSchema,
    handler: (
      data: z.infer<TSchema>,
      ctx: { user: SessionUser },
    ) => Promise<TData>,
  ) =>
  async (rawData: z.infer<TSchema>) => {
    const parsedInput = schema.parse(rawData);

    const session = await auth();

    if (!session.authorized) {
      throw new Error();
    }

    const headquarters = session.subject.headquarters.find(
      (h) => h.headquartersId === parsedInput.headquartersId,
    );

    if (!headquarters || headquarters.role !== "master") {
      throw new Error();
    }

    return handler(parsedInput, { user: session.subject });
  };

export const mutateAction =
  <TSchema extends z.ZodType, TData>(
    schema: TSchema,
    handler: (
      data: z.infer<TSchema>,
      ctx: { user: SessionUser },
    ) => Promise<TData>,
  ) =>
  async (rawData: z.infer<TSchema>) => {
    const parsedInput = schema.parse(rawData);

    const session = await auth();

    if (!session.authorized) {
      throw new Error();
    }

    return handler(parsedInput, { user: session.subject });
  };
