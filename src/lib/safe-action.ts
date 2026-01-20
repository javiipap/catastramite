import { createSafeActionClient } from "next-safe-action";
import { getSession } from "@/lib/server-auth"; // Use getSession directly
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
  const session = await getSession();

  if (!session?.user) {
    throw new Error();
  }

  if (!session.user.headquarters.some((h) => h.role === "master")) {
    throw new Error();
  }

  return next({ ctx: { user: session.user } });
});

export const slaveAction = actionClient.use(async ({ next }) => {
  const session = await getSession();

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

    const session = await getSession();

    if (!session?.user) {
      throw new Error();
    }

    const headquarters = session.user.headquarters.find(
      (h) => h.headquartersId === parsedInput.headquartersId,
    );

    if (!headquarters || headquarters.role !== "master") {
      throw new Error();
    }

    return handler(parsedInput, { user: session.user });
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

    const session = await getSession();

    if (!session?.user) {
      throw new Error();
    }

    return handler(parsedInput, { user: session.user });
  };
