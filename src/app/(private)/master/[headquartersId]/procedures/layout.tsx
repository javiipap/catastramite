import { withServerData } from "@/lib/store/with-server-data"
import { getProceduresAction } from "@/lib/actions/procedures"
import { ProceduresProvider } from "@/lib/queries/procedures"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procedures",
  description: "Configure and manage headquarters procedures.",
};

export default withServerData(getProceduresAction, ProceduresProvider);
