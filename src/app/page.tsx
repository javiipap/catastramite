"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserHeadquarters } from "@/lib/db/users"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkRedirect = async () => {
        if (!isLoading && user) {
            try {
                // Fetch user headquarters using the server action
                const userHeadquarters = await getUserHeadquarters(user.id)

                if (userHeadquarters.length > 0) {
                    const firstHeadquarters = userHeadquarters[0]
                    if (firstHeadquarters.role === 'master') {
                        router.push(`/admin/${firstHeadquarters.headquartersId}/dashboard`)
                    } else {
                        router.push(`/slave/${firstHeadquarters.headquartersId}/dashboard`)
                    }
                } else {
                    // No headquarters, redirect to headquarters management
                    router.push("/admin/headquarters")
                }
            } catch (error) {
                console.error("Failed to fetch headquarters", error)
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
          <p className="mt-4 text-muted-foreground">Loading...</p>
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
