import { withServerData } from "@/lib/store/with-server-data"
import { getUserRequestsAction } from "@/lib/actions/requests"
import { RequestsProvider } from "@/lib/queries/requests"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Requests",
  description: "Track the status of your submitted requests.",
};

const RequestsProviderWrapped = withServerData(getUserRequestsAction, RequestsProvider);

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ headquartersId: string }>
}) {
  return (
    <RequestsProviderWrapped params={params}>
      {children}
    </RequestsProviderWrapped>
  )
}
