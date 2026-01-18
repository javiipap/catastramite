import { withServerData } from "@/lib/store/with-server-data"
import { getUserHeadquartersAction } from "@/lib/actions/headquarters"
import { HeadquartersListProvider } from "@/lib/queries/headquarters"
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import { HeadquartersHeader } from "@/components/headquarters-header";

const DataLayout = withServerData(getUserHeadquartersAction, HeadquartersListProvider as any);

export default async function HeadquartersLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-muted/30">
      <HeadquartersHeader />
      <DataLayout params={Promise.resolve()}>
        {children}
      </DataLayout>
    </div>
  )
}
