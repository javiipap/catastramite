import { withServerData } from "@/lib/store/with-server-data"
import { getUserRequestsAction } from "@/lib/actions/requests"
import { RequestsProvider } from "@/lib/queries/requests"

export default withServerData(getUserRequestsAction, RequestsProvider);
