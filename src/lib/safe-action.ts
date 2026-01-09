import { createSafeActionClient } from "next-safe-action";
import { getUserRole } from "./db/users";

export const actionClient = createSafeActionClient();

export const adminAction = actionClient
  .use(async ({ next, clientInput }) => {
    const input = clientInput as { userId?: string; sedeId?: string } | undefined;
    const uid = input?.userId;
    const sid = input?.sedeId;

    if (!uid || !sid) {
        throw new Error("Missing credentials for admin action");
    }

    const role = await getUserRole(uid, sid);
    if (role !== 'administrador') {
        throw new Error("Unauthorized: Admin access required");
    }

    return next({ ctx: { userId: uid, sedeId: sid } });
  });

export const citizenAction = actionClient
  .use(async ({ next, clientInput }) => {
    const input = clientInput as { userId?: string } | undefined;
    const uid = input?.userId;
    
    if (!uid) {
        throw new Error("Missing user credentials");
    }
    
    return next({ ctx: { userId: uid } });
  });

