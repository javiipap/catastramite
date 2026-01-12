import { withServerData } from "@/lib/store/with-server-data"
import { useCases } from "@/use-cases"
import { ProceduresProvider } from "@/lib/queries/procedures"

export default withServerData(useCases.procedures.getProcedures, ProceduresProvider);
