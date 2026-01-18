import { z } from "zod";

export const createInvitationSchema = z.object({
  headquartersId: z.string().min(1, "Headquarters ID is required"),
  role: z.enum(["master", "slave"]),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Token is required"),
});
