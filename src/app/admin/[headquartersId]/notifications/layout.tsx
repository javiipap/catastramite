import { withServerData } from "@/lib/store/with-server-data"
import { useCases } from "@/use-cases"
import { NotificationsProvider } from "@/lib/queries/notifications"

export default withServerData((params: { headquartersId: string }) => useCases.notifications.getNotificationsByParams(params), NotificationsProvider);
