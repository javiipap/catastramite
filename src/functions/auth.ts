import { issuer } from "@openauthjs/openauth";
import { DynamoStorage } from "@openauthjs/openauth/storage/dynamo";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";
import { Resource } from "sst/resource";
import { handle } from "hono/aws-lambda";
import { subjects } from "../lib/auth-subjects";
import { useCases } from "@/use-cases";

export const handler = handle(
  issuer({
    subjects,
    storage: DynamoStorage({
      table: Resource.CatastramiteTable.name,
    }),
    providers: {
      google: GoogleProvider({
        clientID: Resource.CLIENT_ID.value,
        clientSecret: Resource.CLIENT_SECRET.value,
        scopes: ["email", "profile"],
      }),
    },
    success: async (ctx, value) => {
      if (value.provider === "google") {
        // @ts-expect-error - value.claims is dynamically typed
        const claims = value.claims;

        const headquarters = await useCases.headquarters.getUserHeadquarters({
          userId: claims.userId,
        });

        return ctx.subject("user", {
          email: claims.email,
          name: claims.name,
          picture: claims.picture,
          headquarters: headquarters.map((hq) => ({
            headquartersId: hq.headquartersId,
            role: hq.role,
          })),
        });
      }
      throw new Error("Invalid provider");
    },
  }),
);
