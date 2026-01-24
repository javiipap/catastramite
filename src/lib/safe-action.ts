import { createSafeActionClient } from "next-safe-action";
import { auth, type Subject } from "@/lib/auth/server";
import { z } from "zod";

import { useCases } from "@/use-cases";

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

  const currentHeadquartersId = session.subject.headquarters;

  if (!currentHeadquartersId) {
    throw new Error("No headquarters selected");
  }

  const userHeadquarters = await useCases.headquarters.getUserHeadquarters({
    userId: session.subject.userId,
  });

  const isMaster = userHeadquarters.some(
    (h) => h.headquartersId === currentHeadquartersId && h.role === "master",
  );

  if (!isMaster) {
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
    handler: (data: z.infer<TSchema>, ctx: { user: Subject }) => Promise<TData>,
  ) =>
  async (rawData: z.infer<TSchema>) => {
    const parsedInput = schema.parse(rawData);

    const session = await auth();

    if (!session.authorized) {
      throw new Error();
    }

    const userHeadquarters = await useCases.headquarters.getUserHeadquarters({
      userId: session.subject.userId,
    });

    const membership = userHeadquarters.find(
      (h) => h.headquartersId === parsedInput.headquartersId,
    );

    if (!membership || membership.role !== "master") {
      throw new Error();
    }

    return handler(parsedInput, { user: session.subject });
  };

export const mutateAction =
  <TSchema extends z.ZodType, TData>(
    schema: TSchema,
    handler: (data: z.infer<TSchema>, ctx: { user: Subject }) => Promise<TData>,
  ) =>
  async (rawData: z.infer<TSchema>) => {
    const parsedInput = schema.parse(rawData);

    const session = await auth();

    if (!session.authorized) {
      throw new Error();
    }

    return handler(parsedInput, { user: session.subject });
  };
