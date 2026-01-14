export * from "./schemas/users";
export * from "./schemas/headquarters";
export * from "./schemas/procedures";
export * from "./schemas/requests";
export * from "./schemas/notifications";

import { Headquarters } from "./schemas/headquarters";
import { Procedure } from "./schemas/procedures";
import { Request } from "./schemas/requests";

export interface DashboardData {
  headquarters: Headquarters | undefined;
  procedures: Procedure[];
  requests: Request[];
}

export type Priority = "low" | "medium" | "high";
