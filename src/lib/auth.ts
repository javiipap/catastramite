import { createClient } from "@openauthjs/openauth/client";

export const client = createClient({
  clientID: "catastramite",
  issuer: process.env.NEXT_PUBLIC_AUTH_URL!,
});
export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  picture?: string;
  headquarters: {
    headquartersId: string;
    role: string;
  }[];
  age?: number | null;
}
