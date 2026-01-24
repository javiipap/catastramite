import { createClient } from "@openauthjs/openauth/client";
import { cookies } from "next/headers";

export const client = createClient({
  clientID: "catastramite",
  issuer: process.env.NEXT_PUBLIC_AUTH_URL!,
});

export async function setTokens(access: string, refresh: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "access_token",
    value: access,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  });

  cookieStore.set({
    name: "refresh_token",
    value: refresh,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  });
}
