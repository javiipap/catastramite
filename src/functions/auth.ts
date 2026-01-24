import { issuer } from "@openauthjs/openauth";
import { DynamoStorage } from "@openauthjs/openauth/storage/dynamo";
import {
  GoogleOidcProvider,
  GoogleProvider,
} from "@openauthjs/openauth/provider/google";
import { Resource } from "sst";
import { handle } from "hono/aws-lambda";
import { subjects } from "../lib/auth/subjects";
import { useCases } from "@/use-cases";

export const handler = handle(
  issuer({
    subjects,
    storage: DynamoStorage({
      table: Resource.CatastramiteTable.name,
    }),
    providers: {
      google: GoogleOidcProvider({
        clientID: Resource.CLIENT_ID.value,
        // clientSecret: Resource.CLIENT_SECRET.value,
        scopes: ["email", "profile"],
      }),
    },
    success: async (ctx, value) => {
      if (value.provider === "google") {
        console.log(JSON.stringify(value));

        const claims = value.id as {
          email: string;
          name: string;
          picture: string;
        };

        // Fetch user by email since claims might lack userId
        let user = await useCases.users.getUserByEmail(claims.email);
        let userId = user?.userId;

        if (!user) {
          userId = crypto.randomUUID();
          user = await useCases.users.createUser({
            userId: userId!,
            email: claims.email,
            name: claims.name || claims.email.split("@")[0], // Fallback name
            image: claims.picture || null,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // Fetch headquarters... but if new user, they have none, unless added by email previously.
        // Actually, if they were added by email to a HQ, they might exist as a user record?
        // No, `addUserToHeadquarters` usually links an existing user.
        // If we invite by email, we might have a placeholder?
        // Let's assume for now newly created users have no HQs.
        return ctx.subject("user", {
          email: claims.email,
          name: user?.name || claims.name || claims.email.split("@")[0],
          picture: user?.image || claims.picture,
          age: user?.age || undefined, // Include age
          userId: userId!, // Explicitly include userId
        });
      }
      throw new Error("Invalid provider");
    },
  }),
);
