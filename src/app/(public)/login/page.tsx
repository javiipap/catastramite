import { isValidRedirect } from "@/lib/utils"
import { LoginForm } from "@/app/(public)/login/login-form"
import { auth } from "@/lib/auth/server";
import { redirect } from 'next/navigation';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Access your headquarters and manage your contracts.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect: redirectUrl } = await searchParams;
  const session = await auth();

  if (session.authorized) {
    if (redirectUrl && isValidRedirect(redirectUrl)) {
      redirect(redirectUrl);
    }

    redirect('/headquarters');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/10 to-muted/60 p-4">
      <LoginForm />
    </main>
  )
}
