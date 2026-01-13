import { withServerData } from "@/lib/store/with-server-data"
import { getMasterHeadquartersAction } from "@/lib/actions/headquarters"
import { MasterHeadquartersListProvider } from "@/lib/queries/headquarters"

const fetcher = async () => (await getMasterHeadquartersAction())?.data || [];

export default withServerData(fetcher, MasterHeadquartersListProvider);
