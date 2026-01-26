import { withServerData } from "@/lib/store/with-server-data"
import { getRequestsAction } from "@/lib/actions/requests"
import { RequestsProvider } from "@/lib/queries/requests"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Requests",
  description: "Process and review user requests.",
};

const RequestsProviderWrapped = withServerData(getRequestsAction, RequestsProvider);

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
