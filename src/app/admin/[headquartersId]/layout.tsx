import { withServerData } from "@/lib/store/with-server-data"
import { useCases } from "@/use-cases"
import { HeadquartersProvider } from "@/lib/queries/headquarters"
import { MasterLayoutClient } from "./layout-client"


import { MasterGuard } from "@/components/master-guard"

const DataProvider = withServerData(useCases.headquarters.getHeadquarters, HeadquartersProvider);

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
