import OnboardingForm from '@/app/onboarding/form'
import { getSession } from "@/lib/server-auth";
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { isValidRedirect } from "@/lib/utils";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Complete your profile to get started.",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { callbackUrl } = await searchParams;
  const session = await getSession();

  const validCallback = isValidRedirect(callbackUrl) ? callbackUrl : undefined;

  if (session?.user.age) {
    if (validCallback) {
      redirect(validCallback);
    }
    redirect(`/headquarters`);
  } else if (!session) {
    const loginUrl = validCallback ? `/login?callbackUrl=${encodeURIComponent(validCallback)}` : '/login';
    redirect(loginUrl);
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <OnboardingForm
        name={session.user.name}
        age={session.user.age}
        callbackUrl={validCallback}
      />
    </div>
  )
}
