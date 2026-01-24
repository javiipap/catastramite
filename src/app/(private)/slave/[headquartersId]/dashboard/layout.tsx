import { SlaveDashboardProvider } from '@/lib/queries/dashboard';
import { withServerData } from '@/lib/store/with-server-data';
import { getSlaveDashboardDataAction } from '@/lib/actions/dashboard';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your user dashboard for procedures and requests.",
};

export default withServerData(getSlaveDashboardDataAction, SlaveDashboardProvider);