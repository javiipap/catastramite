import { withServerData } from "@/lib/store/with-server-data"
import { useCases } from "@/use-cases"
import { HeadquartersProvider } from "@/lib/queries/headquarters"
import { SlaveLayoutClient } from "./layout-client"

const DataProvider = withServerData(useCases.headquarters.getHeadquarters, HeadquartersProvider);

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
