import { withServerData } from "@/lib/store/with-server-data"
import { getSedeByParams } from "@/lib/actions/sedes"
import { SedeProvider } from "@/lib/queries/sedes"

import { CiudadanoLayoutClient } from "./layout-client"

const DataProvider = withServerData(getSedeByParams, SedeProvider);

export default async function CiudadanoSedeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ sedeId: string }>
}) {
  return (
    <DataProvider params={params}>
       <CiudadanoLayoutClient params={params}>
         {children}
       </CiudadanoLayoutClient>
    </DataProvider>
  )
}
