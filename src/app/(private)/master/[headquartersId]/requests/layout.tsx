import { withServerData } from "@/lib/store/with-server-data"
import { getRequestsAction } from "@/lib/actions/requests"
import { RequestsProvider } from "@/lib/queries/requests"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Requests",
  description: "Process and review user requests.",
};

export default withServerData(getRequestsAction, RequestsProvider);
