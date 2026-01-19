import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/drizzle/client";
import { user, session, account, verification } from "./db/drizzle/schema";
import { customSession } from "better-auth/plugins";
import { useCases } from "@/use-cases";
import { Resource } from "sst/resource";

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
      clientId: Resource.CLIENT_ID.value,
      clientSecret: Resource.CLIENT_SECRET.value,
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
      const headquarters = await useCases.headquarters.getUserHeadquarters({
        userId: user.id,
      });

      return {
        user: {
          ...user,
          headquarters,
          age: (user as any).age,
        },
        session,
      };
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type SessionUser = (typeof auth.$Infer.Session)["user"];
