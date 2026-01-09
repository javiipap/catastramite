import { withServerData } from "@/lib/store/with-server-data"
import { getHeadquartersByParams } from "@/lib/db/headquarters"
import { HeadquartersProvider } from "@/lib/queries/headquarters"

import { CitizenLayoutClient } from "./layout-client"

const DataProvider = withServerData(getHeadquartersByParams, HeadquartersProvider);

export default async function CitizenHeadquartersLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ headquartersId: string }>
}) {
  return (
    <DataProvider params={params}>
       <CitizenLayoutClient params={params}>
         {children}
       </CitizenLayoutClient>
    </DataProvider>
  )
}
