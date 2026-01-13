import { withServerData } from "@/lib/store/with-server-data"
import { useCases } from "@/use-cases"
import { HeadquartersProvider } from "@/lib/queries/headquarters"
import { SlaveLayoutClient } from "./layout-client"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const DataProvider = withServerData(async (params: { headquartersId: string }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return useCases.headquarters.getHeadquarters(params, session.user);
}, HeadquartersProvider);

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
