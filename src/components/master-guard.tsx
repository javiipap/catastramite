import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { useCases } from "@/use-cases";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface MasterGuardProps {
  headquartersId: string;
  children: ReactNode;
}

export async function MasterGuard({ headquartersId, children }: MasterGuardProps) {
  const session = await auth();

  if (!session.authorized) {
    console.log('MASTER-GUARD: NO USER')
    redirect('/login');
  }

  const role = await useCases.users.getUserRole(
    { userId: session.subject.userId },
    { headquartersId }
  );

  if (role !== 'master') {
    redirect(`/slave/${headquartersId}/dashboard`);
  }

  return <>{children}</>;
}
