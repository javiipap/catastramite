import { withServerData } from "@/lib/store/with-server-data"
import { getRequestsAction } from "@/lib/actions/requests"
import { RequestsProvider } from "@/lib/queries/requests"

export default withServerData(getRequestsAction, RequestsProvider);
