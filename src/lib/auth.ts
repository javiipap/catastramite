import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/drizzle/client";
import {
  user,
  session,
  account,
  verification,
  headquarters,
  userHeadquarters,
} from "./db/drizzle/schema";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      age: {
        type: "number",
        required: false,
      },
    },
  },
  advanced: {
    cookiePrefix: "catastramite",
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const userHqs = await db
        .select({
          id: headquarters.id,
          name: headquarters.name,
          role: userHeadquarters.role,
        })
        .from(userHeadquarters)
        .innerJoin(
          headquarters,
          eq(userHeadquarters.headquartersId, headquarters.id),
        )
        .where(eq(userHeadquarters.userId, user.id));

      return {
        user: {
          ...user,
          headquarters: userHqs,
          age: (user as any).age,
        },
        session,
      };
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type SessionUser = (typeof auth.$Infer.Session)["user"];
