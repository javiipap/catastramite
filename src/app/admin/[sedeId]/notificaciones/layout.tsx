import { withServerData } from "@/lib/store/with-server-data"
import { getNotificationsByParams } from "@/lib/actions/notifications"
import { NotificationsProvider } from "@/lib/queries/notifications"

export default withServerData(getNotificationsByParams, NotificationsProvider);
