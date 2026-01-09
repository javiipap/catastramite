import { withServerData } from "@/lib/store/with-server-data"
import { getSolicitudesByParams } from "@/lib/actions/solicitudes"
import { SolicitudesProvider } from "@/lib/queries/solicitudes"

export default withServerData(getSolicitudesByParams, SolicitudesProvider);
