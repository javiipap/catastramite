import { withServerData } from "@/lib/store/with-server-data"
import { getTramitesByParams } from "@/lib/db/procedures"
import { TramitesProvider } from "@/lib/queries/tramites"

export default withServerData(getTramitesByParams, TramitesProvider);
