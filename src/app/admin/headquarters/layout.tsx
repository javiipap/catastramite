import { withServerData } from "@/lib/store/with-server-data"
import { getAdminHeadquartersAction } from "@/lib/actions/headquarters"
import { AdminHeadquartersListProvider } from "@/lib/queries/headquarters"

const fetcher = async () => (await getAdminHeadquartersAction())?.data || [];

export default withServerData(fetcher, AdminHeadquartersListProvider);
