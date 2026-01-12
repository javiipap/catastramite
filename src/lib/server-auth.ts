import { cookies } from "next/headers"

/**
 * Retrieves the currently authenticated user ID from cookies on the server.
 * This should be used in Server Components and Server Actions.
 */
export async function getCurrentUserId(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const userId = cookieStore.get("sede_user_id")?.value
  return userId
}
