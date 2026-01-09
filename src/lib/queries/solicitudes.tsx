"use client"

import { createQueryStore } from "@/lib/store/create-query"
import { Solicitud } from "@/lib/types"

import { getSolicitudes } from "@/lib/db/requests"

export const { 
  Provider: SolicitudesProvider, 
  useStore: useSolicitudesStore 
} = createQueryStore<Solicitud[], { sedeId: string }>({
  baseQueryKey: ["solicitudes"],
  clientFetcher: async ({ sedeId }) => getSolicitudes(sedeId)
})
