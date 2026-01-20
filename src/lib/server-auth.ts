import { cookies } from "next/headers";
import { client } from "@/lib/auth";
import { subjects } from "@/lib/auth-subjects";
import { db } from "@/lib/db/drizzle/client";
import { user } from "@/lib/db/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!token) return null;

  try {
    const verified = await client.verify(subjects, token, {
      refresh: refreshToken,
    });

    if (verified.err) return null;

    // Check if properties exist and map correctly
    const email = verified.subject.properties.email as string | undefined;
    const hqs = verified.subject.properties.headquarters;

    if (!email) return null;

    const dbUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!dbUser) return null;

    return {
      user: {
        ...dbUser,
        userId: dbUser.id,
        headquarters: hqs,
      },
    };
  } catch (e) {
    console.error("Session verification failed", e);
    return null;
  }
}

/**
 * Retrieves the currently authenticated user ID from cookies on the server.
 * This should be used in Server Components and Server Actions.
 */
export async function getCurrentUserId(): Promise<string | undefined> {
  const session = await getSession();
  return session?.user?.userId;
}
