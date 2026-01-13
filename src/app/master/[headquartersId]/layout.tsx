import { withServerData } from "@/lib/store/with-server-data"
import { getHeadquartersAction } from "@/lib/actions/headquarters"
import { HeadquartersProvider } from "@/lib/queries/headquarters"
import { MasterLayoutClient } from "./layout-client"
import { MasterGuard } from "@/components/master-guard"

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
        <MasterLayoutClient params={params}>
          {children}
        </MasterLayoutClient>
      </DataProvider>
    </MasterGuard>
  )
}
