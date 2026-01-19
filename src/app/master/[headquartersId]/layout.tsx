import { withServerData } from "@/lib/store/with-server-data"
import { getHeadquartersAction } from "@/lib/actions/headquarters"
import { HeadquartersProvider } from "@/lib/queries/headquarters"
import { MasterGuard } from "@/components/master-guard"
import { MasterNav } from '@/components/master-nav'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Headquarters Control",
};

const DataProvider = withServerData(getHeadquartersAction, HeadquartersProvider);

export default async function MasterLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ headquartersId: string }>
}) {
  const { headquartersId } = await params;
  return (
    <MasterGuard headquartersId={headquartersId}>
      <DataProvider params={params}>
        <div className="h-full flex">
          <aside className="hidden md:block w-64 border-r bg-card h-full overflow-y-auto p-6">
            <MasterNav />
          </aside>
          <main className="flex-1 h-full overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </DataProvider>
    </MasterGuard>
  )
}
