import { withServerData } from "@/lib/store/with-server-data"
import { getProceduresByParams } from "@/lib/db/procedures"
import { ProceduresProvider } from "@/lib/queries/procedures"

export default withServerData(getProceduresByParams, ProceduresProvider);
