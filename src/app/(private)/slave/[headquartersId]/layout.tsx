import { withServerData } from "@/lib/store/with-server-data"
import { getHeadquartersAction } from "@/lib/actions/headquarters"
import { HeadquartersProvider } from "@/lib/queries/headquarters"
import { SlaveLayoutClient } from "./layout-client"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Headquarters",
};

const DataProvider = withServerData(getHeadquartersAction, HeadquartersProvider);

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
