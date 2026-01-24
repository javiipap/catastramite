import { withServerData } from "@/lib/store/with-server-data"
import { getUserRequestsAction } from "@/lib/actions/requests"
import { RequestsProvider } from "@/lib/queries/requests"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Requests",
  description: "Track the status of your submitted requests.",
};

export default withServerData(getUserRequestsAction, RequestsProvider);
