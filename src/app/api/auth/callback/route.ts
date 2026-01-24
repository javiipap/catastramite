import { client, setTokens } from "@/lib/auth";
import { setHeadquartersCookie } from "@/lib/auth/hq-token";
import { subjects } from "@/lib/auth/subjects";
import { useCases } from "@/use-cases";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/", req.url));

  const redirectUrl = req.nextUrl.searchParams.get("redirect");

  console.log("Callback received code:", code);
  const callbackUrl =
    req.nextUrl.origin +
    "/api/auth/callback" +
    (redirectUrl ? `?redirect=${redirectUrl}` : "");

  const exchanged = await client.exchange(code, callbackUrl);
  if (exchanged.err) {
    console.error("Token exchange failed:", exchanged.err);
    return NextResponse.redirect(new URL("/?error=auth", req.url));
  }

  const verified = await client.verify(subjects, exchanged.tokens.access);
  if (verified.err) {
    console.error("Token verification failed:", verified.err);
    return NextResponse.redirect(new URL("/?error=verify", req.url));
  }

  await setTokens(exchanged.tokens.access, exchanged.tokens.refresh);

  // Set headquarters cookie
  const userId = verified.subject.properties.userId;
  const headquarters = await useCases.headquarters.getUserHeadquarters({
    userId,
  });

  await setHeadquartersCookie(userId, headquarters);

  return NextResponse.redirect(
    new URL(redirectUrl || "/headquarters", req.url),
  );
}
