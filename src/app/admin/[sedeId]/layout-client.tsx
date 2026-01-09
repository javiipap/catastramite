"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { AdminNav } from "@/components/admin-nav"
import { useSedeStore } from "@/lib/queries/sedes"
import { getUserRole } from "@/lib/db/users" 

export function SedeAdminLayoutClient({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ sedeId: string }> | { sedeId: string }
}) {
  const { user, isLoading } = useAuth()
  const { data: sede } = useSedeStore() // Get from new store
  const router = useRouter()
  const [sedeId, setSedeId] = useState<string | null>(null)

  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
        setSedeId(resolvedParams.sedeId)
    })
  }, [params])

  useEffect(() => {
    // Perform async check for role
    const checkAccess = async () => {
        if (!isLoading && sedeId && user) {
             const role = await getUserRole(user.id, sedeId)
             if (role !== "administrador") {
                router.push("/")
             }
        } else if (!isLoading && !user) {
             router.push("/")
        }
    }
    checkAccess()
  }, [user, isLoading, sedeId, router])

  if (isLoading || !sedeId || !sede) { // Wait for sede data too
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
      <AdminHeader sedeId={sedeId} />
      <div className="flex">
        <aside className="hidden md:block w-64 border-r bg-card p-6 min-h-[calc(100vh-4rem)]">
          <AdminNav sedeId={sedeId} />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
