import { z } from "zod";

export const userRoleSchema = z.enum(["master", "slave"]);

export const userSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: userRoleSchema.optional().nullable(),
  age: z.number().optional().nullable(),
});

export const userHeadquartersSchema = z.object({
  userId: z.string(),
  headquartersId: z.string(),
  role: userRoleSchema,
});

export const getHeadquartersUsersSchema = z.object({
  headquartersId: z.string(),
});

export const addUserToHeadquartersSchema = z.object({
  headquartersId: z.string(),
  email: z.string(),
  role: userRoleSchema,
});

export const removeUserFromHeadquartersSchema = z.object({
  headquartersId: z.string(),
  userId: z.string(),
});

export const getUserRoleSchema = z.object({
  userId: z.string(),
  headquartersId: z.string(),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type User = z.infer<typeof userSchema>;
export type UserHeadquarters = z.infer<typeof userHeadquartersSchema>;
