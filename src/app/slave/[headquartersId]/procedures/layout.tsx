import { withServerData } from "@/lib/store/with-server-data"
import { ProceduresProvider } from "@/lib/queries/procedures"
import { getProceduresAction } from '@/lib/actions/procedures';

export default withServerData(getProceduresAction, ProceduresProvider);
