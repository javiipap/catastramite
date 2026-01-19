import { withServerData } from "@/lib/store/with-server-data"
import { ProceduresProvider } from "@/lib/queries/procedures"
import { getProceduresAction } from '@/lib/actions/procedures';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procedures",
  description: "Browse and initiate new procedures.",
};

export default withServerData(getProceduresAction, ProceduresProvider);
