import { withServerData } from "@/lib/store/with-server-data"
import { useCases } from "@/use-cases"
import { HeadquartersProvider } from "@/lib/queries/headquarters"
import { AdminLayoutClient } from "./layout-client"

const DataProvider = withServerData(useCases.headquarters.getHeadquartersByParams, HeadquartersProvider);

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ headquartersId: string }>
}) {
  return (
    <DataProvider params={params}>
      <AdminLayoutClient params={params}>
        {children}
      </AdminLayoutClient>
    </DataProvider>
  )
}
