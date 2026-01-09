import { withServerData } from "@/lib/store/with-server-data"
import { getHeadquarters } from "@/lib/db/headquarters"
import { HeadquartersListProvider } from "@/lib/queries/headquarters"

// TArgs is undefined here, so it matches a Layout with no specific params requirement
export default withServerData(getHeadquarters, HeadquartersListProvider);
