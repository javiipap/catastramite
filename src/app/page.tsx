"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserSedes } from "@/lib/db/users"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkRedirect = async () => {
        if (!isLoading && user) {
            try {
                // Fetch user sedes using the server action
                const userSedes = await getUserSedes(user.id)

                if (userSedes.length > 0) {
                    const firstSede = userSedes[0]
                    if (firstSede.role === "administrador") {
                        router.push(`/admin/${firstSede.sedeId}/dashboard`)
                    } else {
                        router.push(`/ciudadano/${firstSede.sedeId}/dashboard`)
                    }
                } else {
                    // No sedes, redirect to sede management
                    router.push("/admin/sedes")
                }
            } catch (error) {
                console.error("Failed to fetch sedes", error)
            }
        }
    }
    
    checkRedirect()
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, we return null while redirecting
  if (user) {
    return null
  }

  // If not authenticated, show login form
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <LoginForm />
    </main>
  )
}
