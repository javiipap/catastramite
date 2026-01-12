import { withServerData } from "@/lib/store/with-server-data"
import { getAllHeadquartersAction } from "@/lib/actions/headquarters"
import { HeadquartersListProvider } from "@/lib/queries/headquarters"

const fetcher = async () => (await getAllHeadquartersAction())?.data || [];

export default withServerData(fetcher, HeadquartersListProvider);
