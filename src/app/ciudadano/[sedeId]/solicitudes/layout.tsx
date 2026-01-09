import { withServerData } from "@/lib/store/with-server-data"
import { getSolicitudesByParams } from "@/lib/db/requests"
import { SolicitudesProvider } from "@/lib/queries/solicitudes"

export default withServerData(getSolicitudesByParams, SolicitudesProvider);
