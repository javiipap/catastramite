import { withServerData } from "@/lib/store/with-server-data"
import { useCases } from "@/use-cases"
import { RequestsProvider } from "@/lib/queries/requests"

export default withServerData(useCases.requests.getAdminRequestsByParams, RequestsProvider);
