"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const headquartersId = params?.headquartersId as string | undefined

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/")
        return
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
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
    <div className="h-screen flex flex-col bg-muted/30">
      <div className="flex-none">
        <AdminHeader headquartersId={headquartersId} />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
