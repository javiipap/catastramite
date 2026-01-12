import { withServerData } from "@/lib/store/with-server-data"
import { getHeadquarters } from "@/lib/db/headquarters"
import { HeadquartersListProvider } from "@/lib/queries/headquarters"

export default withServerData(getHeadquarters, HeadquartersListProvider);
