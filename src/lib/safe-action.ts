import { createSafeActionClient } from 'next-safe-action';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const actionClient = createSafeActionClient();

export const adminAction = actionClient.use(async ({ next, clientInput }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error();
  }

  if (session.user.role !== 'master') {
    throw new Error();
  }

  return next({ ctx: { user: session.user } });
});

export const slaveAction = actionClient.use(async ({ next, clientInput }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error();
  }

  return next({ ctx: { user: session.user } });
});
