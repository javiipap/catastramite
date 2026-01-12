import { createSafeActionClient } from 'next-safe-action';
import { useCases } from '@/use-cases';

export const actionClient = createSafeActionClient();

export const adminAction = actionClient.use(async ({ next, clientInput }) => {
  const input = clientInput as
    | { userId?: string; headquartersId?: string }
    | undefined;
  const uid = input?.userId;
  const hqid = input?.headquartersId;

  if (!uid || !hqid) {
    throw new Error('Missing credentials for admin action');
  }

  const role = await useCases.users.getUserRole(
    { userId: uid },
    { headquartersId: hqid }
  );
  if (role !== 'master') {
    throw new Error('Unauthorized: Admin access required');
  }

  return next({ ctx: { userId: uid, headquartersId: hqid } });
});

export const slaveAction = actionClient.use(async ({ next, clientInput }) => {
  const input = clientInput as { userId?: string } | undefined;
  const uid = input?.userId;

  if (!uid) {
    throw new Error('Missing user credentials');
  }

  return next({ ctx: { userId: uid } });
});
