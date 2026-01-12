"use client"

import { createQueryStore } from "@/lib/store/create-query"
import { Request } from "@/lib/types"

import { getRequestsAction } from "@/lib/actions/requests"

export const {
  Provider: RequestsProvider,
  useStore: useRequestsStore
} = createQueryStore<Request[], { headquartersId: string }>({
  baseQueryKey: ["requests"],
  clientFetcher: async ({ headquartersId }) => {
    const result = await getRequestsAction({ headquartersId });
    return result?.data || [];
  }
})
