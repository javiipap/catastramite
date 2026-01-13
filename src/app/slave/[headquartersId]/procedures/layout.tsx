import { withServerData } from "@/lib/store/with-server-data"
import { useCases } from "@/use-cases"
import { ProceduresProvider } from "@/lib/queries/procedures"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default withServerData(async (params: { headquartersId: string }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return useCases.procedures.getProcedures(params, session.user);
}, ProceduresProvider);
