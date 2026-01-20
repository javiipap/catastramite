import { getSession } from "@/lib/server-auth";
import { headers } from "next/headers";
import { useCases } from "@/use-cases";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface MasterGuardProps {
  headquartersId: string;
  children: ReactNode;
}

export async function MasterGuard({ headquartersId, children }: MasterGuardProps) {
  const session = await getSession();

  if (!session?.user) {
    console.log('MASTER-GUARD: NO USER')
    redirect('/login');
  }

  const role = await useCases.users.getUserRole(
    { userId: session.user.userId },
    { headquartersId }
  );

  if (role !== 'master') {
    redirect(`/slave/${headquartersId}/dashboard`);
  }

  return <>{children}</>;
}
