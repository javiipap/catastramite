import { UserHeadquarters } from "@/lib/types";
import { cookies as getCookies } from "next/headers";
import { generateToken, verifyToken } from "@/services/jwt";

interface HQTokenPayload {
  sub: string;
  headquarters: UserHeadquarters[];
}

export async function setHeadquartersCookie(
  userId: string,
  headquarters: UserHeadquarters[],
) {
  const cookies = await getCookies();

  const token = await generateToken({ sub: userId, headquarters }, "1d");

  cookies.set("HEADQUARTERS", token, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 34560000,
  });
}

export async function verifyHeadquartersToken(
  token: string,
): Promise<{ userId: string; headquarters: UserHeadquarters[] } | null> {
  const payload = await verifyToken<HQTokenPayload>(token);

  if (!payload) {
    return null;
  }

  return {
    userId: payload.sub as string,
    headquarters: payload.headquarters as UserHeadquarters[],
  };
}
