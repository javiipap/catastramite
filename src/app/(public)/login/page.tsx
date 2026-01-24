import { isValidRedirect } from "@/lib/utils"
import { LoginForm } from "@/components/login-form"
import { auth } from "@/lib/auth/server";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Access your headquarters and manage your contracts.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { callbackUrl } = await searchParams;
  const session = await auth();

  if (session.authorized) {
    if (callbackUrl && isValidRedirect(callbackUrl)) {
      redirect(callbackUrl);
    }

    if (session.authorized && session.subject.age) {
      redirect(`/headquarters`);
    }

    // console.log('LOGIN', session.subject);
    const validCallback = isValidRedirect(callbackUrl) ? callbackUrl : undefined;
    const onboardingUrl = validCallback ? `/onboarding?callbackUrl=${encodeURIComponent(validCallback)}` : '/onboarding';
    redirect(onboardingUrl);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/10 to-muted/60 p-4">
      <LoginForm />
    </main>
  )
}
