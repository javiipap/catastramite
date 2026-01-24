import { cookies as getCookies } from "next/headers";
import { client, setTokens } from "@/lib/auth";
import { subjects } from "@/lib/auth/subjects";
import { redirect } from "next/navigation";
import { headers as getHeaders } from "next/headers";
import { InferOutput } from "valibot";

export type AuthReturn =
  | {
      authorized: false;
    }
  | SuccessfullAuth;

export type Subject = InferOutput<typeof subjects.user> & {
  headquarters?: string;
};

export type SuccessfullAuth = {
  authorized: true;
  subject: Subject;
  token: string;
};

export async function getLoginLink() {
  const headers = await getHeaders();
  const host = headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const { url } = await client.authorize(
    `${protocol}://${host}/api/auth/callback`,
    "code",
    { provider: "google" },
  );

  return url;
}

export async function login() {
  const cookies = await getCookies();
  const accessToken = cookies.get("access_token");
  const refreshToken = cookies.get("refresh_token");

  if (accessToken) {
    const verified = await client.verify(subjects, accessToken.value, {
      refresh: refreshToken?.value,
    });

    if (!verified.err && verified.tokens) {
      await setTokens(verified.tokens.access, verified.tokens.refresh);
      redirect("/headquarters");
    }
  }

  const link = await getLoginLink();

  return redirect(link);
}

export async function logout() {
  const cookies = await getCookies();
  cookies.delete("access_token");
  cookies.delete("refresh_token");
  cookies.delete("HEADQUARTERS");

  redirect("/");
}

export async function auth(): Promise<AuthReturn> {
  const cookies = await getCookies();
  const accessToken = cookies.get("access_token");
  const refreshToken = cookies.get("refresh_token");

  if (!accessToken) {
    return { authorized: false };
  }

  const verified = await client.verify(subjects, accessToken.value, {
    refresh: refreshToken?.value,
  });

  if (verified.err) {
    console.log(verified.err);
    return { authorized: false };
  }

  if (verified.tokens) {
    await setTokens(verified.tokens.access, verified.tokens.refresh);
  }

  return {
    authorized: true,
    subject: {
      ...verified.subject.properties,
      headquarters: cookies.get("HEADQUARTERS")?.value,
    },
    token: verified.tokens?.access ?? accessToken.value,
  };
}

export async function requireAuth() {
  const session = await auth();

  if (!session.authorized) {
    return login();
  }

  return session as SuccessfullAuth;
}
