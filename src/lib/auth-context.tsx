"use client"

import { createContext, useContext, type ReactNode } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import type { SessionUser } from '@/lib/auth'

interface AuthContextType {
  user: SessionUser | null
  login: (callbackUrl?: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: isLoading } = authClient.useSession()
  const router = useRouter()

  const login = async (callbackUrl?: string) => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl || "/onboarding",
    })
  }

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login")
        }
      }
    })
  }

  // Map session.user to our User type
  if (session?.user) {
    console.log("AuthProvider - raw session.user:", session.user);
  }

  const user: SessionUser | null = (session?.user as unknown as SessionUser) ?? null

  if (user) {
    console.log("AuthProvider - mapped user:", user);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
