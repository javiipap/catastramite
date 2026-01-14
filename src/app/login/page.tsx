import { LoginForm } from "@/components/login-form"
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role) {
    redirect(`/${session.user.role}/headquarters`);
  } else if (session?.user && !session?.user.role) {
    console.log('LOGIN', session?.user)
    redirect('/onboarding');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/10 to-muted/60 p-4">
      <LoginForm />
    </main>
  )
}
