import { withServerData } from "@/lib/store/with-server-data"
import { getUserHeadquartersAction } from "@/lib/actions/headquarters"
import { HeadquartersListProvider } from "@/lib/queries/headquarters"
import { HeadquartersHeader } from "@/components/headquarters-header";

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
