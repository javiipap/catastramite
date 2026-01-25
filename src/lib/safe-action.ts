import { createSafeActionClient } from "next-safe-action";
import { auth, type Subject } from "@/lib/auth/server";
import { z } from "zod";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    console.error(error);
    return error;
  },
});

export const masterAction = actionClient.use(async ({ next, clientInput }) => {
  const session = await auth();

  if (!session.authorized) {
    throw new Error();
  }

  const headquartersId = (clientInput as { headquartersId?: string })
    ?.headquartersId;

  if (!headquartersId) {
    throw new Error("No headquarters found for user");
  }

  const hasAccess = session.subject.headquarters.some(
    (h) => h.headquartersId === headquartersId && h.role === "master",
  );

  if (!hasAccess) {
    throw new Error("Unauthorized");
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

    const membership = session.subject.headquarters.find(
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
