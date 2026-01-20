import { getSession } from "@/lib/server-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  return NextResponse.json({
    user: session?.user || null,
  });
}
