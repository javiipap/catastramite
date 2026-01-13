import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/drizzle/client";
import { user, session, account, verification } from "./db/drizzle/schema";

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
      role: {
        type: "string",
        required: false,
      },
      age: {
        type: "number",
        required: false,
      },
    },
  },
  advanced: {
    cookiePrefix: "catastramite",
  },
});

export type Session = typeof auth.$Infer.Session;
