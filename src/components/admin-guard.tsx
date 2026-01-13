import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { useCases } from '@/use-cases';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminGuardProps {
  headquartersId: string;
  children: ReactNode;
}

export async function AdminGuard({ headquartersId, children }: AdminGuardProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/onboarding');
  }

  const role = await useCases.users.getUserRole(
    { userId: session.user.id },
    { headquartersId }
  );

  if (role !== 'master') {
    redirect(`/slave/${headquartersId}/dashboard`);
  }

  return <>{children}</>;
}
