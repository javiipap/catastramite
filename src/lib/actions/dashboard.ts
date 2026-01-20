"use server";

import { useCases } from "@/use-cases";
import { masterAction, slaveAction } from "@/lib/safe-action";
import { z } from "zod";

const dashboardSchema = z.object({
  headquartersId: z.string(),
});

export const getMasterDashboardDataAction = masterAction
  .inputSchema(dashboardSchema)
  .action(async ({ parsedInput: params, ctx: { user } }) => {
    return useCases.dashboard.getMasterDashboardData(params, {
      userId: user.userId,
    });
  });

export const getSlaveDashboardDataAction = slaveAction
  .inputSchema(dashboardSchema)
  .action(async ({ parsedInput: params, ctx: { user } }) => {
    return useCases.dashboard.getSlaveDashboardData(params, {
      userId: user.userId,
    });
  });
