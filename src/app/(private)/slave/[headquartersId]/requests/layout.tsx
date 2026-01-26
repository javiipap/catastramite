import { withServerData } from "@/lib/store/with-server-data"
import { getUserRequestsAction } from "@/lib/actions/requests"
import { RequestsProvider } from "@/lib/queries/requests"
import { getProceduresAction } from "@/lib/actions/procedures"
import { ProceduresProvider } from "@/lib/queries/procedures"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Requests",
  description: "Track the status of your submitted requests.",
};

const RequestsProviderWrapped = withServerData(getUserRequestsAction, RequestsProvider);
const ProceduresProviderWrapped = withServerData(getProceduresAction, ProceduresProvider);

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ headquartersId: string }>
}) {
  return (
    <ProceduresProviderWrapped params={params}>
      <RequestsProviderWrapped params={params}>
        {children}
      </RequestsProviderWrapped>
    </ProceduresProviderWrapped>
  )
}
