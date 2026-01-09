import { withServerData } from "@/lib/store/with-server-data"
import { getSedes } from "@/lib/actions/sedes"
import { SedesProvider } from "@/lib/queries/sedes"

// TArgs is undefined here, so it matches a Layout with no specific params requirement
export default withServerData(getSedes, SedesProvider);
