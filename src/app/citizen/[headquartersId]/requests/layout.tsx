import { withServerData } from "@/lib/store/with-server-data"
import { getRequestsByParams } from "@/lib/db/requests"
import { RequestsProvider } from "@/lib/queries/requests"

export default withServerData(getRequestsByParams, RequestsProvider);
