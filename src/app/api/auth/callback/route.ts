import { client, setTokens } from "@/lib/auth";
import { subjects } from "@/lib/auth/subjects";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/", req.url));

  console.log("Callback received code:", code);
  const redirectUri = req.nextUrl.origin + "/api/auth/callback";

  const exchanged = await client.exchange(code, redirectUri);
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

  return NextResponse.redirect(new URL("/login", req.url));
}
