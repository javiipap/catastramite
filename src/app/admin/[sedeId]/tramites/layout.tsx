import { withServerData } from "@/lib/store/with-server-data"
import { getTramitesByParams } from "@/lib/actions/tramites"
import { TramitesProvider } from "@/lib/queries/tramites"

export default withServerData(getTramitesByParams, TramitesProvider);
