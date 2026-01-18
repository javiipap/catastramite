import type React from "react"
import { redirect } from "next/navigation"
import { MasterHeader } from "@/components/master-header"
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

interface Props {
  children: React.ReactNode,
}

export default async function MasterLayout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });




  return (
    <div className="h-screen flex flex-col bg-muted/30">
      <div className="flex-none">
        <MasterHeader />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
