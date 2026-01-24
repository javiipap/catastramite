import OnboardingForm from '@/app/(public)/onboarding/form'
import { auth } from "@/lib/auth/server";
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
  const session = await auth();

  const validCallback = isValidRedirect(callbackUrl) ? callbackUrl : undefined;

  if (session.authorized && session.subject.age) {
    if (validCallback) {
      redirect(validCallback);
    }
    redirect(`/headquarters`);
  } else if (!session.authorized) {
    const loginUrl = validCallback ? `/login?callbackUrl=${encodeURIComponent(validCallback)}` : '/login';
    redirect(loginUrl);
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <OnboardingForm
        name={(session.authorized && session.subject.name) || undefined}
        age={(session.authorized && session.subject.age) || undefined}
        callbackUrl={validCallback}
      />
    </div>
  )
}
