import { withServerData } from "@/lib/store/with-server-data"
import { getHeadquartersByParams } from "@/lib/db/headquarters"
import { HeadquartersProvider } from "@/lib/queries/headquarters"

import { SlaveLayoutClient } from "./layout-client"

const DataProvider = withServerData(getHeadquartersByParams, HeadquartersProvider);

export default async function SlaveHeadquartersLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ headquartersId: string }>
}) {
  return (
    <DataProvider params={params}>
       <SlaveLayoutClient params={params}>
         {children}
       </SlaveLayoutClient>
    </DataProvider>
  )
}
