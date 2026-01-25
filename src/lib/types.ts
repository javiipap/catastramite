export * from "./schemas/users";
export * from "./schemas/headquarters";
export * from "./schemas/procedures";
export * from "./schemas/requests";
export * from "./schemas/notifications";

import type { Headquarters } from "./schemas/headquarters";
import type { Procedure } from "./schemas/procedures";
import type { Request } from "./schemas/requests";

export interface DashboardData {
  headquarters: Headquarters | undefined;
  procedures: Procedure[];
  requests: Request[];
}

export type Priority = "low" | "medium" | "high";
