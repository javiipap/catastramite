import { client } from "@/lib/auth";
import { subjects } from "@/lib/auth-subjects";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle/client";
import { user } from "@/lib/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/", req.url));

  const exchanged = await client.exchange(
    code,
    req.nextUrl.origin + "/api/auth/callback",
  );
  if (exchanged.err)
    return NextResponse.redirect(new URL("/?error=auth", req.url));

  const verified = await client.verify(subjects, exchanged.tokens.access);
  if (verified.err)
    return NextResponse.redirect(new URL("/?error=verify", req.url));

  const { email, name, picture } = verified.subject.properties;

  // Provision user
  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email as string),
  });

  if (!existingUser) {
    await db.insert(user).values({
      id: uuidv4(),
      email: email as string,
      name: (name as string) || "User",
      image: picture as string,
      role: "slave", // Default role
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", exchanged.tokens.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
  cookieStore.set("refresh_token", exchanged.tokens.refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
