import { withServerData } from "@/lib/store/with-server-data"
import { getNotificationsAction } from "@/lib/actions/notifications"
import { NotificationsProvider } from "@/lib/queries/notifications"

export default withServerData(getNotificationsAction, NotificationsProvider);
