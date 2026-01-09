import { withServerData } from "@/lib/store/with-server-data"
import { getHeadquartersByParams } from "@/lib/db/headquarters"
import { HeadquartersProvider } from "@/lib/queries/headquarters"
import { AdminLayoutClient } from "./layout-client"

const DataProvider = withServerData(getHeadquartersByParams, HeadquartersProvider);

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
