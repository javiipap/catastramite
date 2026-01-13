import { withServerData } from "@/lib/store/with-server-data"
import { useCases } from "@/use-cases"
import { HeadquartersProvider } from "@/lib/queries/headquarters"
import { AdminLayoutClient } from "./layout-client"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { AdminGuard } from "@/components/admin-guard"

const DataProvider = withServerData(async (params: { headquartersId: string }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return useCases.headquarters.getHeadquarters(params, session.user);
}, HeadquartersProvider);

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ headquartersId: string }>
}) {
  const { headquartersId } = await params;
  return (
    <AdminGuard headquartersId={headquartersId}>
      <DataProvider params={params}>
        <AdminLayoutClient params={params}>
          {children}
        </AdminLayoutClient>
      </DataProvider>
    </AdminGuard>
  )
}
