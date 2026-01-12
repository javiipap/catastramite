import { headers } from 'next/headers';
import { auth } from './auth';

/**
 * Retrieves the currently authenticated user ID from cookies on the server.
 * This should be used in Server Components and Server Actions.
 */
export async function getCurrentUserId(): Promise<string | undefined> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.id;
}
