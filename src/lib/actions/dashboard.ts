'use server'

import { useCases } from "@/use-cases"
import { DashboardData } from "@/lib/types"

export async function getAdminDashboardDataAction(params: { headquartersId: string }): Promise<DashboardData> {
    return useCases.dashboard.getAdminDashboardData(params)
}

export async function getSlaveDashboardDataAction(params: { headquartersId: string }): Promise<DashboardData> {
    return useCases.dashboard.getSlaveDashboardData(params)
}
