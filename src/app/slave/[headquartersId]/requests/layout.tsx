import { withServerData } from "@/lib/store/with-server-data"
import { getUserRequestsAction } from "@/lib/actions/requests"
import { RequestsProvider } from "@/lib/queries/requests"

const fetcher = async ({ headquartersId }: { headquartersId: string }) => {
  return (await getUserRequestsAction({ headquartersId }))?.data || [];
}

export default withServerData(fetcher, RequestsProvider);
