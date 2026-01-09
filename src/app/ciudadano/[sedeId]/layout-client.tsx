"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSedeStore } from "@/lib/queries/sedes"
import { getUserRole } from "@/lib/db/users"
import { CiudadanoHeader } from "@/components/ciudadano-header"
import { CiudadanoNav } from "@/components/ciudadano-nav"

export function CiudadanoLayoutClient({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ sedeId: string }> | { sedeId: string }
}) {
  const { user, isLoading } = useAuth()
  const { data: sede } = useSedeStore()
  const router = useRouter()
  const [sedeId, setSedeId] = useState<string | null>(null)

  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
        setSedeId(resolvedParams.sedeId)
    })
  }, [params])

  useEffect(() => {
    // Perform async check for role/access if needed
    // Citizen access logic might be different (open or invited).
    const checkAccess = async () => {
        if (!isLoading && sedeId && user) {
             const role = await getUserRole(user.id, sedeId)
             // Allow everyone or specific logic? 
             // Initially we allow "administrado" or "administrador".
             // If not member, maybe should auto-join or error?
             // Since we use getUserRole, it returns null if not associated.
             // If we want public access to sede, we just guard for logged in.
             // But existing view logic was checking role.
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
  }, [user, isLoading, sedeId, router])

  if (isLoading || !sedeId || !sede) {
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
      <CiudadanoHeader sedeId={sedeId} />
      <div className="flex">
        <aside className="hidden md:block w-64 border-r bg-card p-6 min-h-[calc(100vh-4rem)]">
          <CiudadanoNav sedeId={sedeId} />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
