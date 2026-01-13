"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { MasterNav } from "@/components/master-nav"
import { useHeadquartersStore } from "@/lib/queries/headquarters"
import { getUserRoleAction } from "@/lib/actions/users"

export function MasterLayoutClient({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ headquartersId: string }> | { headquartersId: string }
}) {
  const { user, isLoading } = useAuth()
  const { data: headquarters } = useHeadquartersStore() // Get from new store
  const router = useRouter()
  const [headquartersId, setHeadquartersId] = useState<string | null>(null)

  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      setHeadquartersId(resolvedParams.headquartersId)
    })
  }, [params])

  useEffect(() => {
    // Perform async check for role
    const checkAccess = async () => {
      if (!isLoading && headquartersId && user) {
        const result = await getUserRoleAction({ userId: user.userId, headquartersId })
        if (result?.data !== 'master') {
          router.push("/")
        }
      } else if (!isLoading && !user) {
        router.push("/")
      }
    }
    checkAccess()
  }, [user, isLoading, headquartersId, router])

  if (isLoading || !headquartersId || !headquarters) { // Wait for headquarters data too
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="h-full flex">
      <aside className="hidden md:block w-64 border-r bg-card h-full overflow-y-auto p-6">
        <MasterNav headquartersId={headquartersId ?? undefined} />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}
