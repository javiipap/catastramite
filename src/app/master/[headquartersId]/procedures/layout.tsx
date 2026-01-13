import { withServerData } from "@/lib/store/with-server-data"
import { getProceduresAction } from "@/lib/actions/procedures"
import { ProceduresProvider } from "@/lib/queries/procedures"

export default withServerData(getProceduresAction, ProceduresProvider);
