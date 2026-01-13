import { withServerData } from "@/lib/store/with-server-data"
import { getMasterHeadquartersAction } from "@/lib/actions/headquarters"
import { MasterHeadquartersListProvider } from "@/lib/queries/headquarters"

export default withServerData(getMasterHeadquartersAction as any, MasterHeadquartersListProvider);
