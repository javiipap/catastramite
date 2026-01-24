import { withServerData } from "@/lib/store/with-server-data"
import { getNotificationsAction } from "@/lib/actions/notifications"
import { NotificationsProvider } from "@/lib/queries/notifications"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View and manage system notifications.",
};

export default withServerData(getNotificationsAction, NotificationsProvider);
