import { withServerData } from "@/lib/store/with-server-data"
import { getUserHeadquartersAction } from "@/lib/actions/headquarters"
import { HeadquartersListProvider } from "@/lib/queries/headquarters"
import { HeadquartersHeader } from "@/app/(private)/headquarters/components/header";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Headquarters",
  description: "Manage your electronic headquarters and access your procedures.",
};

const DataLayout = withServerData(() => getUserHeadquartersAction(), HeadquartersListProvider);

export default async function HeadquartersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <HeadquartersHeader />
      <DataLayout params={{}}>
        {children}
      </DataLayout>
    </div>
  )
}
