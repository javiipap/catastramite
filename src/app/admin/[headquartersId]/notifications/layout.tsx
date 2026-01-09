import { withServerData } from "@/lib/store/with-server-data"
import { getNotificationsByParams } from "@/lib/db/notifications"
import { NotificationsProvider } from "@/lib/queries/notifications"

export default withServerData(getNotificationsByParams, NotificationsProvider);
