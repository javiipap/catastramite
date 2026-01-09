"use client"

import { createQueryStore } from "@/lib/store/create-query"
import { Request } from "@/lib/types"

import { getRequests } from "@/lib/db/requests"

export const { 
  Provider: RequestsProvider, 
  useStore: useRequestsStore 
} = createQueryStore<Request[], { headquartersId: string }>({
  baseQueryKey: ["requests"],
  clientFetcher: async ({ headquartersId }) => getRequests(headquartersId)
})
