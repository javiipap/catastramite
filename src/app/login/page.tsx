import { isValidRedirect } from "@/lib/utils"
import { LoginForm } from "@/components/login-form"
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { callbackUrl } = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    if (callbackUrl && isValidRedirect(callbackUrl)) {
      redirect(callbackUrl);
    }

    if (session.user) {
      redirect(`/headquarters`);
    }

    console.log('LOGIN', session.user);
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
