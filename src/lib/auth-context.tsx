"use client"

import { createContext, useContext, type ReactNode } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: () => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: isLoading } = authClient.useSession()
  const router = useRouter()

  const login = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/onboarding",
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
    console.log("AuthProvider - session.user.role:", session.user.role);
  }

  const user: User | null = session?.user
    ? {
      ...session.user,
      userId: session.user.id,
      role: session.user.role,
    } as unknown as User
    : null

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
