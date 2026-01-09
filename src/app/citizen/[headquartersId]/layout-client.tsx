"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useHeadquartersStore } from "@/lib/queries/headquarters"
import { getUserRole } from "@/lib/db/users"
import { CitizenHeader } from "@/components/slave-header"
import { CitizenNav } from "@/components/slave-nav"

export function CitizenLayoutClient({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ headquartersId: string }> | { headquartersId: string }
}) {
  const { user, isLoading } = useAuth()
  const { data: headquarters } = useHeadquartersStore()
  const router = useRouter()
  const [headquartersId, setHeadquartersId] = useState<string | null>(null)

  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
        setHeadquartersId(resolvedParams.headquartersId)
    })
  }, [params])

  useEffect(() => {
    // Perform async check for role/access if needed
    const checkAccess = async () => {
        if (!isLoading && headquartersId && user) {
             const role = await getUserRole(user.id, headquartersId)
             // Allow everyone or specific logic? 
             // Initially we allow 'slave' or 'master'.
             // If not member, maybe should auto-join or error?
             // Since we use getUserRole, it returns null if not associated.
             
             if (!role) {
                // If user is not associated, what do we do?
                // Probably redirect to home or some invite error.
                // Assuming currently they should be associated.
                router.push("/")
             }
        } else if (!isLoading && !user) {
             router.push("/")
        }
    }
    checkAccess()
  }, [user, isLoading, headquartersId, router])

  if (isLoading || !headquartersId || !headquarters) {
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
      <CitizenHeader headquartersId={headquartersId} />
      <div className="flex">
        <aside className="hidden md:block w-64 border-r bg-card p-6 min-h-[calc(100vh-4rem)]">
          <CitizenNav headquartersId={headquartersId} />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
