import { createSafeActionClient } from "next-safe-action";
import { getUserRole } from "./db/users";

export const actionClient = createSafeActionClient();

export const adminAction = actionClient
  .use(async ({ next, clientInput }) => {
    const input = clientInput as { userId?: string; headquartersId?: string } | undefined;
    const uid = input?.userId;
    const hqid = input?.headquartersId;

    if (!uid || !hqid) {
        throw new Error("Missing credentials for admin action");
    }

    const role = await getUserRole(uid, hqid);
    if (role !== 'admin') {
        throw new Error("Unauthorized: Admin access required");
    }

    return next({ ctx: { userId: uid, headquartersId: hqid } });
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

