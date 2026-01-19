import { MasterDashboardProvider } from '@/lib/queries/dashboard';
import { withServerData } from '@/lib/store/with-server-data';
import { getMasterDashboardDataAction } from '@/lib/actions/dashboard';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your headquarters requests and procedures.",
};

export default withServerData(getMasterDashboardDataAction, MasterDashboardProvider)