import type React from "react"
import { redirect } from "next/navigation"
import { MasterHeader } from "@/components/master-header"
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

interface Props {
  children: React.ReactNode,
  params: Promise<{ headquartersId: string }>
}

export default async function MasterLayout({ children, params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const headquartersId = (await params).headquartersId

  if (!session?.user.role) {
    console.log('Master layout' + session?.user)
    redirect('/login');
  }

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      <div className="flex-none">
        <MasterHeader headquartersId={headquartersId} />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
