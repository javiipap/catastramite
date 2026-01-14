import OnboardingForm from '@/app/onboarding/form'
import { auth } from '@/lib/auth';
import { UserRole } from '@/lib/types';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role) {
    redirect(`/${session.user.role}/headquarters`);
  } else if (!session) {
    redirect('/login');
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <OnboardingForm name={session.user.name} role={session.user.role as UserRole} age={session.user.age} />
    </div>
  )
}
