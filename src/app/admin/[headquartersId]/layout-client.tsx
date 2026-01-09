"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { AdminNav } from "@/components/admin-nav"
import { useHeadquartersStore } from "@/lib/queries/headquarters"
import { getUserRole } from "@/lib/db/users" 

export function AdminLayoutClient({
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
             const role = await getUserRole(user.id, headquartersId)
             if (role !== 'master') {
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
    <div className="min-h-screen bg-muted/30">
      <AdminHeader headquartersId={headquartersId} />
      <div className="flex">
        <aside className="hidden md:block w-64 border-r bg-card p-6 min-h-[calc(100vh-4rem)]">
          <AdminNav headquartersId={headquartersId} />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
